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

            $mail->setFrom('sofia.milessi2008@gmail.com', 'Hotel Costa Colonia');
            $mail->addAddress($email);

            $mail->isHTML(true);
            $mail->Subject = 'Bienvenido/a nuevamente a Hotel Costa Colonia';

            $mail->Body = "
                <div style='
                    font-family: Arial, sans-serif;
                    padding: 30px;
                    background-color: #f9fdf9;
                    border: 1px solid #e0eee0;
                    border-radius: 12px;
                    max-width: 600px;
                    margin: auto;
                    box-shadow: 0 4px 10px rgba(0,0,0,0.05);
                '>
                    <div style='text-align: center; margin-bottom: 25px;'>
                       <h1 style='color: #2f5d50; margin-top: 15px; font-size: 24px;'>Hotel Costa Colonia</h1>
                    </div>

                    <div style='color: #333;'>
                        <h2 style='color: #3b7a57;'>¡Hola de nuevo!</h2>
                        <p style='font-size: 16px; line-height: 1.6;'>
                            Nos alegra verte regresar a <strong>Hotel Costa Colonia</strong>.  
                            Tu inicio de sesión fue exitoso y ya puedes continuar disfrutando de nuestras experiencias únicas frente al río.
                        </p>

                        <p style='font-size: 16px; line-height: 1.6;'>
                            Te esperamos con nuestras mejores promociones y servicios exclusivos 🌿
                        </p>

                        <div style='margin-top: 30px; text-align: center;'>
                            <a href='https://hotelcostacolonia.com' 
                               style='
                                   background-color: #3b7a57; 
                                   color: white; 
                                   padding: 12px 25px; 
                                   text-decoration: none; 
                                   border-radius: 25px; 
                                   font-weight: bold;
                               '>
                               Ir al sitio
                            </a>
                        </div>
                    </div>

                    <hr style='margin-top: 35px; border: none; border-top: 1px solid #ddd;'>

                    <p style='font-size: 12px; color: #888; text-align: center; margin-top: 15px;'>
                        © Hotel Costa Colonia, Uruguay.<br>
                        Este mensaje fue enviado automáticamente, por favor no respondas.
                    </p>
                </div>
            ";

            $mail->send();
        } catch (Exception $e) {
            error_log("Error al enviar correo de inicio de sesión: {$mail->ErrorInfo}");
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

function eliminarUsuario($id) {
    global $usuarioModel;
    if ($usuarioModel->eliminar($id)) {
        echo json_encode(["message" => "Usuario eliminado correctamente."]);
    } else {
        echo json_encode(["message" => "Error al eliminar el usuario."]);
    }
}
?>


