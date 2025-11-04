<?php
require "../config/database.php";
require "../models/Usuario.php";

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require __DIR__ . '/../../vendor/autoload.php';

$usuarioModel = new Usuario($pdo);

function obtenerUsuario() {
    global $usuarioModel;
    echo json_encode($usuarioModel->obtenerUsuario());
}

function loginAddUser($nombre, $apellido, $email, $celular, $password) {
    global $usuarioModel;
    header('Content-Type: application/json; charset=utf-8');

    try {
        if ($usuarioModel->loginAdd($nombre, $apellido, $email, $celular, $password)) {

           
            $mail = new PHPMailer(true);
            try {
                $mail->isSMTP();
                $mail->Host       = 'smtp.gmail.com';
                $mail->SMTPAuth   = true;
                $mail->Username   = 'sofia.milessi2008@gmail.com';
                $mail->Password   = 'sshyxbeijzqnmzjl';
                $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
                $mail->Port       = 587;

                $mail->setFrom('sofia.milessi2008@gmail.com', 'Tu Proyecto');
                $mail->addAddress($email, $nombre . ' ' . $apellido);
                $mail->isHTML(true);
                $mail->Subject = '¡Gracias por registrarte!';
                $mail->Body = "<h2>Hola, $nombre </h2><p>Gracias por registrarte.</p>";

                $mail->send();
            } catch (Exception $e) {
                error_log("Error al enviar el correo: {$mail->ErrorInfo}");
            }

            echo json_encode([
                "status" => true,
                "rol" => "usuario"
            ]);
        } else {
            echo json_encode(["status" => false, "message" => "Error al agregar el usuario."]);
        }
    } catch (Throwable $t) {
        
        echo json_encode(["status" => false, "message" => "Error interno: " . $t->getMessage()]);
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

        
        $mail = new PHPMailer(true);
        try {
            $mail->isSMTP();
            $mail->Host       = 'smtp.gmail.com';
            $mail->SMTPAuth   = true;
            $mail->Username   = 'sofia.milessi2008@gmail.com';     
            $mail->Password   = 'sshyxbeijzqnmzjl'; 
            $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
            $mail->Port       = 587;

            $mail->setFrom('sofia.milessi2008@gmail.com', 'Tu Proyecto');
            $mail->addAddress($email);

            $mail->isHTML(true);
            $mail->Subject = 'Inicio de sesión exitoso ';
            $mail->Body = "
                <div style='font-family: Arial, sans-serif; color:#333;'>
                    <p>Hola $email </p>
                    <p>Iniciaste sesión correctamente en tu cuenta.</p>
                    <p>¡Nos alegra verte de nuevo!</p>
                </div>
            ";

            $mail->send();
        } catch (Exception $e) {
            error_log(" Error al enviar correo de inicio de sesión: {$mail->ErrorInfo}");
        }

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