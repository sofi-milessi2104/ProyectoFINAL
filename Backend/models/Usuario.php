<?php
require "../config/database.php";

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require __DIR__ . "/../../vendor/autoload.php"; 

class Usuario {
    private $pdo;

    public function __construct($pdo) {
        $this->pdo = $pdo;
    }

    
    public function obtenerUsuario() {
        $stmt = $this->pdo->prepare("SELECT * FROM usuario");
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    
    public function loginAdd($nombre, $apellido, $email, $celular, $password) {
        $hash = password_hash($password, PASSWORD_DEFAULT);
        $token = bin2hex(random_bytes(16));
        $expiry = date("Y-m-d H:i:s", strtotime("+1 day"));

        $stmt = $this->pdo->prepare("
            INSERT INTO usuario 
            (nombre, apellido, email, celular, password, verification_token, token_expiry, is_verified) 
            VALUES (:nombre, :apellido, :email, :celular, :password, :token, :expiry, 0)
        ");

        $ok = $stmt->execute([
            "nombre" => $nombre,
            "apellido" => $apellido,
            "email" => $email,
            "celular" => $celular,
            "password" => $hash,
            "token" => $token,
            "expiry" => $expiry
        ]);

        if ($ok) {
            
            $this->enviarCorreoAgradecimiento($email, $nombre);
            return true;
        } else {
            return false;
        }
    }

    
    public function eliminar($id) {
        $stmt = $this->pdo->prepare("DELETE FROM usuario WHERE id_usuario = :id");
        return $stmt->execute(["id" => $id]);
    }

    
    public function login($email, $password) {
        $stmt = $this->pdo->prepare("SELECT * FROM usuario WHERE email = :email");
        $stmt->execute(["email" => $email]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($user && password_verify($password, $user['password'])) {
            return $user;
        } else {
            return false;
        }
    }

    
    private function enviarCorreoAgradecimiento($email, $nombre) {
        $mail = new PHPMailer(true);

        try {
            
            $mail->isSMTP();
            $mail->Host       = 'smtp.gmail.com';
            $mail->SMTPAuth   = true;
            $mail->Username   = 'Sofia.milessi2008@gmail.com';
            $mail->Password   = 'sshyxbeijzqnmzjl';       
            $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
            $mail->Port       = 587;

           
            $mail->setFrom('Sofia.milessi2008@gmail.com', 'Mi App Web');
            $mail->addAddress($email, $nombre); 

           
            $mail->isHTML(true);
            $mail->Subject = "¡Gracias por registrarte, $nombre!";
            $mail->Body    = "
                <div style='font-family: Arial, sans-serif; padding: 15px; background-color: #f4f8f4; border-radius: 10px;'>
                    <h2 style='color: #3b7a57;'>🌿 ¡Hola $nombre!</h2>
                    <p>Gracias por registrarte en nuestra aplicación.</p>
                    <p>Estamos felices de tenerte con nosotros 💚</p>
                    <p style='font-size: 12px; color: #888;'>Este mensaje fue enviado automáticamente, por favor no respondas.</p>
                </div>
            ";

            $mail->send();
        } catch (Exception $e) {
            error_log(" Error al enviar correo a $email: {$mail->ErrorInfo}");
        }
    }
}
?>
