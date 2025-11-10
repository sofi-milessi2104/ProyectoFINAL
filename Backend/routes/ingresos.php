<?php
// Backend/routes/ingresos.php
// Endpoint autónomo: devuelve ingresos mensuales y total del mes actual en JSON

header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *"); // opcional para pruebas desde front en otro origen

// Ajusta la ruta si tu conexión está en otro lugar
require_once __DIR__ . "/../config/database.php"; // <- Asegúrate que crea $pdo (PDO)

$action = $_GET['action'] ?? 'por_mes';

try {
    // Validamos que exista $pdo
    if (!isset($pdo)) {
        throw new Exception("Conexión PDO no encontrada. Revisa /config/database.php");
    }

    // Consulta: calculamos por reserva (noches * precio habitación)
    // Notas:
    // - Tus precios en 'habitacion.precio' vienen como strings con puntos como separador de miles (ej '3.438').
    // - Reemplazamos '.' y cast a DECIMAL para poder sumar.
    // - usamos DATEDIFF(fecha_fin, fecha_inicio) para noches (2/8->3 = 1 night? depende; si necesitas +1 cambialo).
    $sqlPorMes = "
        SELECT
            MONTH(r.fecha_inicio) AS mes,
            SUM(
                (DATEDIFF(r.fecha_fin, r.fecha_inicio)) * CAST(REPLACE(h.precio, '.', '') AS DECIMAL(10,2))
            ) AS total
        FROM reserva r
        INNER JOIN habitacion h ON r.id_habitacion = h.id_hab
        GROUP BY MONTH(r.fecha_inicio)
        ORDER BY MONTH(r.fecha_inicio)
    ";

    // Ingresos del mes actual
    $sqlMesActual = "
        SELECT
            SUM(
                (DATEDIFF(r.fecha_fin, r.fecha_inicio)) * CAST(REPLACE(h.precio, '.', '') AS DECIMAL(10,2))
            ) AS total_mes
        FROM reserva r
        INNER JOIN habitacion h ON r.id_habitacion = h.id_hab
        WHERE MONTH(r.fecha_inicio) = MONTH(CURDATE()) AND YEAR(r.fecha_inicio) = YEAR(CURDATE())
    ";

    if ($action === 'mes') {
        $stmt = $pdo->query($sqlMesActual);
        $res = $stmt->fetch(PDO::FETCH_ASSOC);
        echo json_encode([
            "success" => true,
            "ingresos_mes" => $res['total_mes'] !== null ? (float)$res['total_mes'] : 0
        ]);
        exit;
    }

    // default: por_mes -> array por mes
    $stmt = $pdo->query($sqlPorMes);
    $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Normalizamos: poner mes como int y total como float
    $out = array_map(function($r) {
        return [
            "mes" => (int)$r['mes'],
            "total" => (float)$r['total']
        ];
    }, $rows);

    echo json_encode([
        "success" => true,
        "ingresos_por_mes" => $out
    ]);
    exit;

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "error" => "Error DB: " . $e->getMessage()]);
    exit;
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "error" => $e->getMessage()]);
    exit;
}
