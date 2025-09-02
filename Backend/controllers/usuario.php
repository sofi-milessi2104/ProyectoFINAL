<?php
require "../models/Usuario.php";

$usuarioModel = new Usuario($pdo);

function obtenerUsuario() {
    global $usuarioModel;
    echo json_encode($usuarioModel->obtenerUsuario());
}

function loginAddUser($nombre, $apellido, $email, $celular, $password) {
    global $usuarioModel;
    if ($usuarioModel->loginAdd($nombre, $apellido, $email, $celular, $password)) {
        echo json_encode([
            "status" => true,
            "rol" => "usuario",
            "data" => $resultado
        ]);
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

function loginUsuario($email, $password) {
    global $usuarioModel;
    $resultado = $usuarioModel->login($email, $password);
    if ($resultado) {
        echo json_encode([
            "status" => true,
            "rol" => "usuario",
            "data" => $resultado
        ]);
    } else {
        echo json_encode(["status" => false, "message" => "Credenciales incorrectas"]);
    }
}

?>