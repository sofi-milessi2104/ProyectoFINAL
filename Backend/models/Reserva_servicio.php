<?php
class Reserva_servicio {
    private $pdo;

    public function __construct($pdo) {
        $this->pdo = $pdo;
    }

    // Obtener todos los servicios asociados a una reserva
    public function obtenerServiciosPorReserva($id_reserva) {
        $stmt = $this->pdo->prepare("
            SELECT s.id_servicio, s.tipo_servicio, s.precio_servicio
            FROM reserva_servicio rs
            JOIN servicio s ON rs.id_servicio = s.id_servicio
            WHERE rs.id_reserva = ?
        ");
        $stmt->execute([$id_reserva]);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    // Eliminar todos los servicios de una reserva (si se modifica)
    public function eliminarServiciosPorReserva($id_reserva) {
        $stmt = $this->pdo->prepare("DELETE FROM reserva_servicio WHERE id_reserva = ?");
        return $stmt->execute([$id_reserva]);
    }
}
