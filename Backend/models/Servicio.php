<?php
require "../config/database.php";

class Servicio {
    private $pdo;

    public function __construct($pdo) {
        $this->pdo = $pdo;
    }

    public function obtenerServicio() {
        $stmt = $this->pdo->prepare("SELECT * FROM servicio");
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function agregar($tipo_servicio, $descripcion_servicio, $imagen, $id_promo) {
        try {
            $stmt = $this->pdo->prepare("INSERT INTO servicio (tipo_servicio, descripcion_servicio, imagen, id_promo) VALUES (:tipo_servicio, :descripcion_servicio, :imagen, :id_promo)");
            $stmt->execute([
                "tipo_servicio" => $tipo_servicio,
                "descripcion_servicio" => $descripcion_servicio,
                "imagen" => $imagen,
                "id_promo" => $id_promo
            ]);
            return true;
        } catch (\PDOException $e) {
            return $e->getMessage();
        }
    }

    public function eliminar($id) {
        $stmt = $this->pdo->prepare("DELETE FROM servicio WHERE id_servicio = :id");
        return $stmt->execute(["id" => $id]);
    }

    public function editar($id, $tipo_servicio, $descripcion_servicio, $imagen) {
        $stmt = $this->pdo->prepare("UPDATE servicio SET tipo_servicio = :tipo_servicio, descripcion_servicio = :descripcion_servicio, imagen = :imagen WHERE id_servicio = :id");
        return $stmt->execute([
            "id" => $id,
            "tipo_servicio" => $tipo_servicio,
            "descripcion_servicio" => $descripcion_servicio,
            "imagen" => $imagen
        ]);
    }

    public function obtenerPorId($id) {
        $stmt = $this->pdo->prepare("SELECT * FROM servicio WHERE id_servicio = :id");
        $stmt->execute(["id" => $id]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }
}
?>