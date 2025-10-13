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

    public function agregar($id_usuario, $adultos, $ninos, $fecha_inicio, $fecha_fin, $id_habitacion, $id_servicio, $tarjeta, $nombre_tarjeta = null, $vencimiento = null, $cvc = null) {
        try {
            $id_servicio_str = is_array($id_servicio) ? implode(',', $id_servicio) : $id_servicio;

            $stmt = $this->pdo->prepare("
                INSERT INTO reserva 
                (id_usuario, adultos, niños, fecha_inicio, fecha_fin, id_habitacion, id_servicio, tarjeta, nombre_tarjeta, vencimiento, cvc) 
                VALUES (:id_usuario, :adultos, :ninos, :fecha_inicio, :fecha_fin, :id_habitacion, :id_servicio, :tarjeta, :nombre_tarjeta, :vencimiento, :cvc)
            ");
            $result = $stmt->execute([
                "id_usuario" => $id_usuario,
                "adultos" => $adultos,
                "ninos" => $ninos,
                "fecha_inicio" => $fecha_inicio,
                "fecha_fin" => $fecha_fin,
                "id_habitacion" => $id_habitacion,
                "id_servicio" => $id_servicio_str,
                "tarjeta" => $tarjeta,
                "nombre_tarjeta" => $nombre_tarjeta,
                "vencimiento" => $vencimiento,
                "cvc" => $cvc
            ]);
            
            if ($result) {
                error_log("Reserva agregada exitosamente con ID: " . $this->pdo->lastInsertId());
            }
            return $result;
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