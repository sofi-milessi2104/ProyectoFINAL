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
    $id_promo = func_num_args() > 3 ? func_get_arg(3) : null;
    $resultado = $servicioModel->agregar($tipo_servicio, $descripcion_servicio, $imagen, $id_promo);
    if ($resultado === true) {
        echo json_encode(["success" => true, "message" => "Servicio agregado correctamente."]);
    } else {
        echo json_encode(["success" => false, "message" => "Error al agregar el servicio.", "error" => $resultado]);
    }
}

function eliminarServicio($id) {
    global $servicioModel;
    if ($servicioModel->eliminar($id)) {
        echo json_encode(["success" => true, "message" => "Servicio eliminado correctamente."]);
    } else {
        echo json_encode(["success" => false, "message" => "Error al eliminar el servicio."]);
    }
}

function editarServicio($id, $tipo_servicio, $descripcion_servicio, $imagen) {
    global $servicioModel;
    if ($servicioModel->editar($id, $tipo_servicio, $descripcion_servicio, $imagen)) {
        echo json_encode(["success" => true, "message" => "Servicio actualizado correctamente."]);
    } else {
        echo json_encode(["success" => false, "message" => "Error al actualizar el servicio."]);
    }
}

function obtenerServicioPorId($id) {
    global $servicioModel;
    $servicio = $servicioModel->obtenerPorId($id);
    if ($servicio) {
        echo json_encode(["success" => true, "data" => $servicio]);
    } else {
        echo json_encode(["success" => false, "message" => "Servicio no encontrado."]);
    }
}
?>

