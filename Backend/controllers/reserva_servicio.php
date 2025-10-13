<?php
require_once "../config/database.php";
require_once "../models/Reserva_servicio.php";

header("Content-Type: application/json; charset=UTF-8");

$reservaServicioModel = new Reserva_servicio($pdo);

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if (isset($_GET['id_reserva'])) {
        $id = $_GET['id_reserva'];
        $servicios = $reservaServicioModel->obtenerServiciosPorReserva($id);
        echo json_encode(['success' => true, 'servicios' => $servicios]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Falta el id_reserva']);
    }
    exit;
}
?>