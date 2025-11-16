<?php

error_reporting(E_ALL);
ini_set('display_errors', 1);
header('Content-Type: application/json');

require __DIR__ . '/../../vendor/autoload.php';

require "../config/database.php";
require "../models/Usuario.php";

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;
use PHPMailer\PHPMailer\SMTP;

$usuarioModel = new Usuario($pdo);

function obtenerUsuario() {
    global $usuarioModel;
    echo json_encode($usuarioModel->obtenerUsuario());
}

function loginAddUser($nombre, $apellido, $email, $celular, $password) {
    global $usuarioModel;
    header('Content-Type: application/json; charset=utf-8');

    try {
        $res = $usuarioModel->loginAdd($nombre, $apellido, $email, $celular, $password);

        if (is_array($res) && !empty($res['ok'])) {
            $nuevoId = $res['id'] ?? null;

            if (class_exists('PHPMailer\PHPMailer\PHPMailer')) {
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
                    $mail->Subject = '¡Bienvenido/a a Hotel Costa Colonia!';
                    $mail->Body = "
                        <!DOCTYPE html>
                        <html lang='es'>
                        <head>
                            <meta charset='UTF-8'>
                            <meta name='viewport' content='width=device-width, initial-scale=1.0'>
                            <title>Bienvenido/a a Hotel Costa Colonia</title>
                        </head>
                        <body style='margin: 0; padding: 0; background-color: #f0f4f0;'>
                            <table border='0' cellpadding='0' cellspacing='0' width='100%'>
                                <tr>
                                    <td style='padding: 20px 0 30px 0;'>
                                        <table align='center' border='0' cellpadding='0' cellspacing='0' width='600' style='border-collapse: collapse; border: 1px solid #e0eee0; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1); background-color: #ffffff;'>
                                            
                                            <tr>
                                                <td align='center' bgcolor='#2f5d50' style='padding: 30px 0 30px 0; color: #ffffff; font-size: 28px; font-weight: bold; font-family: Arial, sans-serif;'>
                                                    Hotel Costa Colonia
                                                </td>
                                            </tr>
                                            
                                            <tr>
                                                <td bgcolor='#ffffff' style='padding: 40px 30px 40px 30px;'>
                                                    <table border='0' cellpadding='0' cellspacing='0' width='100%'>
                                                        <tr>
                                                            <td style='color: #3b7a57; font-family: Arial, sans-serif; font-size: 24px;'>
                                                                <b>¡Hola $nombre!</b> 
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td style='padding: 20px 0 30px 0; color: #333333; font-family: Arial, sans-serif; font-size: 16px; line-height: 22px;'>
                                                                Bienvenido/a a Hotel Costa Colonia! Tu cuenta ha sido creada exitosamente. A partir de ahora podés iniciar sesión y disfrutar de todos nuestros servicios exclusivos diseñados para ti.
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td style='color: #555555; font-family: Arial, sans-serif; font-size: 16px; line-height: 22px;'>
                                                                Tu estadía inigualable te espera:
                                                                <br><br>
                                                                Te invitamos a explorar nuestra web, aprovechar promociones exclusivas y sumergirte en el confort, el servicio personalizado y el entorno incomparable que hacen de Hotel Costa Colonia el lugar ideal para tu descanso y bienestar.
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td align='center' style='padding: 40px 0 30px 0;'>
                                                                <table border='0' cellpadding='0' cellspacing='0'>
                                                                    <tr>
                                                                        <td align='center' bgcolor='#3b7a57' style='border-radius: 25px;'>
                                                                            <a href='https://hotelcostacolonia.com' target='_blank' style='font-size: 16px; font-family: Arial, sans-serif; color: #ffffff; text-align: center; text-decoration: none; padding: 12px 25px; border: 1px solid #3b7a57; display: inline-block; border-radius: 25px; font-weight: bold;'>
                                                                                Ir al sitio Web
                                                                            </a>
                                                                        </td>
                                                                    </tr>
                                                                </table>
                                                            </td>
                                                        </tr>
                                                    </table>
                                                </td>
                                            </tr>
                                            
                                            <tr>
                                                <td bgcolor='#f9f9f9' style='padding: 20px 30px 20px 30px;'>
                                                    <table border='0' cellpadding='0' cellspacing='0' width='100%'>
                                                        <tr>
                                                            <td align='center' style='color: #888888; font-family: Arial, sans-serif; font-size: 12px; line-height: 18px;'>
                                                                <p style='margin: 0;'>
                                                                    © Hotel Costa Colonia, Uruguay.<br>
                                                                    Este mensaje fue enviado automáticamente, por favor no respondas a esta dirección de correo.
                                                                </p>
                                                            </td>
                                                        </tr>
                                                    </table>
                                                </td>
                                            </tr>

                                        </table>
                                    </td>
                                </tr>
                            </table>
                        </body>
                        </html>
                    ";

                    $mail->send();
                } catch (Exception $e) {
                    error_log("Error al enviar correo de registro: {$mail->ErrorInfo}");
                }
            }

            echo json_encode([
                "status" => true,
                "rol" => "usuario",
                "data" => [
                    "id_usuario" => $nuevoId,
                    "nombre" => $nombre,
                    "apellido" => $apellido,
                    "email" => $email,
                    "celular" => $celular
                ]
            ]);
        } else {
            $detalle = is_array($res) ? json_encode($res) : '';
            echo json_encode([
                "status" => false,
                "message" => "Error al agregar el usuario.",
                "debug" => $detalle
            ]);
        }
    } catch (Throwable $t) {
        echo json_encode([
            "status" => false,
            "message" => "Error interno: " . $t->getMessage()
        ]);
    }
}

function loginUsuario($email, $password) {
    global $usuarioModel;
    $resultado = $usuarioModel->login($email, $password);

    if ($resultado) {
        if (class_exists('PHPMailer\PHPMailer\PHPMailer')) {
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
                $mail->Subject = 'Inicio de Sesion Exitoso en Hotel Costa Colonia';

                
                $mail->Body = "
                    <!DOCTYPE html>
                    <html lang='es'>
                    <head>
                        <meta charset='UTF-8'>
                        <meta name='viewport' content='width=device-width, initial-scale=1.0'>
                        <title>Inicio de Sesión Exitoso en Hotel Costa Colonia</title>
                    </head>
                    <body style='margin: 0; padding: 0; background-color: #f0f4f0;'>
                        <table border='0' cellpadding='0' cellspacing='0' width='100%'>
                            <tr>
                                <td style='padding: 20px 0 30px 0;'>
                                    <table align='center' border='0' cellpadding='0' cellspacing='0' width='600' style='border-collapse: collapse; border: 1px solid #e0eee0; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1); background-color: #ffffff;'>
                                        
                                        <tr>
                                            <td align='center' bgcolor='#2f5d50' style='padding: 30px 0 30px 0; color: #ffffff; font-size: 28px; font-weight: bold; font-family: Arial, sans-serif;'>
                                                 Hotel Costa Colonia
                                            </td>
                                        </tr>
                                        
                                        <tr>
                                            <td bgcolor='#ffffff' style='padding: 40px 30px 40px 30px;'>
                                                <table border='0' cellpadding='0' cellspacing='0' width='100%'>
                                                    <tr>
                                                        <td style='color: #3b7a57; font-family: Arial, sans-serif; font-size: 24px;'>
                                                            <b>¡Hola de nuevo!</b> 
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td style='padding: 20px 0 30px 0; color: #333333; font-family: Arial, sans-serif; font-size: 16px; line-height: 22px;'>
                                                            Nos alegra verte regresar a Hotel Costa Colonia. 
                                                            <br>
                                                            Tu inicio de sesión fue exitoso. Puedes seguir disfrutando de la calidez, el confort y de las experiencias únicas frente al río.
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td style='color: #555555; font-family: Arial, sans-serif; font-size: 16px; line-height: 22px;'>
                                                            Viví lo mejor con nosotros 🌿
                                                            <br><br>
                                                            Tu próxima escapada comienza aquí. Te invitamos a aprovechar promociones exclusivas, beneficios especiales y el servicio personalizado que nos distingue.
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td align='center' style='padding: 40px 0 30px 0;'>
                                                            <table border='0' cellpadding='0' cellspacing='0'>
                                                                <tr>
                                                                    <td align='center' bgcolor='#3b7a57' style='border-radius: 25px;'>
                                                                        <a href='https://hotelcostacolonia.com' target='_blank' style='font-size: 16px; font-family: Arial, sans-serif; color: #ffffff; text-align: center; text-decoration: none; padding: 12px 25px; border: 1px solid #3b7a57; display: inline-block; border-radius: 25px; font-weight: bold;'>
                                                                            Volver al sitio
                                                                        </a>
                                                                    </td>
                                                                </tr>
                                                            </table>
                                                        </td>
                                                    </tr>
                                                </table>
                                            </td>
                                        </tr>
                                        
                                        <tr>
                                            <td bgcolor='#f9f9f9' style='padding: 20px 30px 20px 30px;'>
                                                <table border='0' cellpadding='0' cellspacing='0' width='100%'>
                                                    <tr>
                                                        <td align='center' style='color: #888888; font-family: Arial, sans-serif; font-size: 12px; line-height: 18px;'>
                                                            <p style='margin: 0;'>
                                                                © Hotel Costa Colonia, Uruguay.<br>
                                                                Este mensaje fue enviado automáticamente, por favor no respondas a esta dirección de correo.
                                                            </p>
                                                        </td>
                                                    </tr>
                                                </table>
                                            </td>
                                        </tr>

                                    </table>
                                </td>
                            </tr>
                        </table>
                    </body>
                    </html>
                ";

                $mail->send();
            } catch (Exception $e) {
                error_log("Error al enviar correo de inicio de sesión: {$mail->ErrorInfo}");
            }
        }

        echo json_encode([
            "status" => true,
            "rol" => "usuario",
            "data" => $resultado
        ]);
    } else {
        echo json_encode([
            "status" => false,
            "message" => "Credenciales incorrectas"
        ]);
    }
}


?>