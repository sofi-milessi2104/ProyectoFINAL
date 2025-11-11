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
    public function obtenerDisponibles($fecha_inicio, $fecha_fin, $adultos = null, $ninos = null) {
        $sql = "
            SELECT h.*
            FROM {$this->table_habitaciones} h
            WHERE h.id_hab NOT IN (
                SELECT DISTINCT r.id_habitacion
                FROM {$this->table_reservas} r
                WHERE r.estado = 'confirmada'
                AND (r.fecha_inicio < :fecha_fin AND r.fecha_fin > :fecha_inicio)
            )
            ORDER BY h.precio ASC
        ";

        $stmt = $this->conn->prepare($sql);
        $stmt->bindParam(':fecha_inicio', $fecha_inicio);
        $stmt->bindParam(':fecha_fin', $fecha_fin);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
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