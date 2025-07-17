<?php
require "../models/Administrador.php";

$administradorModel = new Administrador($pdo);

function obtenerAdministrador() {
    global $administradorModel;
    echo json_encode($administradorModel->obtenerAdministrador());
}

function agregarAdministrador($ci, $nombre_completo, $email, $area) {
    global $administradorModel;
    if ($administradorModel->agregar($ci, $nombre_completo, $email, $area)) {
        echo json_encode(["message" => "Administrador agregado correctamente."]);
    } else {
        echo json_encode(["message" => "Error al agregar el administrador."]);
    }
}

function eliminarAdministrador($id) {
    global $administradorModel;
    if ($administradorModel->eliminar($id)) {
        echo json_encode(["message" => "Administrador eliminado correctamente."]);
    } else {
        echo json_encode(["message" => "Error al eliminar el administrador."]);
    }
}

function loginAdministrador($email, $password) {
    global $administradorModel;
    $resultado = $administradorModel->login($email, $password);
    if ($resultado) {
        echo json_encode(["status" => true, "message" => "Credenciales correctas"]);
    } else {
        echo json_encode(["status" => false, "message" => "Credenciales incorrectas"]);
    }
}

?> 