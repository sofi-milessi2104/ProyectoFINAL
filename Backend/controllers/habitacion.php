<?php
require "../config/database.php";
require "../models/Habitacion.php";

class HabitacionController {
    private $habitacionModel;

    public function __construct($pdo) {
        $this->habitacionModel = new Habitacion($pdo);
    }

    public function obtenerHabitacion() {
        echo json_encode($this->habitacionModel->obtenerHabitacion());
    }

    public function agregarHabitacion($tipo_hab, $descripcion_hab, $disponible, $imagen, $precio) {
        $resultado = $this->habitacionModel->agregar($tipo_hab, $descripcion_hab, $disponible, $imagen, $precio);
        echo json_encode([
            "success" => $resultado,
            "message" => $resultado ? "Habitación agregada correctamente." : "Error al agregar la habitación."
        ]);
    }

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

$habitacionController = new HabitacionController($pdo);

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
