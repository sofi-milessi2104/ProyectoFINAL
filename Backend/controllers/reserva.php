<?php
require "../models/Reserva.php";

$reservaModel = new Reserva($pdo); 

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    if ($input && isset($input['action']) && $input['action'] === 'agregarReserva') {
        $id_usuario = $input['id_usuario'] ?? 1; 
        $result = $reservaModel->agregar(
            $id_usuario,
            $input['adultos'] ?? '1',
            $input['ninos'] ?? '0', 
            $input['fecha_inicio'] ?? '',
            $input['fecha_fin'] ?? '',
            $input['id_habitacion'] ?? null,
            $input['id_servicio'] ?? null, 
            $input['tarjeta'] ?? '',
            $input['nombre_tarjeta'] ?? null,
            $input['vencimiento'] ?? null,
            $input['cvc'] ?? null
        );
        
        if ($result) {
            echo json_encode(["success" => true, "message" => "Reserva agregada correctamente."]);
        } else {
            echo json_encode(["success" => false, "message" => "Error al agregar la reserva. Revisa los logs."]);
        }
        exit;
    }
} elseif ($_SERVER['REQUEST_METHOD'] === 'GET' && isset($_GET['action'])) {
    if ($_GET['action'] === 'obtener') {
        header('Content-Type: application/json');
        echo json_encode($reservaModel->obtenerReserva());
        exit;
    }
}

http_response_code(405);
echo json_encode(["error" => "Método no permitido"]);
?>