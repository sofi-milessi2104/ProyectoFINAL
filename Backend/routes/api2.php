<?php
require "../controllers/reserva.php";
require "../routes/log.php";

$requestMethod = $_SERVER['REQUEST_METHOD'];

if ($requestMethod == "GET") {
    $solicitud = $_GET["url"];
if ($solicitud == "reserva") {
    obtenerReserva();
}else {
    echo json_encode(["error" => "Ruta no encontrada"]);    
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
        echo "Datos recibidos: Nombre: $nombre, Apellido: $apellido, Email: $email, Adultos: $adultos, Niños: $niños, Fecha Inicio: $fecha_inicio, Fecha Fin: $fecha_fin, Tipo de Habitación: $tipo_hab, Tipo de Servicio: $tipo_servicio, Promoción: $promoción, Huesped: $huesped, Tarjeta: $tarjeta";
        agregarReserva($nombre, $apellido, $email, $adultos, $niños, $fecha_inicio, $fecha_fin, $tipo_hab, $tipo_servicio, $promoción, $huesped, $tarjeta);
        global $reservaModel;
    }else{
        echo json_encode(["error" => "Ruta no encontrada"]);
    }}
?>