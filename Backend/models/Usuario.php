<?php
require "../config/database.php";

class Usuario {
    private $pdo;

    public function __construct($pdo) {
        $this->pdo = $pdo;
    }

    public function obtenerTodos() {
        $stmt = $this->pdo->prepare("SELECT * FROM usuarios");
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
}
?>