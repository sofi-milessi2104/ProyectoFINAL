<?php
require "../models/Promocion.php";

$promocionModel = new Promocion($pdo);

function obtenerPromocion() {
    global $promocionModel;
    echo json_encode($promocionModel->obtenerhabitacion());
}

function agregarHabitacion($tipo_hab,$descripcion_hab,$cantidad) {
    global $promocionModel;
    if ($promocionModel->agregar($tipo_hab,$descripcion_hab,$cantidad)) {
        echo json_encode(["message" => "Habitacion agregada correctamente."]);
    } else {
        echo json_encode(["message" => "Error al agregar la habitacion."]);
    }
}

function eliminarHabitacion($id) {
    global $promocionModel;
    if ($promocionModel->eliminar($id)) {
        echo json_encode(["message" => "Habitacion eliminada correctamente."]);
    } else {
        echo json_encode(["message" => "Error al eliminar la habitacion."]);
    }
}
?>