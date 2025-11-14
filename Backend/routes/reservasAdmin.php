<?php
// reservasAdmin.php
// Devuelve la lista de reservas como JSON limpia (sin salida adicional)

// 1) Iniciar buffer para capturar cualquier salida accidental (warnings, echoes)
ob_start();

// 2) Forzar cabecera JSON
header("Content-Type: application/json; charset=UTF-8");

// Responder helper: limpia buffer y devuelve JSON
function responder($data, $status = 200) {
    http_response_code($status);
    if (ob_get_length() > 0) {
        ob_clean();
    }
    echo json_encode($data, JSON_UNESCAPED_UNICODE);
    exit();
}

// Main: conectar DB y devolver reservas
try {
    require __DIR__ . "/../config/database.php";

    if (!isset($pdo) || !$pdo) {
        throw new Exception("La conexión a la base de datos no está disponible.");
    }

    // Verificar si es una petición POST para eliminar
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $input = json_decode(file_get_contents('php://input'), true);
        
        if (isset($input['action']) && $input['action'] === 'eliminar') {
            $id_reserva = $input['id_reserva'] ?? null;
            
            if (!$id_reserva) {
                responder(['success' => false, 'message' => 'ID de reserva no proporcionado'], 400);
            }
            
            // Iniciar transacción
            $pdo->beginTransaction();
            
            try {
                // Eliminar primero los servicios asociados
                $stmtServ = $pdo->prepare("DELETE FROM reserva_servicio WHERE id_reserva = ?");
                $stmtServ->execute([$id_reserva]);
                
                // Luego eliminar la reserva
                $stmtReserva = $pdo->prepare("DELETE FROM reserva WHERE id_reserva = ?");
                $stmtReserva->execute([$id_reserva]);
                
                $pdo->commit();
                responder(['success' => true, 'message' => 'Reserva eliminada correctamente'], 200);
            } catch (Exception $e) {
                $pdo->rollBack();
                responder(['success' => false, 'message' => 'Error al eliminar: ' . $e->getMessage()], 500);
            }
        }
    }

    // Query: obtener reservas con usuario (si existe), habitación y servicios (resumido)
    $sql = "
        SELECT
            r.id_reserva AS id,
            COALESCE(CONCAT(u.nombre, ' ', u.apellido), 'No registrado') AS usuario,
            r.adultos AS adultos,
            r.niños AS ninos,
            r.fecha_inicio AS check_in,
            r.fecha_fin AS check_out,
            COALESCE(h.tipo_hab, '') AS habitacion,
            COALESCE(GROUP_CONCAT(s.tipo_servicio SEPARATOR ', '), '') AS servicios_extra_resumen
        FROM reserva r
        LEFT JOIN usuario u ON r.id_usuario = u.id_usuario
        LEFT JOIN habitacion h ON r.id_habitacion = h.id_hab
        LEFT JOIN reserva_servicio rs ON r.id_reserva = rs.id_reserva
        LEFT JOIN servicio s ON rs.id_servicio = s.id_servicio
        GROUP BY r.id_reserva
        ORDER BY r.id_reserva DESC
    ";

    $stmt = $pdo->prepare($sql);
    $stmt->execute();
    $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Añadir campo 'estado' por compatibilidad con frontend (por defecto Pendiente)
    $reservas = array_map(function($r) {
        $r['estado'] = 'Pendiente';
        return $r;
    }, $rows);

    responder($reservas, 200);

} catch (Throwable $e) {
    responder(["error" => "Error interno: " . $e->getMessage()], 500);
}