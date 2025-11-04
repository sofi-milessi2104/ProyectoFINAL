<?php
require "../config/database.php";
require "../models/Habitacion.php";

class HabitacionController {
    private $habitacionModel;

    public function __construct($pdo) {
        $this->habitacionModel = new Habitacion($pdo);
    }

    // === OBTENER TODAS LAS HABITACIONES ===
    public function obtenerHabitacion() {
        echo json_encode($this->habitacionModel->obtenerHabitacion());
    }

    // === AGREGAR HABITACIÓN ===
    public function agregarHabitacion($tipo_hab, $descripcion_hab, $disponible, $imagen, $precio) {
        $resultado = $this->habitacionModel->agregar($tipo_hab, $descripcion_hab, $disponible, $imagen, $precio);
        echo json_encode([
            "success" => $resultado,
            "message" => $resultado ? "Habitación agregada correctamente." : "Error al agregar la habitación."
        ]);
    }

    // === ELIMINAR HABITACIÓN ===
    public function eliminarHabitacion($id) {
        $resultado = $this->habitacionModel->eliminar($id);
        echo json_encode([
            "success" => $resultado,
            "message" => $resultado ? "Habitación eliminada correctamente." : "Error al eliminar la habitación."
        ]);
    }

    public function obtenerHabitacionPorId($id) {
    $habitacion = $this->habitacionModel->obtenerPorId($id);
    if ($habitacion) {
        echo json_encode(["success" => true, "data" => $habitacion]);
    } else {
        echo json_encode(["success" => false, "message" => "Habitación no encontrada."]);
    }
    }

}

// Instancia global (para mantener compatibilidad con api.php actual)
$habitacionController = new HabitacionController($pdo);

// Funciones “puente” (para que tu api.php siga funcionando igual)
function obtenerHabitacion() {
    global $habitacionController;
    $habitacionController->obtenerHabitacion();
}

function agregarHabitacion($tipo_hab, $descripcion_hab, $disponible, $imagen = "", $precio = 0) {
    global $habitacionController;
    $habitacionController->agregarHabitacion($tipo_hab, $descripcion_hab, $disponible, $imagen, $precio);
}

function eliminarHabitacion($id) {
    global $habitacionController;
    $habitacionController->eliminarHabitacion($id);
}

function obtenerHabitacionPorId($id) {
    global $habitacionController;
    $habitacionController->obtenerHabitacionPorId($id);
}

?>
