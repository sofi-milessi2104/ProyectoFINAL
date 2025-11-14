<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

require "Backend/config/database.php";
require "Backend/models/Promocion.php";
require "Backend/controllers/promocion.php";

echo "Intentando agregar promoción...\n";

// Probar agregar
ob_start();
agregarPromocion('Prueba Nueva', 'Descripción de prueba', '', 150);
$output = ob_get_clean();

echo "Respuesta del controlador:\n";
echo $output;
echo "\n";

// Decodificar JSON
$resultado = json_decode($output, true);
print_r($resultado);
?>
