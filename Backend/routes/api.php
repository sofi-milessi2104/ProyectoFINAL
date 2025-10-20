<?php
require "../controllers/administrador.php";
require "../controllers/habitacion.php";
require "../controllers/promocion.php";
require "../controllers/servicio.php";
require "../controllers/usuario.php";
require "../routes/log.php";

$requestMethod = $_SERVER['REQUEST_METHOD'];

if ($requestMethod == "GET") {
    $solicitud = $_GET["url"];
if ($solicitud == "administrador") {
    obtenerAdministrador();
} else if ($solicitud == "habitacion") {
    obtenerHabitacion();
} else if ($solicitud == "promocion") {
    obtenerPromocion();
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

    if ($solicitud == "login") {
          $email = $_POST["email"];
        $password = $_POST["password"];
        loginAdministrador($email, $password);
    } elseif ($solicitud == "loginUsr") {
          $email = $_POST["email"];
        $password = $_POST["password"];
        loginUsuario($email, $password);
    } elseif ($solicitud == "loginAddUsr") {
          $nombre = $_POST["nombre"];
        $apellido = $_POST["apellido"];
        $email = $_POST["email"];
        $celular = $_POST["celular"];
        $password = $_POST["password"];
        loginAddUser($nombre, $apellido, $email, $celular, $password);
    } elseif ($solicitud == "habitacion") {
        $tipo_hab = $_POST["tipo_hab"];
        $descripcion_hab = $_POST["descripcion_hab"];
        $cantidad = $_POST["cantidad"];
        $imagen = $_POST["imagen"];
        $precio = $_POST["precio"];
        echo "Datos recibidos: Tipo de Habitación: $tipo_hab, Descripción: $descripcion_hab, Cantidad: $cantidad, Imagen: $imagen, Precio: $precio";
        agregarHabitacion($tipo_hab,$descripcion_hab,$cantidad);
        global $habitacionModel;
    } elseif ($solicitud == "promocion") {
        $tipo_promo = $_POST["tipo_promo"];
        $descripcion_promo = $_POST["descripcion_promo"];
        $precio = $_POST["precio"];
        agregarPromocion($tipo_promo, $descripcion_promo, $precio);
        global $promocionModel;
    } elseif ($solicitud == "servicio") {
        $tipo_servicio = $_POST["tipo_servicio"];
        $descripcion_servicio = $_POST["descripcion_servicio"];
        $imagen = $_POST["imagen"];
        echo "Datos recibidos: Tipo de Servicio: $tipo_servicio, Descripción: $descripcion_servicio, Imagen: $imagen";
        agregarServicio($tipo_servicio, $descripcion_servicio, $imagen);
        global $servicioModel;
    } elseif ($solicitud == "usuario") {
        $nombre = $_POST["nombre"];
        $apellido = $_POST["apellido"];
        $email = $_POST["email"];
        $celular = $_POST["celular"];
        echo "Datos recibidos: Nombre: $nombre, Apellido: $apellido, Email: $email, Celular: $celular";
        agregarUsuario($nombre, $apellido, $email, $celular);
        global $usuarioModel;
    }else{
        echo json_encode(["error" => "Ruta no encontrada"]);
    }}


?>