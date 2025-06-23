<?php
require "../models/Admin.php";

$adminModel = new Admin($pdo);

function obtenerAdmin() {
    global $adminModel;
    echo json_encode($adminModel->obtenerAdmin());
}

function agregarAdmin($nombre_completo, $email, $area) {
    global $adminModel;
    if ($adminModel->agregar($nombre_completo, $email, $area)) {
        echo json_encode(["message" => "Administrador agregado correctamente."]);
    } else {
        echo json_encode(["message" => "Error al agregar el administrador."]);
    }
}

function eliminarAdmin($id) {
    global $adminModel;
    if ($adminModel->eliminar($id)) {
        echo json_encode(["message" => "Administrador eliminado correctamente."]);
    } else {
        echo json_encode(["message" => "Error al eliminar el administrador."]);
    }
}
?>