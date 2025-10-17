<?php
require "../config/database.php";
require "../models/Servicio.php";

$servicioModel = new Servicio($pdo);

function obtenerServicio() {
    global $servicioModel;
    echo json_encode($servicioModel->obtenerServicio());
}

function agregarServicio($tipo_servicio, $descripcion_servicio, $imagen) {
    global $servicioModel;
    if ($servicioModel->agregar($tipo_servicio, $descripcion_servicio, $imagen)) {
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

