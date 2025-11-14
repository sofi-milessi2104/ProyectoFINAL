<?php
// Configuración de errores para desarrollo
ini_set('display_errors', 0);       // No mostrar errores en pantalla
ini_set('log_errors', 1);           // Guardar errores en log
error_reporting(E_ALL);

require_once "../config/database.php";
require_once "../models/Reserva.php";
require_once "../models/Reserva_servicio.php";

header("Content-Type: application/json; charset=UTF-8");

$input = null; // Solo se llenará para POST
// Logs mínimos de contexto
error_log("Request method: " . $_SERVER['REQUEST_METHOD']);
error_log("Content-Type: " . ($_SERVER['CONTENT_TYPE'] ?? 'not set'));

$reservaModel = new Reserva($pdo);
$reservaServicioModel = new Reserva_servicio($pdo);

try {
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        // Leer JSON enviado desde JS SOLO para POST
        $rawInput = file_get_contents("php://input");
        $input = json_decode($rawInput, true);
        if (!$input || !is_array($input)) {
            // Intentar con POST tradicional (application/x-www-form-urlencoded o multipart)
            if (!empty($_POST)) {
                $input = $_POST;
                error_log("Using POST data instead: " . print_r($input, true));
            }
        }

        if (!$input || !is_array($input)) {
            echo json_encode([
                'success' => false,
                'message' => 'Datos inválidos o no recibidos',
                'debug' => [
                    'raw_length' => isset($rawInput) ? strlen($rawInput) : 0,
                    'json_error' => json_last_error_msg(),
                    'method' => $_SERVER['REQUEST_METHOD'],
                    'content_type' => $_SERVER['CONTENT_TYPE'] ?? 'not set'
                ]
            ]);
            exit;
        }

        if (isset($input['action']) && $input['action'] === 'agregarReserva') {
            $resultado = $reservaModel->agregarReserva($input);
            echo json_encode($resultado);
        } elseif (isset($input['action']) && $input['action'] === 'eliminar') {
            // Eliminar reserva
            $id_reserva = $input['id_reserva'] ?? null;
            
            if (!$id_reserva) {
                echo json_encode(['success' => false, 'message' => 'ID de reserva no proporcionado']);
                exit;
            }
            
            try {
                // Iniciar transacción
                $pdo->beginTransaction();
                
                // Eliminar servicios asociados primero
                $stmtServ = $pdo->prepare("DELETE FROM reserva_servicio WHERE id_reserva = ?");
                $stmtServ->execute([$id_reserva]);
                
                // Eliminar la reserva
                $stmtReserva = $pdo->prepare("DELETE FROM reserva WHERE id_reserva = ?");
                $stmtReserva->execute([$id_reserva]);
                
                $pdo->commit();
                echo json_encode(['success' => true, 'message' => 'Reserva cancelada correctamente']);
            } catch (PDOException $e) {
                $pdo->rollBack();
                echo json_encode(['success' => false, 'message' => 'Error al cancelar la reserva: ' . $e->getMessage()]);
            }
        } else {
            echo json_encode(['success' => false, 'message' => 'Acción POST no válida']);
        }
    } elseif ($_SERVER['REQUEST_METHOD'] === 'GET' && isset($_GET['action']) && $_GET['action'] === 'obtenerReservasUsuario') {
        // Obtener reservas de un usuario específico
        $id_usuario = $_GET['id_usuario'] ?? null;
        if ($id_usuario) {
            $resultado = $reservaModel->obtenerReservasPorUsuario($id_usuario);
            echo json_encode($resultado);
        } else {
            echo json_encode(['success' => false, 'message' => 'ID de usuario no proporcionado']);
        }
    } else {
        echo json_encode(['success' => false, 'message' => 'Acción no válida o método incorrecto']);
    }
} catch (Exception $e) {
    // Capturar cualquier error y devolverlo en JSON
    echo json_encode([
        'success' => false,
        'message' => 'Error en el servidor: ' . $e->getMessage()
    ]);
}