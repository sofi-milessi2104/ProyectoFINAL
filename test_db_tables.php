<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

require "Backend/config/database.php";

echo "Tablas en la base de datos:\n";
try {
    $stmt = $pdo->query("SHOW TABLES");
    $tables = $stmt->fetchAll(PDO::FETCH_COLUMN);
    foreach ($tables as $table) {
        echo "- $table\n";
    }
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
?>
