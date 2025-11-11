<?php
class Reserva {
    private $pdo;

    public function __construct($pdo) {
        $this->pdo = $pdo;
    }

    public function agregarReserva($data) {
        try {
            $this->pdo->beginTransaction();

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
                $data['tarjeta'],
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