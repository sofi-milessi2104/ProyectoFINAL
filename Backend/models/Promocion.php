<?php
require "../config/database.php";

class Promocion {
    private $pdo;

    public function __construct($pdo) {
        $this->pdo = $pdo;
    }

    public function obtenerTodos() {
        $stmt = $this->pdo->prepare("SELECT * FROM promociones");
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function agregar($tipo_promo) {
        $stmt = $this->pdo->prepare("INSERT INTO promociones (tipo_promo) VALUES (:tipo_promo)");
        return $stmt->execute(["tipo_promo" => $tipo_promo]);
    }

    public function eliminar($id) {
        $stmt = $this->pdo->prepare("DELETE FROM promociones WHERE id_promo = :id");
        return $stmt->execute(["id" => $id]);
    }
}
?>