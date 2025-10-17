<?php
header('Content-Type: application/json');

require "../controllers/administrador.php";
require "../controllers/habitacion.php";
require "../controllers/promocion.php";
require "../controllers/reserva.php";
require "../controllers/servicio.php";
require "../controllers/usuario.php";
require "../routes/log.php";

$requestMethod = $_SERVER['REQUEST_METHOD'];

if ($requestMethod == "GET") {
    $solicitud = $_GET["url"];
    if ($solicitud == "administrador") {
        obtenerAdministrador();
        exit;
    } else if ($solicitud == "habitacion") { 
        obtenerHabitacion();
        exit;
    } else if ($solicitud == "promocion") {
        obtenerPromocion();
        exit;
    } else if ($solicitud == "reserva") {
        obtenerReserva();
        exit;
    } else if ($solicitud == "servicio") {
        obtenerServicio();
        exit;
    } else if ($solicitud == "usuario") {
        obtenerUsuario();
        exit;
    } else {
        http_response_code(404); 
        echo json_encode(["error" => "Ruta no encontrada"]); 
        exit;   
    }
}

else if ($requestMethod == "POST") {
    $solicitud = $_GET["url"] ?? null;

    if ($solicitud == "login") {
        $email = $_POST["email"];
        $password = $_POST["password"];
        loginAdministrador($email, $password);
        exit;
    } elseif ($solicitud == "loginUsr") {
        $email = $_POST["email"];
        $password = $_POST["password"];
        loginUsuario($email, $password);
        exit;
    } elseif ($solicitud == "loginAddUsr") {
        $nombre = $_POST["nombre"];
        $apellido = $_POST["apellido"];
        $email = $_POST["email"];
        $celular = $_POST["celular"];
        $password = $_POST["password"];
        loginAddUser($nombre, $apellido, $email, $celular, $password);
        exit;
    } elseif ($solicitud == "habitacion") {
        $tipo_hab = $_POST["tipo_hab"];
        $descripcion_hab = $_POST["descripcion_hab"];
        $cantidad = $_POST["cantidad"];
        $imagen = $_POST["imagen"];
        $precio = $_POST["precio"];
        
        agregarHabitacion($tipo_hab,$descripcion_hab,$cantidad);
        global $habitacionModel;
        exit;
    } elseif ($solicitud == "promocion") {
        $tipo_promo = $_POST["tipo_promo"];
        $descripcion_promo = $_POST["descripcion_promo"];
        $precio = $_POST["precio"];
        
        agregarPromocion($tipo_promo, $descripcion_promo, $precio);
        global $promocionModel;
        exit;
    } 
    
    // =======================================================================
    // ARREGLO PARA LA RUTA 'reserva': CAPTURA y ENVÍA JSON
    // =======================================================================
    elseif ($solicitud == "reserva") {
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
        $nombre_tarjeta = $_POST["nombre_tarjeta"];
        $vencimiento = $_POST["vencimiento"];
        $cvc = $_POST["cvc"];
        
        // **IMPORTANTE:** El modelo necesita 'id_cliente' y 'total'. 
        // Asume que estos campos vienen en el POST o son calculados en el controlador.
        $id_usuario = $_POST["id_usuario"] ?? null; 
        $total_reserva = $_POST["total_reserva"] ?? 0.00;

        // Llama al controlador y captura el resultado (array).
        $resultado = agregarReserva(
            $nombre, $apellido, $email, $adultos, $niños, $fecha_inicio, $fecha_fin, 
            $tipo_hab, $tipo_servicio, $promoción, $huesped, $tarjeta, $nombre_tarjeta, 
            $vencimiento, $cvc, $id_usuario, $total_reserva
        );
        
        // **Codifica el array de resultado como JSON y lo imprime.**
        echo json_encode($resultado); 
        exit; // Detiene la ejecución *después* de enviar el JSON
    } 
    // =======================================================================
    
    elseif ($solicitud == "servicio") {
        $tipo_servicio = $_POST["tipo_servicio"];
        $descripcion_servicio = $_POST["descripcion_servicio"];
        $imagen = $_POST["imagen"];
       
        agregarServicio($tipo_servicio, $descripcion_servicio, $imagen);
        global $servicioModel;
        exit;
    } elseif ($solicitud == "usuario") {
        $nombre = $_POST["nombre"];
        $apellido = $_POST["apellido"];
        $email = $_POST["email"];
        $celular = $_POST["celular"];
      
        agregarUsuario($nombre, $apellido, $email, $celular);
        global $usuarioModel;
        exit;
    } else {
        http_response_code(404); 
        echo json_encode(["error" => "Ruta no encontrada"]);
        exit;
    }
}
?>