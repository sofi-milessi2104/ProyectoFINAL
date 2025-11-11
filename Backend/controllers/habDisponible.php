<?php
require_once '../config/Database.php';
require_once '../models/HabDisponible.php';

// Leer el cuerpo del POST como JSON
$input = json_decode(file_get_contents('php://input'), true);

// Validar que se recibieron las fechas
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

// Conectar a la base de datos
$database = new Database();
$db = $database->getConnection();

// Instanciar el modelo
$habitacion = new HabDisponible($db);

// Obtener habitaciones disponibles
$resultado = $habitacion->obtenerHabitacionesDisponibles($fechaInicio, $fechaFin);

// Devolver resultado como JSON
echo json_encode($resultado);
?>