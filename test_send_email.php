<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

require 'vendor/autoload.php';
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

$mail = new PHPMailer(true);

try {
    // Configurar SMTP
    $mail->isSMTP();
    $mail->Host       = 'smtp.gmail.com';
    $mail->SMTPAuth   = true;
    $mail->Username   = 'sofia.milessi2008@gmail.com';
    $mail->Password   = 'sshyxbeijzqnmzjl';
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
    $mail->Port       = 587;
    $mail->Timeout    = 10;

    // Debug
    $mail->do_debug = 2;  // Mostrar debug

    // Configurar el correo
    $mail->setFrom('sofia.milessi2008@gmail.com', 'Hotel Costa Colonia');
    $mail->addAddress('sofia.milessi2008@gmail.com', 'Test User');

    $mail->isHTML(true);
    $mail->Subject = 'Prueba de envío de correo';

    $mail->Body = '<h1>Hola!</h1><p>Este es un correo de prueba desde PHPMailer</p>';

    echo "Intentando enviar correo...\n\n";
    
    if ($mail->send()) {
        echo "\n\n✅ Correo enviado exitosamente!";
    } else {
        echo "\n\n❌ Error al enviar: " . $mail->ErrorInfo;
    }
    
} catch (Exception $e) {
    echo "❌ Excepción: {$mail->ErrorInfo}";
} catch (Throwable $e) {
    echo "❌ Error: " . $e->getMessage();
}
