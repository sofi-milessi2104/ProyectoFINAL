<?php
class Reserva {
    private $pdo;
    
    private $encryptionKey = 'TU_CLAVE_SECRETA_FUERTE'; 

    public function __construct($pdo) {
        $this->pdo = $pdo;
    }
    
    private function obtenerDisponibilidadTotal($id_habitacion) {
        $stmt = $this->pdo->prepare("
            SELECT disponible
            FROM habitacion
            WHERE id_hab = ?
        ");
        $stmt->execute([$id_habitacion]);
        $disponible = $stmt->fetchColumn();
        
        return $disponible !== false ? (int)$disponible : 0; 
    }

    private function verificarDisponibilidad($id_habitacion, $fecha_inicio, $fecha_fin) {
        $stmt = $this->pdo->prepare("
            SELECT COUNT(r.id_reserva)
            FROM reserva r
            WHERE 
                r.id_habitacion = :id_habitacion AND
                r.fecha_fin > :fecha_inicio_nueva AND
                r.fecha_inicio < :fecha_fin_nueva
        ");

        $stmt->execute([
            ':id_habitacion' => $id_habitacion,
            ':fecha_inicio_nueva' => $fecha_inicio,
            ':fecha_fin_nueva' => $fecha_fin
        ]);

        return (int)$stmt->fetchColumn();
    }

    public function countTodayReservations() {
        $today = date('Y-m-d');
        
        $query = "SELECT COUNT(*) as total FROM reserva WHERE DATE(fecha_inicio) = :today";
        
        try {
            $stmt = $this->pdo->prepare($query); 
            $stmt->bindParam(':today', $today, PDO::PARAM_STR);
            $stmt->execute();
            $result = $stmt->fetch(PDO::FETCH_ASSOC);
            
            return $result['total'] ?? 0; 
        } catch (PDOException $e) {
            error_log("Error al contar reservas de hoy: " . $e->getMessage()); 
            return 0;
        }
    }

    public function getTodayReservationsList() {
        $today = date('Y-m-d');
        
        $query = "
            SELECT id_reserva, id_usuario, id_habitacion, fecha_inicio, fecha_fin, adultos, niños 
            FROM reserva 
            WHERE DATE(fecha_inicio) = :today 
            ORDER BY fecha_inicio ASC";
        
        try {
            $stmt = $this->pdo->prepare($query);
            $stmt->bindParam(':today', $today, PDO::PARAM_STR);
            $stmt->execute();
            
            return $stmt->fetchAll(PDO::FETCH_ASSOC); 
        } catch (PDOException $e) {
            error_log("Error al obtener lista de reservas de hoy: " . $e->getMessage());
            return [];
        }
    }

    public function agregarReserva($data) {
        try {
            $this->pdo->beginTransaction();

            $id_habitacion = $data['id_habitacion'] ?? null;
            $fecha_inicio = $data['fecha_inicio'] ?? null;
            $fecha_fin = $data['fecha_fin'] ?? null;
            $vencimiento = $data['vencimiento'] ?? '';

            if ($id_habitacion === null || $fecha_inicio === null || $fecha_fin === null) {
                 $this->pdo->rollBack(); 
                 return ['success' => false, 'message' => 'Faltan datos esenciales (habitación o fechas).'];
            }
            
            $disponibilidad_total = $this->obtenerDisponibilidadTotal($id_habitacion);
            
            if ($disponibilidad_total <= 0) {
                 $this->pdo->rollBack(); 
                 return ['success' => false, 'message' => 'Lo sentimos, esta habitación no tiene disponibilidad en absoluto.'];
            }
            
            $reservas_existentes = $this->verificarDisponibilidad($id_habitacion, $fecha_inicio, $fecha_fin);
            
            if (($reservas_existentes + 1) > $disponibilidad_total) {
                $this->pdo->rollBack(); 
                return [
                    'success' => false, 
                    'message' => 'La habitación ya está totalmente reservada para ese rango de fechas. Pruebe otras fechas o habitaciones.'
                ];
            }

            if (!empty($vencimiento)) {
                $fechaVencimiento = DateTime::createFromFormat('m/y', $vencimiento);

                if ($fechaVencimiento !== false) {
                    $fechaVencimiento->modify('last day of this month');

                    $fechaActual = new DateTime();
                    
                    if ($fechaVencimiento < $fechaActual) {
                        $this->pdo->rollBack(); 
                        return [
                            'success' => false,
                            'message' => 'La tarjeta ha expirado. Por favor, verifique la fecha de vencimiento o use otra tarjeta.'
                        ];
                    }
                }
            }

            $stmt = $this->pdo->prepare("
                INSERT INTO reserva (
                    id_usuario, adultos, niños, fecha_inicio, fecha_fin,
                    id_habitacion, tarjeta, nombre_tarjeta, vencimiento, cvc
                ) VALUES (
                    ?, ?, ?, ?, ?, ?,
                    AES_ENCRYPT(?, ?),  
                    ?, ?, ?
                )
            ");

            $stmt->execute([
                $data['id_usuario'] ?? null,
                $data['adultos'] ?? '1',
                $data['niños'] ?? '0',
                $data['fecha_inicio'],
                $data['fecha_fin'],
                $data['id_habitacion'],
                $data['tarjeta'],
                $this->encryptionKey,
                $data['nombre_tarjeta'] ?? null,
                $data['vencimiento'] ?? null,
                $data['cvc'] ?? null
            ]);

            $id_reserva = $this->pdo->lastInsertId();

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
                'message' => 'Error interno al guardar la reserva. ' . $e->getMessage() 
            ];
        }
    }
}
?>