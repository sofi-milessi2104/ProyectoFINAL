<?php
require_once "../models/Promocion.php";

$promocionModel = new Promocion($pdo);

function obtenerPromocion() {
    global $promocionModel;
    echo json_encode($promocionModel->obtenerPromocion());
}

function agregarPromocion($tipo_promo, $descripcion_promo, $img_promo, $precio_promo) {
    global $promocionModel;
    if ($promocionModel->agregar($tipo_promo, $descripcion_promo, $img_promo, $precio_promo)) {
        echo json_encode(["success" => true, "message" => "Promoción agregada correctamente."]);
    } else {
        echo json_encode(["success" => false, "message" => "Error al agregar la promoción."]);
    }
}

function eliminarPromocion($id) {
    global $promocionModel;
    if ($promocionModel->eliminar($id)) {
        echo json_encode(["success" => true, "message" => "Promoción eliminada correctamente."]);
    } else {
        echo json_encode(["success" => false, "message" => "Error al eliminar la promoción."]);
    }
}

function editarPromocion($id, $tipo_promo, $descripcion_promo, $img_promo, $precio_promo) {
    global $promocionModel;
    if ($promocionModel->editar($id, $tipo_promo, $descripcion_promo, $img_promo, $precio_promo)) {
        echo json_encode(["success" => true, "message" => "Promoción actualizada correctamente."]);
    } else {
        echo json_encode(["success" => false, "message" => "Error al actualizar la promoción."]);
    }
}

function obtenerPromocionPorId($id) {
    global $promocionModel;
    $promocion = $promocionModel->obtenerPorId($id);
    if ($promocion) {
        echo json_encode($promocion);
    } else {
        echo json_encode(["success" => false, "message" => "Promoción no encontrada."]);
    }
}
?>