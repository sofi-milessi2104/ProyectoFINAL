<?php
ini_set('display_errors', 0);
ini_set('log_errors', 1);
error_reporting(E_ALL);

require_once "../config/database.php"; 
require_once "../models/Reserva.php";
require_once "../models/Reserva_servicio.php";

header("Content-Type: application/json; charset=UTF-8");

$action = $_GET['action'] ?? null; 

$input = json_decode(file_get_contents("php://input"), true);

$reservaModel = new Reserva($pdo);
$reservaServicioModel = new Reserva_servicio($pdo);

try {
    if ($_SERVER['REQUEST_METHOD'] === 'GET' && $action === 'count_today') {
        $count = $reservaModel->countTodayReservations();
        echo json_encode(['success' => true, 'count' => $count]);
        exit; 
    }
    
    if ($_SERVER['REQUEST_METHOD'] === 'GET' && $action === 'list_today') {
        $list = $reservaModel->getTodayReservationsList();
        
        echo json_encode($list); 
        exit;
    }

    if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($input['action']) && $input['action'] === 'agregarReserva') {
        if (!$input) {
            echo json_encode(['success' => false, 'message' => 'Datos inválidos o no recibidos']);
            exit;
        }
        $resultado = $reservaModel->agregarReserva($input);
        echo json_encode($resultado);
        exit;
    } 

    echo json_encode(['success' => false, 'message' => 'Acción no válida o método incorrecto.']);

} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Error en el servidor: ' . $e->getMessage()
    ]);
}
?>