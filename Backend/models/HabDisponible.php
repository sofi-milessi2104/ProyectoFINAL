<?php
class HabDisponible {
    private $conn;
    private $table_habitaciones = 'habitaciones';
    private $table_reservas = 'reservas';

    public function __construct($db) {
        $this->conn = $db;
    }

    /**
     * Obtiene habitaciones disponibles según los parámetros de búsqueda
     */
    public function obtenerHabitacionesDisponibles($fechaInicio, $fechaFin) {
    try {
        $sql = "
            SELECT * FROM habitaciones h
            WHERE h.id_hab NOT IN (
                SELECT r.id_habitacion
                FROM reservas r
                WHERE NOT (
                    r.fecha_fin < :fechaInicio OR
                    r.fecha_inicio > :fechaFin
                )
            )
        ";

        $stmt = $this->conn->prepare($sql);
        $stmt->bindParam(':fechaInicio', $fechaInicio);
        $stmt->bindParam(':fechaFin', $fechaFin);
        $stmt->execute();

        $habitaciones = $stmt->fetchAll(PDO::FETCH_ASSOC);
        return ['success' => true, 'data' => $habitaciones];

    } catch (PDOException $e) {
        return [
            'success' => false,
            'message' => 'Error: ' . $e->getMessage(),
            'file' => __FILE__,
            'line' => __LINE__
        ];
    }
}

    /**
     * Verifica si una habitación específica está disponible en un rango de fechas
     */
    public function verificarDisponibilidad($id_habitacion, $fecha_inicio, $fecha_fin) {
        $sql = "
            SELECT COUNT(*) as cnt
            FROM {$this->table_reservas}
            WHERE id_habitacion = :id_habitacion
              AND estado = 'confirmada'
              AND (fecha_inicio < :fecha_fin AND fecha_fin > :fecha_inicio)
        ";
        $stmt = $this->conn->prepare($sql);
        $stmt->bindParam(':id_habitacion', $id_habitacion);
        $stmt->bindParam(':fecha_inicio', $fecha_inicio);
        $stmt->bindParam(':fecha_fin', $fecha_fin);
        $stmt->execute();
        $r = $stmt->fetch(PDO::FETCH_ASSOC);
        return intval($r['cnt']) === 0;
    }

    /**
     * Obtiene todas las habitaciones con sus detalles
     */
    public function obtenerTodas() {
        $stmt = $this->conn->query("SELECT * FROM {$this->table_habitaciones} ORDER BY precio ASC");
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    /**
     * Obtiene una habitación específica por ID
     */
    public function obtenerPorId($id_habitacion) {
        $stmt = $this->conn->prepare("SELECT * FROM {$this->table_habitaciones} WHERE id_hab = :id");
        $stmt->bindParam(':id', $id_habitacion);
        $stmt->execute();
        return $stmt->fetch(PDO::FETCH_ASSOC) ?: null;
    }
}
?>