<?php
require "../config/database.php";

class Servicio {
    private $pdo;

    public function __construct($pdo) {
        $this->pdo = $pdo;
    }

    public function obtenerTodos() {
        $stmt = $this->pdo->prepare("SELECT * FROM servicios");
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function agregar($tipo_servicio, $precio, $descripcion_servicio) {
        $stmt = $this->pdo->prepare("INSERT INTO servicios (tipo_servicio, precio, descripcion_servicio) VALUES (:tipo_servicio, :precio, :descripcion_servicio)");
        return $stmt->execute(["tipo_servicio" => $tipo_servicio, "precio" => $precio, "descripcion_servicio" => $descripcion_servicio]);
    }

    public function eliminar($id) {
        $stmt = $this->pdo->prepare("DELETE FROM servicios WHERE id_servicio = :id");
        return $stmt->execute(["id" => $id]);
    }
}
?>