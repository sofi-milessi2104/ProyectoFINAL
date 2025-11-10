<?php
require_once "../controllers/reserva.php"; 
require_once "../controllers/ingresos.php"; // ✅ Asegurate que se llame así
require_once "../routes/log.php";

$requestMethod = $_SERVER['REQUEST_METHOD'];

if ($requestMethod == "GET") {
    $solicitud = $_GET["url"] ?? null;
    $action = $_GET["action"] ?? null;

    if ($solicitud == "reserva") {

        if ($action == 'count_today' || $action == 'list_today') {
            exit; 
        } else {
            obtenerReserva(); 
            exit;
        }

    } 
    // ✅ RUTA PARA INGRESOS
    elseif ($solicitud == "ingresos") {
        $controller = new IngresosController();

        if ($action == "mes") {
            $controller->obtenerIngresosMensuales();
        } 
        else {
            echo json_encode(["error" => "Acción de ingresos no válida"]);
        }
        exit;
    } 
    
    else {
        echo json_encode(["error" => "Ruta no encontrada para GET"]);    
    }
}

elseif ($requestMethod == "POST") {
    $solicitud = $_GET["url"] ?? null;

    if ($solicitud == "reserva") {
        $nombre = $_POST["nombre"];
        $apellido = $_POST["apellido"];
        $email = $_POST["email"];
        $adultos = $_POST["adultos"];
        $niños = $_POST["niños"];
        $fecha_inicio = $_POST["fecha_inicio"];
        $fecha_fin = $_POST["fecha_fin"];
        $tipo_hab = $_POST["tipo_hab"];
        $tipo_servicio = $_POST["tipo_servicio"];
        $promoción = $_POST["promoción"];
        $huesped = $_POST["huesped"];
        $tarjeta = $_POST["tarjeta"];
        
        agregarReserva($nombre, $apellido, $email, $adultos, $niños, $fecha_inicio, $fecha_fin, $tipo_hab, $tipo_servicio, $promoción, $huesped, $tarjeta);
        global $reservaModel;
        exit;
    } else {
        echo json_encode(["error" => "Ruta no encontrada para POST"]);
    }
} else {
    echo json_encode(["error" => "Método de solicitud no soportado"]);
}
?>
