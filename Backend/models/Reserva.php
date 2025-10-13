<?php
require "../config/database.php";

class Reserva {
    private $pdo;

    public function __construct($pdo) {
        $this->pdo = $pdo;
    }

    public function obtenerReserva() {
        $stmt = $this->pdo->prepare("SELECT * FROM reserva");
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

public function agregar($id_usuario, $adultos, $niños, $fecha_inicio, $fecha_fin, $id_habitacion, $id_servicio, $tarjeta) {
    try {
        $stmt = $this->pdo->prepare("INSERT INTO reserva (id_usuario, adultos, niños, fecha_inicio, fecha_fin, id_habitacion, id_servicio, tarjeta) VALUES (:id_usuario, :adultos, :niños, :fecha_inicio, :fecha_fin, :id_habitacion, :id_servicio, :tarjeta)");
        return $stmt->execute([
            "id_usuario" => $id_usuario,
            "adultos" => $adultos,
            "niños" => $niños,
            "fecha_inicio" => $fecha_inicio,
            "fecha_fin" => $fecha_fin,
            "id_habitacion" => $id_habitacion,
            "id_servicio" => $id_servicio,
            "tarjeta" => $tarjeta
        ]);
    } catch (PDOException $e) {
        error_log("Error al agregar reserva: " . $e->getMessage());
        return false;
    }
}

    public function eliminar($id) {
        $stmt = $this->pdo->prepare("DELETE FROM reserva WHERE id_reserva = :id");
        return $stmt->execute(["id" => $id]);
    }
}
?>