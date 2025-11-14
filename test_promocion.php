<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

require "Backend/config/database.php";
require "Backend/models/Promocion.php";

$promocionModel = new Promocion($pdo);

echo "Intentando obtener promociones...\n";
try {
    $result = $promocionModel->obtenerPromocion();
    echo "Resultado:\n";
    print_r($result);
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
?>
