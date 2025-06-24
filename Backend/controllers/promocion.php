<?php
require "../models/Promocion.php";

$promocionModel = new Promocion($pdo);

function obtenerPromocion() {
    global $promocionModel;
    echo json_encode($promocionModel->obtenerPromocion());
}

function agregarPromocion($tipo_promo) {
    global $promocionModel;
    if ($promocionModel->agregar($tipo_promo)) {
        echo json_encode(["message" => "Promocion agregada correctamente."]);
    } else {
        echo json_encode(["message" => "Error al agregar la promocion."]);
    }
}

function eliminarPromocion($id) {
    global $promocionModel;
    if ($promocionModel->eliminar($id)) {
        echo json_encode(["message" => "Habitacion eliminada correctamente."]);
    } else {
        echo json_encode(["message" => "Error al eliminar la habitacion."]);
    }
}
?>