<?php
require "../config/database.php";

class Habitacion {
    private $pdo;

    public function __construct($pdo) {
        $this->pdo = $pdo;
    }

    public function obtenerHabitacion() {
        $stmt = $this->pdo->prepare("SELECT * FROM habitacion");
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function agregar($tipo_hab,$descripcion_hab,$cantidad) {
        $stmt = $this->pdo->prepare("INSERT INTO habitaciones (tipo_hab, descripcion_hab, cantidad) VALUES (:tipo_hab, :descripcion_hab, :cantidad)");
        return $stmt->execute(["tipo_hab" => $tipo_hab, "descripcion_hab" => $descripcion_hab, "cantidad" => $cantidad]);
    }

    public function eliminar($id) {
        $stmt = $this->pdo->prepare("DELETE FROM habitaciones WHERE id_hab = :id");
        return $stmt->execute(["id" => $id]);
    }
}
?>