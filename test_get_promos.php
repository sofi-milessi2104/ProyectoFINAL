<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Simular llamada GET a promociones
$_GET['url'] = 'promocion';
$_SERVER['REQUEST_METHOD'] = 'GET';

// Capturar salida
ob_start();
include 'Backend/routes/api.php';
$output = ob_get_clean();

echo "=== SALIDA DEL BACKEND ===\n";
echo $output;
echo "\n=== FIN SALIDA ===\n";
?>
