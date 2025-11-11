<?php
// api.php
// Este archivo actúa como enrutador principal y pasa el control al controlador.

// Asegúrate de que esta ruta sea correcta para tu ubicación:
require_once "../controllers/reserva.php"; 
require_once "../routes/log.php"; // Incluye el archivo de log si lo usas

header("Content-Type: application/json; charset=UTF-8");

$requestMethod = $_SERVER['REQUEST_METHOD'];

if ($requestMethod == "GET") {
    $solicitud = $_GET["url"] ?? null;
    $action = $_GET["action"] ?? null;

    if ($solicitud == "reserva") {
        // Al incluir "../controllers/reserva.php" al inicio,
        // todo su código se ejecuta. Este código ya contiene la lógica
        // para manejar las acciones 'count_today' y 'list_today' basadas en $_GET.
        
        // Si la acción es de hoy, no hacemos nada más en api.php.
        // El controlador de reserva.php (incluido al inicio) ya detectó la acción
        // y envió la respuesta JSON.
        if ($action == 'count_today' || $action == 'list_today') {
            // No se pone 'exit;' aquí. Permitimos que el flujo continúe 
            // hasta que el script de 'reserva.php' envíe la respuesta y termine la ejecución.
        } else {
            // Asumiendo que esta es una función definida en otro lugar 
            // (o dentro de reserva.php) para obtener una reserva específica
            obtenerReserva(); 
            exit;
        }

    } 
    
    // Si la solicitud no es "reserva", el flujo continúa.

}

// La lógica POST se mantiene igual, ya que no parecía tener problemas:
elseif ($requestMethod == "POST") {
    $solicitud = $_GET["url"] ?? null;

    if ($solicitud == "reserva") {
        // Nota: Si el controlador 'reserva.php' ya está incluido y maneja el POST, 
        // podrías simplificar este bloque, pero se mantiene la estructura original:
        
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
    // Esto se ejecuta si el método no es GET ni POST (ej: PUT, DELETE)
    echo json_encode(["error" => "Método de solicitud no soportado"]);
}
?>