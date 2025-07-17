<?php
require "../config/database.php";

class Administrador {
    private $pdo;

    public function __construct($pdo) {
        $this->pdo = $pdo;
    }

    public function obtenerAdministrador() {
        $stmt = $this->pdo->prepare("SELECT * FROM administrador");
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function agregar($ci, $nombre_completo, $email, $area) {
        $stmt = $this->pdo->prepare("INSERT INTO administrador (ci, nombre_completo, email, area) VALUES (:ci, :nombre_completo, :email, :area)");
        return $stmt->execute(["ci" => $ci, "nombre_completo" => $nombre_completo, "email" => $email, "area" => $area]);
    }

    public function eliminar($id) {
        $stmt = $this->pdo->prepare("DELETE FROM administrador WHERE ci = :id");
        return $stmt->execute(["id" => $id]);
    }

}
?>