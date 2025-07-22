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

    public function agregar($tipo_hab, $descripcion_hab, $disponible, $imagen, $precio) {
        $stmt = $this->pdo->prepare("INSERT INTO habitacion (tipo_hab, descripcion_hab, disponible, imagen, precio) VALUES (:tipo_hab, :descripcion_hab, :disponible, :imagen, :precio)");
        return $stmt->execute([
            "tipo_hab" => $tipo_hab,
            "descripcion_hab" => $descripcion_hab,
            "cantidad" => $disponible,
            "imagen" => $imagen,
            "precio" => $precio
        ]);
    }

    public function eliminar($id) {
        $stmt = $this->pdo->prepare("DELETE FROM habitacion WHERE id_hab = :id");
        return $stmt->execute(["id" => $id]);
    }
}
?>