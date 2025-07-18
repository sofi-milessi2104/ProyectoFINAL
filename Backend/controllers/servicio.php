<?php
require "../models/Servicio.php";

$servicioModel = new Servicio($pdo);

function obtenerServicio() {
    global $servicioModel;
    echo json_encode($servicioModel->obtenerServicio());
}

function agregarServicio($tipo_servicio, $precio, $descripcion_servicio) {
    global $servicioModel;
    if ($servicioModel->agregar($tipo_servicio, $precio, $descripcion_servicio)) {
        echo json_encode(["message" => "Servicio agregado correctamente."]);
    } else {
        echo json_encode(["message" => "Error al agregar el servicio."]);
    }
}

function eliminarServicio($id) {
    global $servicioModel;
    if ($servicioModel->eliminar($id)) {
        echo json_encode(["message" => "Servicio eliminado correctamente."]);
    } else {
        echo json_encode(["message" => "Error al eliminar el servicio."]);
    }
}
?>