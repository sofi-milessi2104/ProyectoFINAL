<?php

error_reporting(E_ALL);
ini_set('display_errors', 1);
header('Content-Type: application/json');

require "../config/database.php";

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;
use PHPMailer\PHPMailer\SMTP;

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
        // devuelve true + id insertado para poder usarlo desde el controller
        return ["ok" => true, "id" => $this->pdo->lastInsertId()];
    } else {
        // devuelve errorInfo para depuración
        $err = $stmt->errorInfo(); // [SQLSTATE, driverCode, driverMessage]
        return ["ok" => false, "error" => $err];
    }
}

    
    public function verificarToken($token) {
        $stmt = $this->pdo->prepare("
            SELECT id_usuario FROM usuario 
            WHERE verification_token = :token 
            AND is_verified = 0 
            AND token_expiry > NOW()
        ");
        $stmt->execute(["token" => $token]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$user) {
            return false;
        }
        
        $updateStmt = $this->pdo->prepare("
            UPDATE usuario 
            SET is_verified = 1, verification_token = NULL, token_expiry = NULL 
            WHERE id_usuario = :id
        ");
        
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

}
?>