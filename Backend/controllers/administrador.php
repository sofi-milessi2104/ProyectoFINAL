<?php
require "../models/Administrador.php";

$administradorModel = new Administrador($pdo);

function obtenerAdministrador() {
    global $administradorModel;
    echo json_encode($administradorModel->obtenerAdministrador());
}

function loginAddAdmin($ci, $nombre_completo, $email, $area, $password) {
    global $administradorModel;
    if ($administradorModel->loginAdd($ci, $nombre_completo, $email, $area, $password)) {
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