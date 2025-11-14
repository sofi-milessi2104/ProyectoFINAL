<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Simular lo que hace el formulario
$_POST['titulo_promo'] = 'Prueba';
$_POST['descripcion_promo'] = 'Descripción de prueba';
$_POST['precio_promo'] = 100;
$_POST['action'] = 'agregar';
$_GET['url'] = 'promocion';

// Capturar la salida
ob_start();

// Incluir el archivo api.php
include 'Backend/routes/api.php';

$output = ob_get_clean();

echo "Salida del backend:\n";
echo $output;
echo "\n";
?>
