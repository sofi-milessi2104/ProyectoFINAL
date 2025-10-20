<?php
ini_set('display_errors', 0);
ini_set('log_errors', 1);
error_reporting(E_ALL);

require_once "../config/database.php";
require_once "../models/Reserva.php";
require_once "../models/Reserva_servicio.php";

header("Content-Type: application/json; charset=UTF-8");

$input = json_decode(file_get_contents("php://input"), true);

if (!$input) {
    echo json_encode(['success' => false, 'message' => 'Datos inválidos o no recibidos']);
    exit;
}

$reservaModel = new Reserva($pdo);
$reservaServicioModel = new Reserva_servicio($pdo);

try {
    if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($input['action']) && $input['action'] === 'agregarReserva') {
        $resultado = $reservaModel->agregarReserva($input);
        echo json_encode($resultado);
    } else {
        echo json_encode(['success' => false, 'message' => 'Acción no válida o método incorrecto']);
    }
} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Error en el servidor: ' . $e->getMessage()
    ]);
}
