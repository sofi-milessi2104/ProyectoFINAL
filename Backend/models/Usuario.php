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

    public function agregar($nombre, $apellido, $email, $celular) {
        $stmt = $this->pdo->prepare("INSERT INTO usuarios (nombre, apellido, email, celular) VALUES (:nombre, :apellido, :email, :celular)");
        return $stmt->execute(["nombre" => $nombre, "apellido" => $apellido, "email" => $email, "celular" => $celular]);
    }

    public function eliminar($id) {
        $stmt = $this->pdo->prepare("DELETE FROM usuarios WHERE id_usuario = :id");
        return $stmt->execute(["id" => $id]);
    }

        public function login1($email, $password) {
        $stmt = $this->pdo->prepare("SELECT * FROM usuario WHERE email = :email AND password = :password");
        $stmt->execute(["email" => $email, "password" => $password]);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

}
?>