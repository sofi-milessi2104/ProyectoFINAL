<?php
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');

// DEBUG TEMPORAL: mostrar excepciones completas
ini_set('display_errors', 1);
error_reporting(E_ALL);

require_once __DIR__ . '/../models/HabDisponible.php';
require_once __DIR__ . '/../config/database.php';

class DisponibilidadController {
    private $disponibilidad;
    private $db;

    public function __construct() {
        $this->db = new Database();
        $this->disponibilidad = new HabDisponible($this->db->connect());
    }

    public function obtenerDisponibles() {
        if (!isset($_GET['fecha_inicio']) || !isset($_GET['fecha_fin'])) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Parámetros requeridos: fecha_inicio y fecha_fin']);
            return;
        }

        $fecha_inicio = $_GET['fecha_inicio'];
        $fecha_fin    = $_GET['fecha_fin'];
        $adultos      = isset($_GET['adultos']) ? intval($_GET['adultos']) : null;

        $ninos = null;
        if (isset($_GET['ninios'])) {
            $ninos = intval($_GET['ninios']);
        } elseif (isset($_GET['ninos'])) {
            $ninos = intval($_GET['ninos']);
        } elseif (isset($_GET['niños'])) {
            $ninos = intval($_GET['niños']);
        }

        if (!$this->validarFecha($fecha_inicio) || !$this->validarFecha($fecha_fin)) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Formato de fecha inválido. Use YYYY-MM-DD']);
            return;
        }

        if (strtotime($fecha_fin) <= strtotime($fecha_inicio)) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'La fecha de salida debe ser posterior a la de entrada']);
            return;
        }

        $habitaciones = $this->disponibilidad->obtenerDisponibles($fecha_inicio, $fecha_fin, $adultos, $ninos);

        http_response_code(200);
        echo json_encode(['success' => true, 'data' => $habitaciones, 'count' => count($habitaciones)]);
    }

    public function verificarDisponibilidad() {
        if (!isset($_GET['id_habitacion']) || !isset($_GET['fecha_inicio']) || !isset($_GET['fecha_fin'])) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Parámetros requeridos: id_habitacion, fecha_inicio y fecha_fin']);
            return;
        }

        $id_habitacion = intval($_GET['id_habitacion']);
        $fecha_inicio  = $_GET['fecha_inicio'];
        $fecha_fin     = $_GET['fecha_fin'];

        if (!$this->validarFecha($fecha_inicio) || !$this->validarFecha($fecha_fin)) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Formato de fecha inválido']);
            return;
        }

        $disponible = $this->disponibilidad->verificarDisponibilidad($id_habitacion, $fecha_inicio, $fecha_fin);

        http_response_code(200);
        echo json_encode(['success' => true, 'disponible' => $disponible]);
    }

    public function obtenerTodas() {
        $habitaciones = $this->disponibilidad->obtenerTodas();
        http_response_code(200);
        echo json_encode(['success' => true, 'data' => $habitaciones, 'count' => count($habitaciones)]);
    }

    public function obtenerPorId() {
        if (!isset($_GET['id'])) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Parámetro requerido: id']);
            return;
        }

        $id_habitacion = intval($_GET['id']);
        $habitacion = $this->disponibilidad->obtenerPorId($id_habitacion);

        if (!$habitacion) {
            http_response_code(404);
            echo json_encode(['success' => false, 'message' => 'Habitación no encontrada']);
            return;
        }

        http_response_code(200);
        echo json_encode(['success' => true, 'data' => $habitacion]);
    }

    private function validarFecha($fecha) {
        $d = DateTime::createFromFormat('Y-m-d', $fecha);
        return $d && $d->format('Y-m-d') === $fecha;
    }
}

try {
    $controller = new DisponibilidadController();
    $action = isset($_GET['action']) ? $_GET['action'] : 'obtenerDisponibles';

    if (method_exists($controller, $action)) {
        $controller->$action();
    } else {
        http_response_code(404);
        echo json_encode(['success' => false, 'message' => 'Acción no encontrada: ' . $action]);
    }
} catch (Throwable $e) {
    // DEBUG: mostrar excepción completa (quitar en producción)
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Error: ' . $e->getMessage(),
        'file' => $e->getFile(),
        'line' => $e->getLine()
    ]);
}


?>