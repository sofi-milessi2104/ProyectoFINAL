<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require __DIR__ . '/vendor/autoload.php';

$mail = new PHPMailer(true);

try {
    // Configuración del servidor
    $mail->isSMTP();
    $mail->Host       = 'smtp.gmail.com';
    $mail->SMTPAuth   = true;

    // 👉 CAMBIÁ ESTAS DOS COSAS:
    $mail->Username   = 'sofia.milessi2008@gmail.com'; // tu Gmail
    $mail->Password   = 'CONTRASEÑA_APP'; // la contraseña especial que te explico abajo 👇

    $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
    $mail->Port       = 587;

    // Destinatario
    $mail->setFrom('sofia.milessi2008@gmail.com', 'Tu Proyecto');
    $mail->addAddress('luxbur1606@gmail.com'); // puede ser el tuyo

    // Contenido del correo
    $mail->isHTML(true);
    $mail->Subject = '¡Gracias por registrarte!';
    $mail->Body    = 'Hola 🌸, gracias por registrarte en nuestra web. ¡Esperamos que disfrutes la experiencia!';

    $mail->send();
    echo '✅ Correo enviado correctamente';
} catch (Exception $e) {
    echo "❌ Error al enviar el correo: {$mail->ErrorInfo}";
}
