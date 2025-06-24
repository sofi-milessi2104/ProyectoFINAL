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
    obtenerAdmin();
} else if ($solicitud == "habitacion") {
    obtenerHabitacion();
} else if ($solicitud == "promocion") {
    obtenerPromocion();
} else if ($solicitud == "reserva") {
    obtenerReserva();
} else if ($solicitud == "servicio") {
    obtenerServicio();
} else if ($solicitud == "usuario") {
    obtenerUsuario();
}else {
    echo json_encode(["error" => "Ruta no encontrada"]);    
}
}

elseif ($requestMethod == "POST") {
    $solicitud = $_GET["url"] ?? null;

    if ($solicitud == "admin") {
        $nombre_completo = $_POST["nombre_completo"];
        $email = $_POST["email"];
        $area = $_POST["area"];
        echo "Dattos recibidos: Nombre Completo: $nombre_completo, Email: $email, Area: $area";
        agregarAdmin($nombre_completo, $email, $area);
        global $adminModel;
    } elseif ($solicitud == "habitacion") {
        $tipo_hab = $_POST["tipo_hab"];
        $descripcion_hab = $_POST["descripcion_hab"];
        $cantidad = $_POST["cantidad"];
        agregarHabitacion($tipo_hab,$descripcion_hab,$cantidad);
        global $habitacionModel;
    } elseif ($solicitud == "promocion") {
        $tipo_promo = $_POST["tipo_promo"];
        agregarPromocion($tipo_promo);
        global $promocionModel;
    } elseif ($solicitud == "reserva") {
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
    } elseif ($solicitud == "servicio") {
        $tipo_servicio = $_POST["tipo_servicio"];
        $precio = $_POST["precio"];
        $descripcion_servicio = $_POST["descripcion_servicio"];
        agregarServicio($tipo_servicio, $precio, $descripcion_servicio);
        global $servicioModel;
    } elseif ($solicitud == "usuario") {
        $nombre = $_POST["nombre"];
        $apellido = $_POST["apellido"];
        $email = $_POST["email"];
        $celular = $_POST["celular"];
        agregarUsuario($nombre, $apellido, $email, $celular);
        global $usuarioModel;
    } else {
        echo json_encode(["error" => "Ruta no encontrada"]);
    }
}

?>