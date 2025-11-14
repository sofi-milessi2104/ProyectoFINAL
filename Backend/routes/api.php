<?php
error_reporting(0);
ini_set('display_errors', 0);

require "../controllers/administrador.php";
require "../controllers/habitacion.php";
require "../controllers/promocion.php";
require "../controllers/servicio.php";
require "../controllers/usuario.php";
require "../routes/log.php";

header("Content-Type: application/json; charset=UTF-8");

$requestMethod = $_SERVER['REQUEST_METHOD'];
$url = $_GET["url"] ?? null;

if ($requestMethod === "GET") {
    switch ($url) {
        case "administrador":
            obtenerAdministrador();
            break;
        case "habitacion":
            obtenerHabitacion();
            break;
        case "promocion":
            obtenerPromocion();
            break;
        case "servicio":
            obtenerServicio();
            break;
        case "usuario":
            obtenerUsuario();
            break;
        default:
            echo json_encode(["error" => "Ruta no encontrada"]);
    }
    exit;
}

elseif ($requestMethod === "POST") {
    $rawInput = file_get_contents("php://input");
    $data = json_decode($rawInput, true);
    $solicitud = $url;

    if (!$data && !empty($_POST)) {
        $data = $_POST;
    }

    if ($solicitud === "login") {
        loginAdministrador($data["email"] ?? "", $data["password"] ?? "");
        exit;
    }

    if ($solicitud === "loginUsr") {
        loginUsuario($data["email"] ?? "", $data["password"] ?? "");
        exit;
    }

    if ($solicitud === "loginAddUsr") {
        loginAddUser(
            $data["nombre"] ?? "",
            $data["apellido"] ?? "",
            $data["email"] ?? "",
            $data["celular"] ?? "",
            $data["password"] ?? ""
        );
        exit;
    }

    if ($solicitud === "habitacion") {
        $action = $data["action"] ?? $_POST["action"] ?? null;

        // Manejo de imagen si se sube un archivo
        $imagen = "";
        if (isset($_FILES["imagen_hab"]["name"]) && $_FILES["imagen_hab"]["error"] === UPLOAD_ERR_OK) {
            $uploadDir = "../../Fronted/img/";
            if (!is_dir($uploadDir)) {
                mkdir($uploadDir, 0755, true);
            }
            $extension = pathinfo($_FILES["imagen_hab"]["name"], PATHINFO_EXTENSION);
            $nombreArchivo = "hab_" . time() . "." . $extension;
            $rutaCompleta = $uploadDir . $nombreArchivo;
            if (move_uploaded_file($_FILES["imagen_hab"]["tmp_name"], $rutaCompleta)) {
                $imagen = "img/" . $nombreArchivo;
            }
        }

        switch ($action) {
            case "listar":
                $habitaciones = $habitacionController->habitacionModel->obtenerHabitacion();
                echo json_encode([
                    "success" => true,
                    "habitaciones" => $habitaciones
                ]);
                break;

            case "agregar":
                $habitacionController->agregarHabitacion(
                    $_POST["tipo_hab"] ?? $data["tipo_hab"] ?? "",
                    $_POST["descripcion_hab"] ?? $data["descripcion_hab"] ?? "",
                    $_POST["disponible"] ?? $data["disponible"] ?? 0,
                    $imagen ?: ($_POST["imagen"] ?? $data["imagen"] ?? ""),
                    $_POST["precio"] ?? $data["precio"] ?? 0
                );
                break;

            case "editar":
                // Si no hay nueva imagen, mantener la anterior
                $imagenFinal = $imagen ?: ($_POST["imagen"] ?? $data["imagen"] ?? "");
                $habitacionController->editarHabitacion(
                    $_POST["id_hab"] ?? $data["id_hab"] ?? null,
                    $_POST["tipo_hab"] ?? $data["tipo_hab"] ?? "",
                    $_POST["descripcion_hab"] ?? $data["descripcion_hab"] ?? "",
                    $_POST["disponible"] ?? $data["disponible"] ?? 0,
                    $imagenFinal,
                    $_POST["precio"] ?? $data["precio"] ?? 0
                );
                break;

            case "obtener_uno":
                $habitacionController->obtenerHabitacionPorId($_POST["id_hab"] ?? $data["id_hab"] ?? null);
                break;

            case "eliminar":
                $habitacionController->eliminarHabitacion($_POST["id_hab"] ?? $data["id_hab"] ?? null);
                break;

            default:
                echo json_encode(["error" => "Acción no válida o no especificada"]);
        }
        exit;
    }

    if ($solicitud === "promocion") {
        $action = $_GET["action"] ?? $data["action"] ?? $_POST["action"] ?? null;

        // Manejo de imagen si se sube un archivo
        $imagen = "";
        if (isset($_FILES["imagen_promo"]["name"]) && $_FILES["imagen_promo"]["error"] === UPLOAD_ERR_OK) {
            $uploadDir = "../../Fronted/img/";
            if (!is_dir($uploadDir)) {
                mkdir($uploadDir, 0755, true);
            }
            $extension = pathinfo($_FILES["imagen_promo"]["name"], PATHINFO_EXTENSION);
            $nombreArchivo = "promo_" . time() . "." . $extension;
            $rutaCompleta = $uploadDir . $nombreArchivo;
            if (move_uploaded_file($_FILES["imagen_promo"]["tmp_name"], $rutaCompleta)) {
                $imagen = "img/" . $nombreArchivo;
            }
        }

        switch ($action) {
            case "agregar":
                agregarPromocion(
                    $_POST["titulo_promo"] ?? $data["titulo_promo"] ?? "",
                    $_POST["descripcion_promo"] ?? $data["descripcion_promo"] ?? "",
                    $imagen ?: ($_POST["img_promo"] ?? $data["img_promo"] ?? ""),
                    $_POST["precio_promo"] ?? $data["precio_promo"] ?? 0
                );
                break;

            case "editar":
                $imagenFinal = $imagen ?: ($_POST["img_promo"] ?? $data["img_promo"] ?? "");
                editarPromocion(
                    $_GET["id"] ?? $_POST["id_promo"] ?? $data["id_promo"] ?? null,
                    $_POST["titulo_promo"] ?? $data["titulo_promo"] ?? "",
                    $_POST["descripcion_promo"] ?? $data["descripcion_promo"] ?? "",
                    $imagenFinal,
                    $_POST["precio_promo"] ?? $data["precio_promo"] ?? 0
                );
                break;

            case "obtener_uno":
                obtenerPromocionPorId($_GET["id"] ?? $_POST["id_promo"] ?? $data["id_promo"] ?? null);
                break;

            case "eliminar":
                eliminarPromocion($_GET["id"] ?? $_POST["id_promo"] ?? $data["id_promo"] ?? null);
                break;

            default:
                echo json_encode(["error" => "Acción no válida"]);
        }
        exit;
    }

    if ($solicitud === "servicio") {
        $action = $data["action"] ?? $_POST["action"] ?? null;

        // Manejo de imagen si se sube un archivo
        $imagen = "";
        if (isset($_FILES["imagen_servicio"]["name"]) && $_FILES["imagen_servicio"]["error"] === UPLOAD_ERR_OK) {
            $uploadDir = "../../Fronted/img/";
            if (!is_dir($uploadDir)) {
                mkdir($uploadDir, 0755, true);
            }
            $extension = pathinfo($_FILES["imagen_servicio"]["name"], PATHINFO_EXTENSION);
            $nombreArchivo = "serv_" . time() . "." . $extension;
            $rutaCompleta = $uploadDir . $nombreArchivo;
            if (move_uploaded_file($_FILES["imagen_servicio"]["tmp_name"], $rutaCompleta)) {
                $imagen = "img/" . $nombreArchivo;
            }
        }

        switch ($action) {
            case "agregar":
                agregarServicio(
                    $_POST["tipo_servicio"] ?? $data["tipo_servicio"] ?? "",
                    $_POST["descripcion_servicio"] ?? $data["descripcion_servicio"] ?? "",
                    $imagen ?: ($_POST["imagen"] ?? $data["imagen"] ?? ""),
                    $_POST["id_promo"] ?? $data["id_promo"] ?? null
                );
                break;
            case "eliminar":
                eliminarServicio($_POST["id_servicio"] ?? $data["id_servicio"] ?? null);
                break;
            case "editar":
                $imagenFinal = $imagen ?: ($_POST["imagen"] ?? $data["imagen"] ?? "");
                editarServicio(
                    $_POST["id_servicio"] ?? $data["id_servicio"] ?? null,
                    $_POST["tipo_servicio"] ?? $data["tipo_servicio"] ?? "",
                    $_POST["descripcion_servicio"] ?? $data["descripcion_servicio"] ?? "",
                    $imagenFinal
                );
                break;
            case "obtener_uno":
                obtenerServicioPorId($_POST["id_servicio"] ?? $data["id_servicio"] ?? null);
                break;
            default:
                obtenerServicio();
        }
        exit;
    }

    if ($solicitud === "usuario") {
        agregarUsuario($data["nombre"] ?? "", $data["apellido"] ?? "", $data["email"] ?? "", $data["celular"] ?? "");
        exit;
    }

    echo json_encode(["error" => "Ruta no encontrada"]);
    exit;
}

else {
    echo json_encode(["error" => "Método HTTP no permitido"]);
    exit;
}


header('Content-Type: application/json');

$url = isset($_GET['url']) ? $_GET['url'] : '';

switch ($url) {
    case 'habDisponible':
        require_once '../Backend/controllers/habDisponible.php';
        break;
    case 'habitacion':
        require_once '../Backend/models/HabDisponible.php';
        $_GET['action'] = 'por-id';
        $controller = new DisponibilidadController();
        echo $controller->obtenerPorId();
        exit;
        break;
    default:
        http_response_code(404);
        echo json_encode(['error' => 'Endpoint no encontrado']);
        break;
}
?>
