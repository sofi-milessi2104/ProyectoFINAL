<?php
<?php
require "../models/Reserva.php";

$reservaModel = new Reserva($pdo);

<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    if ($input && isset($input['action']) && $input['action'] === 'agregarReserva') {
        agregarReserva(
            $input['id_usuario'] ?? null,
            $input['adultos'] ?? '1',
            $input['niños'] ?? '1',
            $input['fecha_inicio'] ?? '',
            $input['fecha_fin'] ?? '',
            $input['id_habitacion'] ?? null,
            $input['id_servicio'] ?? null,
            $input['tarjeta'] ?? ''
        );
        exit;
    }
}

function obtenerReserva() {
    global $reservaModel;
    echo json_encode($reservaModel->obtenerReserva());
}

function agregarReserva($id_usuario, $adultos, $niños, $fecha_inicio, $fecha_fin, $id_habitacion, $id_servicio, $tarjeta) {
    global $reservaModel;
    if ($reservaModel->agregar($id_usuario, $adultos, $niños, $fecha_inicio, $fecha_fin, $id_habitacion, $id_servicio, $tarjeta)) {
        echo json_encode(["message" => "Reserva agregada correctamente."]);
    } else {
        echo json_encode(["message" => "Error al agregar la reserva."]);
    }
}

function eliminarReserva($id) {
    global $reservaModel;
    if ($reservaModel->eliminar($id)) {
        echo json_encode(["message" => "Reserva eliminada correctamente."]);
    } else {
        echo json_encode(["message" => "Error al eliminar la reserva."]);
    }
}
?>