<?php
// Configuración general
header('Content-Type: application/json');
require_once '../config/database.php';

// Leer input JSON
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

try {
    // Buscar tipos de habitación disponibles y contar cuántas hay disponibles
    $sql = "SELECT 
                h.tipo_hab,
                h.descripcion_hab,
                h.imagen,
                h.precio,
                MIN(h.id_hab) as id_hab,
                COUNT(DISTINCT h.id_hab) as disponible
            FROM habitacion h
            WHERE h.id_hab NOT IN (
                SELECT r.id_habitacion 
                FROM reserva r 
                WHERE r.id_habitacion IS NOT NULL
                AND NOT (r.fecha_fin <= :fechaInicio OR r.fecha_inicio >= :fechaFin)
            )
            GROUP BY h.tipo_hab, h.descripcion_hab, h.imagen, h.precio
            ORDER BY CAST(REPLACE(h.precio, '.', '') AS UNSIGNED) ASC";
    
    $stmt = $pdo->prepare($sql);
    $stmt->bindParam(':fechaInicio', $fechaInicio);
    $stmt->bindParam(':fechaFin', $fechaFin);
    $stmt->execute();
    $habitaciones = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Formatear precios (están como string con puntos: "3.438" -> 3438)
    foreach ($habitaciones as &$hab) {
        $hab['precio'] = str_replace('.', '', $hab['precio']);
        $hab['disponible'] = (int)$hab['disponible'];
    }
    
    echo json_encode([
        'success' => true,
        'habitaciones' => $habitaciones,
        'mensaje' => count($habitaciones) . ' tipo(s) de habitación disponible(s)',
        'debug' => [
            'fecha_inicio' => $fechaInicio,
            'fecha_fin' => $fechaFin,
            'total_encontradas' => count($habitaciones)
        ]
    ]);
    
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Error al consultar disponibilidad: ' . $e->getMessage()
    ]);
}