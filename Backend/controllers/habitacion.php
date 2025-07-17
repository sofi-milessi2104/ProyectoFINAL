<?php
require "../models/Habitacion.php";

$habitacionModel = new Habitacion($pdo);

function obtenerHabitacion() {
    global $habitacionModel;
    echo json_encode($habitacionModel->obtenerHabitacion());
}

function agregarHabitacion($tipo_hab, $descripcion_hab, $cantidad, $imagen, $precio) {
    global $habitacionModel;
    if ($habitacionModel->agregar($tipo_hab, $descripcion_hab, $cantidad, $imagen, $precio)) {
        echo json_encode(["message" => "Habitación agregada correctamente."]);
    } else {
        echo json_encode(["message" => "Error al agregar la habitación."]);
    }
}

function eliminarHabitacion($id) {
    global $habitacionModel;
    if ($habitacionModel->eliminar($id)) {
        echo json_encode(["message" => "Habitación eliminada correctamente."]);
    } else {
        echo json_encode(["message" => "Error al eliminar la habitación."]);
    }
}
?>