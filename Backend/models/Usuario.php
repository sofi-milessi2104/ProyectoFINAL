<?php
require "../config/database.php";

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
        $stmt = $this->pdo->prepare("INSERT INTO usuario (nombre, apellido, email, celular, password) VALUES (:nombre, :apellido, :email, :celular, :password)");
        return $stmt->execute(["nombre" => $nombre, "apellido" => $apellido, "email" => $email, "celular" => $celular, "password" => $hash]);
    }

    public function eliminar($id) {
        $stmt = $this->pdo->prepare("DELETE FROM usuario WHERE id_usuario = :id");
        return $stmt->execute(["id" => $id]);
    }

        public function login($email, $password) {
        $stmt = $this->pdo->prepare("SELECT * FROM usuario WHERE email = :email");
        $stmt->execute(["email" => $email]);
        $usuario = $stmt->fetch(PDO::FETCH_ASSOC);
        if ($usuario && password_verify($password, $usuario['password'])) {
            return $usuario;
        }
        return false;
    }

}
?>