<?php
require "../models/Usuario.php";

$usuarioModel = new Usuario($pdo);

function obtenerUsuario() {
    global $usuarioModel;
    echo json_encode($usuarioModel->obtenerUsuario());
}

function agregarUsuario($nombre, $apellido, $email, $celular) {
    global $usuarioModel;
    if ($usuarioModel->agregar($nombre, $apellido, $email, $celular)) {
        echo json_encode(["message" => "Usuario agregado correctamente."]);
    } else {
        echo json_encode(["message" => "Error al agregar el usuario."]);
    }
}

function eliminarUsuario($id) {
    global $usuarioModel;
    if ($usuarioModel->eliminar($id)) {
        echo json_encode(["message" => "Usuario eliminado correctamente."]);
    } else {
        echo json_encode(["message" => "Error al eliminar el usuario."]);
    }
}
?>