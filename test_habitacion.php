<?php
require 'Backend/config/database.php';
require 'Backend/models/Habitacion.php';

$hab = new Habitacion($pdo);
$resultado = $hab->obtenerHabitacion();
echo 'Habitaciones encontradas: ' . count($resultado) . PHP_EOL;
if (count($resultado) > 0) {
    echo 'Primera habitación: ' . json_encode($resultado[0]) . PHP_EOL;
}
?>
