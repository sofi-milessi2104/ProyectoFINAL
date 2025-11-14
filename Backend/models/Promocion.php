<?php
class Promocion {
    private $pdo;

    public function __construct($pdo) {
        $this->pdo = $pdo;
    }

    public function obtenerPromocion() {
        $stmt = $this->pdo->prepare("SELECT * FROM promocion");
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function agregar($tipo_promo, $descripcion_promo, $img_promo, $precio_promo) {
        $stmt = $this->pdo->prepare("INSERT INTO promocion (tipo_promo, descripcion_promo, img_promo, precio_promo) VALUES (:tipo_promo, :descripcion_promo, :img_promo, :precio_promo)");
        return $stmt->execute(["tipo_promo" => $tipo_promo, "descripcion_promo" => $descripcion_promo, "img_promo" => $img_promo, "precio_promo" => $precio_promo]);
    }

    public function eliminar($id) {
        $stmt = $this->pdo->prepare("DELETE FROM promocion WHERE id_promo = :id");
        return $stmt->execute(["id" => $id]);
    }

    public function editar($id, $tipo_promo, $descripcion_promo, $img_promo, $precio_promo) {
        $stmt = $this->pdo->prepare("UPDATE promocion SET tipo_promo = :tipo_promo, descripcion_promo = :descripcion_promo, img_promo = :img_promo, precio_promo = :precio_promo WHERE id_promo = :id");
        return $stmt->execute([
            "id" => $id,
            "tipo_promo" => $tipo_promo,
            "descripcion_promo" => $descripcion_promo,
            "img_promo" => $img_promo,
            "precio_promo" => $precio_promo
        ]);
    }

    public function obtenerPorId($id) {
        $stmt = $this->pdo->prepare("SELECT * FROM promocion WHERE id_promo = :id");
        $stmt->execute(["id" => $id]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }
}
?>