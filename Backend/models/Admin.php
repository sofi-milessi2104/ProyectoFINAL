<?php
require "../config/database.php";

class Admin {
    private $pdo;

    public function __construct($pdo) {
        $this->pdo = $pdo;
    }

    public function obtenerTodos() {
        $stmt = $this->pdo->prepare("SELECT * FROM administradores");
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function agregar($nombre_completo, $email, $area) {
        $stmt = $this->pdo->prepare("INSERT INTO administradores (nombre_completo, email, area) VALUES (:nombre_completo, :email, :area)");
        return $stmt->execute(["nombre_completo" => $nombre_completo, "email" => $email, "area" => $area]);
    }

    public function eliminar($id) {
        $stmt = $this->pdo->prepare("DELETE FROM administradores WHERE ci = :id");
        return $stmt->execute(["id" => $id]);
    }
}
?>