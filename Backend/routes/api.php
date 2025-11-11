<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

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
        $action = $data["action"] ?? null;

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
                    $data["tipo_hab"] ?? "",
                    $data["descripcion_hab"] ?? "",
                    $data["disponible"] ?? 0,
                    $data["imagen"] ?? "",
                    $data["precio"] ?? 0
                );
                break;

            case "eliminar":
                $habitacionController->eliminarHabitacion($data["id_hab"] ?? null);
                break;

            default:
                echo json_encode(["error" => "Acción no válida o no especificada"]);
        }
        exit;
    }

    if ($solicitud === "promocion") {
        agregarPromocion($data["tipo_promo"] ?? "", $data["descripcion_promo"] ?? "", $data["precio"] ?? 0);
        exit;
    }

    if ($solicitud === "servicio") {
        agregarServicio($data["tipo_servicio"] ?? "", $data["descripcion_servicio"] ?? "", $data["imagen"] ?? "");
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
