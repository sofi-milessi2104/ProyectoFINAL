<?php
class Database {
    private $host = '127.0.0.1';
    private $db_name = 'hotel2'; // cambia al nombre de tu BD
    private $username = 'root';
    private $password = '';
    private $conn;

    public function connect() {
        $this->conn = null;
        try {
            $this->conn = new PDO(
                "mysql:host={$this->host};dbname={$this->db_name};charset=utf8mb4",
                $this->username,
                $this->password,
                [
                    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
                ]
            );
        } catch (PDOException $e) {
            // No imprimir en producción; para debug temporal puedes usar echo
            error_log("DB connection error: " . $e->getMessage());
            throw $e;
        }
        return $this->conn;
    }
}
?>