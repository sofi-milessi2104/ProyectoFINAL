<?php
require "../models/Reserva.php";

$reservaModel = new Reserva($pdo);

function obtenerReserva() {
    global $reservaModel;
    echo json_encode($reservaModel->obtenerReserva());
}

function agregarReserva($nombre, $apellido, $email, $adultos, $niños, $fecha_inicio, $fecha_fin, $tipo_hab, $tipo_servicio, $promoción, $huesped, $tarjeta) {
    global $reservaModel;
    if ($reservaModel->agregar($nombre, $apellido, $email, $adultos, $niños, $fecha_inicio, $fecha_fin, $tipo_hab, $tipo_servicio, $promoción, $huesped, $tarjeta)) {
        echo json_encode(["message" => "Reserva agregada correctamente."]);
    } else {
        echo json_encode(["message" => "Error al agregar la reserva."]);
    }
}

function eliminarReserva($id) {
    global $reservaModel;
    if ($reservaModel->eliminar($id)) {
        echo json_encode(["message" => "Reserva eliminada correctamente."]);
    } else {
        echo json_encode(["message" => "Error al eliminar la reserva."]);
    }
}
?>