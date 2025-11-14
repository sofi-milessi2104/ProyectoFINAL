<?php
$host = "localhost";
$dbname = "hotel2";
$username = "root";
$password = "";

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
} catch (PDOException $e) {
    // IMPORTANTE: Lanzar la excepción en lugar de usar die()
    // Esto asegura que el script principal maneje el error y responda con JSON.
    throw new Exception("Error de conexión a la base de datos: " . $e->getMessage());
}