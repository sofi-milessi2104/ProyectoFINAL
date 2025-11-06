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
            "token" => $token,       // <-- Nuevo
            "expiry" => $expiry      // <-- Nuevo
        ]);
    }
    
    // NUEVO MÉTODO: Buscar y verificar el token
    public function verificarToken($token) {
        // 1. Buscar usuario, verificar que el token sea correcto y que NO haya expirado
        $stmt = $this->pdo->prepare("
            SELECT id_usuario FROM usuario 
            WHERE verification_token = :token 
            AND is_verified = 0 
            AND token_expiry > NOW()
        ");
        $stmt->execute(["token" => $token]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$user) {
            return false; // Token inválido o expirado
        }
        
        // 2. Si es válido, actualizar is_verified y limpiar token
        $updateStmt = $this->pdo->prepare("
            UPDATE usuario 
            SET is_verified = 1, verification_token = NULL, token_expiry = NULL 
            WHERE id_usuario = :id
        ");
        
        // Retornamos true si la actualización fue exitosa
        return $updateStmt->execute(["id" => $user['id_usuario']]);
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

           
            $mail->setFrom('Sofia.milessi2008@gmail.com', 'Hotel Costa Colonia');
            $mail->addAddress($email, $nombre); 

           
            $mail->isHTML(true);
            $mail->Subject = "Gracias por registrarte, $nombre!";
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
                                <h2 style='color: #3b7a57;'>¡Bienvenido/a, $nombre!</h2>
                                <p style='font-size: 16px; line-height: 1.6;'>
                                    Nos complace darte la bienvenida a <strong>Hotel Costa Colonia</strong>.  
                                    Gracias por registrarte en nuestra plataforma. A partir de ahora, podrás acceder a nuestras reservas, promociones exclusivas y todas las comodidades que ofrecemos.
                                </p>

                                <p style='font-size: 16px; line-height: 1.6;'>
                                    Esperamos que disfrutes de una experiencia inolvidable con nosotros 🌿
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
                                    Visitar sitio web
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
            error_log(" Error al enviar correo a $email: {$mail->ErrorInfo}");
        }
    }
}
?>
