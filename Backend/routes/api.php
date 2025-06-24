<?php
require "../controllers/admin.php";
require "../controllers/habitacion.php";
require "../controllers/promocion.php";
require "../controllers/reserva.php";
require "../controllers/servicio.php";
require "../controllers/usuario.php";

$requestMethod = $_SERVER['REQUEST_METHOD'];

if ($requestMethod == "GET") {
    $solicitud = $_GET["url"];
    if ($solicitud == "admin") {
        $accion=$_GET["accion"];
    obtenerAdmin();
} else if ($solicitud == "habitacion") {
    $accion=$_GET["accion"];
    obtenerHabitacion();
} else if ($solicitud == "promocion") {
    $accion=$_GET["accion"];
    obtenerPromocion();
} else if ($solicitud == "reserva") {
    $accion=$_GET["accion"];
    obtenerReserva();
} else if ($solicitud == "servicio") {
    $accion=$_GET["accion"];
    obtenerServicio();
} else if ($solicitud == "usuario") {
    $accion=$_GET["accion"];
    obtenerUsuario();
}else {
    echo json_encode(["error" => "Ruta no encontrada"]);    
}
}


?>