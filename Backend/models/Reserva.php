<?php
class Reserva {
    private $pdo;
    // Clave de encriptación (cambiar en producción por una variable de entorno segura)
    private $encryptionKey = 'hotel_costa_colonia_key_2025';

    public function __construct($pdo) {
        $this->pdo = $pdo;
    }

    /**
     * Encripta un string usando AES-256-CBC
     * @param string $data Datos a encriptar
     * @return string Datos encriptados en base64
     */
    private function encryptData($data) {
        if (empty($data)) {
            return null;
        }
        
        // Generar IV aleatorio
        $iv = openssl_random_pseudo_bytes(16);
        
        // Encriptar usando AES-256-CBC
        $encrypted = openssl_encrypt(
            $data,
            'AES-256-CBC',
            hash('sha256', $this->encryptionKey, true),
            0,
            $iv
        );
        
        // Combinar IV + datos encriptados y convertir a base64 para almacenar
        $result = base64_encode($iv . $encrypted);
        
        return $result;
    }

    /**
     * Desencripta un string encriptado con encryptData
     * @param string $data Datos encriptados en base64
     * @return string Datos desencriptados
     */
    public function decryptData($data) {
        if (empty($data)) {
            return null;
        }
        
        try {
            // Decodificar de base64
            $decoded = base64_decode($data);
            
            // Extraer IV (primeros 16 bytes)
            $iv = substr($decoded, 0, 16);
            
            // Extraer datos encriptados
            $encrypted = substr($decoded, 16);
            
            // Desencriptar
            $decrypted = openssl_decrypt(
                $encrypted,
                'AES-256-CBC',
                hash('sha256', $this->encryptionKey, true),
                0,
                $iv
            );
            
            return $decrypted;
        } catch (Exception $e) {
            return null;
        }
    }

    public function agregarReserva($data) {
        try {
            $this->pdo->beginTransaction();

            // Encriptar la tarjeta antes de guardarla
            $tarjetaEncriptada = $this->encryptData($data['tarjeta'] ?? '');

            $stmt = $this->pdo->prepare("
                INSERT INTO reserva (
                    id_usuario, adultos, niños, fecha_inicio, fecha_fin,
                    id_habitacion, tarjeta, nombre_tarjeta, vencimiento, cvc
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ");

            $stmt->execute([
                $data['id_usuario'] ?? null,
                $data['adultos'] ?? '1',
                $data['niños'] ?? '0',
                $data['fecha_inicio'],
                $data['fecha_fin'],
                $data['id_habitacion'],
                $tarjetaEncriptada,  // Tarjeta encriptada
                $data['nombre_tarjeta'] ?? null,
                $data['vencimiento'] ?? null,
                $data['cvc'] ?? null
            ]);

            $id_reserva = $this->pdo->lastInsertId();

            // Insertar servicios (si hay)
            if (!empty($data['servicios']) && is_array($data['servicios'])) {
                $stmtServ = $this->pdo->prepare("
                    INSERT INTO reserva_servicio (id_reserva, id_servicio)
                    VALUES (?, ?)
                ");
                foreach ($data['servicios'] as $id_servicio) {
                    $stmtServ->execute([$id_reserva, $id_servicio]);
                }
            }

            $this->pdo->commit();
            return [
                'success' => true,
                'message' => 'Reserva realizada con éxito',
                'id_reserva' => $id_reserva
            ];
        } catch (PDOException $e) {
            $this->pdo->rollBack();
            return [
                'success' => false,
                'message' => 'Error al guardar la reserva: ' . $e->getMessage()
            ];
        }
    }
}