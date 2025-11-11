//Controllers

<?php
require_once '../config/Database.php';

// Leer el cuerpo del POST como JSON
$input = json_decode(file_get_contents('php://input'), true);

// Validar que se recibieron las fechas
if (!isset($input['fecha_inicio']) || !isset($input['fecha_fin'])) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => 'Parámetros requeridos: fecha_inicio y fecha_fin'
    ]);
    exit;
}

$fechaInicio = $input['fecha_inicio'];
$fechaFin = $input['fecha_fin'];

// Conectar a la base de datos
$database = new Database();
$db = $database->getConnection();

// Instanciar el modelo
$habitacion = new HabDisponible($db);


// Devolver resultado como JSON
echo json_encode($resultado);
?>


//Models

<?php
class HabDisponible {
    private $conn;

    public function __construct($db) {
        $this->conn = $db;
    }

    public function obtenerDisponibles($fechaInicio, $fechaFin) {
        try {
            $sql = "
                SELECT * FROM habitaciones h
                WHERE h.id_hab NOT IN (
                    SELECT r.id_habitacion
                    FROM reservas r
                    WHERE NOT (
                        r.fecha_fin < :fechaInicio OR
                        r.fecha_inicio > :fechaFin
                    )
                )
            ";

            $stmt = $this->conn->prepare($sql);
            $stmt->bindParam(':fechaInicio', $fechaInicio);
            $stmt->bindParam(':fechaFin', $fechaFin);
            $stmt->execute();

            $habitaciones = $stmt->fetchAll(PDO::FETCH_ASSOC);
            return ['success' => true, 'data' => $habitaciones];

        } catch (PDOException $e) {
            return [
                'success' => false,
                'message' => 'Error: ' . $e->getMessage(),
                'file' => __FILE__,
                'line' => __LINE__
            ];
        }
    }
}
?>



//Api

<?php
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
