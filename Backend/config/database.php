<?php
// Definimos las credenciales para la conexión a la base de datos
$host = "localhost";       // Servidor donde está la base de datos (local en este caso)
$dbname = "Nobredb"; // Nombre de la base de datos
$username = "root";        // Usuario de la base de datos (por defecto en XAMPP o WAMP)
$password = "";            // Contraseña del usuario (vacía por defecto en XAMPP/WAMP)

try {
    // Creamos una instancia de PDO para la conexión a MySQL
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $username, $password);
    
    // Configuramos PDO para que lance excepciones en caso de error
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    // Si la conexión es exitosa, el código continúa sin problemas
} catch (PDOException $e) {
    // En caso de error, se captura la excepción y se muestra un mensaje
    die("Error en la conexión: " . $e->getMessage()); // Finaliza la ejecución del script mostrando el error
}
?>