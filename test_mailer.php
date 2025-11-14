<?php
require 'vendor/autoload.php';
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

$mail = new PHPMailer(true);

echo "PHPMailer cargado correctamente\n";
echo "Clase disponible: " . (class_exists('PHPMailer\PHPMailer\PHPMailer') ? 'SI' : 'NO') . "\n";
echo "SMTP disponible: " . (class_exists('PHPMailer\PHPMailer\SMTP') ? 'SI' : 'NO') . "\n";
echo "Exception disponible: " . (class_exists('PHPMailer\PHPMailer\Exception') ? 'SI' : 'NO') . "\n";

$mail->isSMTP();
$mail->Host = 'smtp.gmail.com';
$mail->Port = 587;
$mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
$mail->SMTPAuth = true;
$mail->Username = 'sofia.milessi2008@gmail.com';
$mail->Password = 'sshyxbeijzqnmzjl';

echo "Configuración completada\n";
