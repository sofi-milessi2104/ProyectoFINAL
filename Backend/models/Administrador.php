<?php
require "../config/database.php";

class Administrador {
    private $pdo;

    public function __construct($pdo) {
        $this->pdo = $pdo;
    }

    public function obtenerAdministrador() {
        $stmt = $this->pdo->prepare("SELECT * FROM administrador");
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function loginAdd($ci, $nombre_completo, $email, $area, $password) {
        $hash = password_hash($password, PASSWORD_DEFAULT);
        $stmt = $this->pdo->prepare("INSERT INTO administrador (ci, nombre_completo, email, area, password) VALUES (:ci, :nombre_completo, :email, :area, :password)");
        return $stmt->execute(["ci" => $ci, "nombre_completo" => $nombre_completo, "email" => $email, "area" => $area, "password" => $password]);
    }

    public function eliminar($id) {
        $stmt = $this->pdo->prepare("DELETE FROM administrador WHERE ci = :id");
        return $stmt->execute(["id" => $id]);
    }

    public function login($email, $password) {
        $stmt = $this->pdo->prepare("SELECT * FROM administrador WHERE email = :email AND password = :password");
        $stmt->execute(["email" => $email, "password" => $password]);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

}
?>