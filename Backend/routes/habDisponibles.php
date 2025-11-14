<?php
// Configuración general
header('Content-Type: application/json');
require_once '../config/Database.php';

// Modelo
class HabDisponible {
    private $conn;

    public function __construct($db) {
        $this->conn = $db;
    }

    public function obtenerDisponibles($fechaInicio, $fechaFin) {
        try {
            $sql = "SELECT * FROM habitaciones h 
                    WHERE h.id_hab NOT IN (
                        SELECT r.id_habitacion FROM reservas r 
                        WHERE NOT (r.fecha_fin < :fechaInicio OR r.fecha_inicio > :fechaFin)
                    )";
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

// Controlador + API
$input = json_decode(file_get_contents('php://input'), true);

if (!isset($input['fecha_inicio']) || !isset($input['fecha_fin'])) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => 'Parámetros requeridos: fecha_inicio y fecha_fin'
    ]);
    exit;
}

$fechaInicio = $input['fecha_inicio'];
$fechaFin = $input['fecha_fin'];

$database = new Database();
$db = $database->getConnection();

$habitacion = new HabDisponible($db);
$resultado = $habitacion->obtenerDisponibles($fechaInicio, $fechaFin);

echo json_encode($resultado);