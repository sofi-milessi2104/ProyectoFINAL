<?php
require "../config/database.php";

class Reserva {
    private $pdo;

    public function __construct($pdo) {
        $this->pdo = $pdo;
    }

    public function obtenerTodos() {
        $stmt = $this->pdo->prepare("SELECT * FROM reservas");
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function agregar($nombre, $apellido, $email, $adultos, $niños, $fecha_inicio, $fecha_fin, $tipo_hab, $tipo_servicio, $promoción, $huesped, $tarjeta) {
        $stmt = $this->pdo->prepare("INSERT INTO reservas (nombre, apellido, email, adultos, niños, fecha_inicio, fecha_fin, tipo_hab, tipo_servicio, promoción, huesped, tarjeta) VALUES (:nombre, :apellido, :email, :adultos, :niños, :fecha_inicio, :fecha_fin, :tipo_hab, :tipo_servicio, :promoción, :huesped, :tarjeta)");
        return $stmt->execute(["nombre" => $nombre, "apellido" => $apellido, "email" => $email, "adultos" => $adultos, "niños" => $niños, "fecha_inicio" => $fecha_inicio, "fecha_fin" => $fecha_fin, "tipo_hab" => $tipo_hab, "tipo_servicio" => $tipo_servicio, "promoción" => $promoción, "huesped" => $huesped, "tarjeta" => $tarjeta]);
    }

    public function eliminar($id) {
        $stmt = $this->pdo->prepare("DELETE FROM reservas WHERE id_reserva = :id");
        return $stmt->execute(["id" => $id]);
    }
}
?>