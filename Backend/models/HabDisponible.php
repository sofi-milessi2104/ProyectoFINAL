<?php
class HabDisponible {
    private $conn;

    public function __construct($db) {
        $this->conn = $db;
    }

    public function obtenerDisponibles($fechaInicio, $fechaFin) {
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
}
?>