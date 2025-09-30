<?php
// Configuración de la base de datos (ajusta según tu entorno local)
$host = '127.0.0.1';
$dbname = 'hotel2';
$username = 'root'; // Usuario por defecto en XAMPP/WAMP
$password = ''; // Contraseña por defecto (vacía en local)

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    die("Error de conexión: " . $e->getMessage());
}

// Procesar formulario de reserva si se envía
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['reservar'])) {
    $nombre = trim($_POST['nombre'] ?? '');
    $apellido = trim($_POST['apellido'] ?? '');
    $email = trim($_POST['email'] ?? '');
    $celular = trim($_POST['celular'] ?? '');
    $adultos = $_POST['adultos'] ?? '1';
    $ninos = $_POST['ninos'] ?? '';
    $fecha_inicio = $_POST['fecha_inicio'] ?? '';
    $fecha_fin = $_POST['fecha_fin'] ?? '';
    $id_habitacion = (int)($_POST['id_habitacion'] ?? 0);
    $id_servicio = (int)($_POST['id_servicio'] ?? 0);
    $tarjeta = trim($_POST['tarjeta'] ?? '');

    // Validaciones básicas
    $errors = [];
    if (empty($nombre) || empty($apellido) || empty($email) || empty($celular)) {
        $errors[] = "Todos los campos de usuario son obligatorios.";
    }
    if (empty($fecha_inicio) || empty($fecha_fin) || $fecha_inicio >= $fecha_fin) {
        $errors[] = "Fechas inválidas. La fecha de fin debe ser posterior a la de inicio.";
    }
    if ($id_habitacion <= 0 || $id_servicio <= 0) {
        $errors[] = "Debe seleccionar una habitación y un servicio.";
    }
    if (empty($tarjeta) || strlen($tarjeta) < 16) {
        $errors[] = "Número de tarjeta inválido (mínimo 16 dígitos).";
    }

    if (empty($errors)) {
        // Verificar si el usuario existe por email
        $stmt = $pdo->prepare("SELECT id_usuario FROM usuario WHERE email = ?");
        $stmt->execute([$email]);
        $id_usuario = $stmt->fetchColumn();

        if ($id_usuario === false) {
            // Insertar nuevo usuario
            $stmt = $pdo->prepare("INSERT INTO usuario (nombre, apellido, email, celular, password) VALUES (?, ?, ?, ?, 'password_default')");
            $stmt->execute([$nombre, $apellido, $email, $celular]);
            $id_usuario = $pdo->lastInsertId();
        }

        // Insertar reserva (adultos y niños como SET, asumiendo valores válidos del formulario)
        $stmt = $pdo->prepare("INSERT INTO reserva (id_usuario, adultos, niños, fecha_inicio, fecha_fin, id_habitacion, id_servicio, tarjeta) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
        $success = $stmt->execute([$id_usuario, $adultos, $ninos, $fecha_inicio, $fecha_fin, $id_habitacion, $id_servicio, $tarjeta]);

        if ($success) {
            $message = "¡Reserva confirmada exitosamente! ID de reserva: " . $pdo->lastInsertId();
            // Opcional: Actualizar disponibilidad de habitación a 0
            $stmt = $pdo->prepare("UPDATE habitacion SET disponible = 0 WHERE id_hab = ?");
            $stmt->execute([$id_habitacion]);
        } else {
            $errors[] = "Error al procesar la reserva.";
        }
    }
}

// Obtener habitaciones disponibles
$stmt = $pdo->query("SELECT * FROM habitacion WHERE disponible = 1");
$habitaciones = $stmt->fetchAll(PDO::FETCH_ASSOC);

// Obtener servicios
$stmt = $pdo->query("SELECT * FROM servicio");
$servicios = $stmt->fetchAll(PDO::FETCH_ASSOC);
?>

<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sistema de Reservas de Hotel</title>
    <style>
        /* CSS inline para un diseño simple y responsivo */
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            color: #333;
            line-height: 1.6;
        }
        .container {
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            background: white;
            border-radius: 10px;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
        }
        h1, h2 {
            text-align: center;
            color: #2c3e50;
            margin-bottom: 20px;
        }
        .form-group {
            margin-bottom: 15px;
        }
        label {
            display: block;
            margin-bottom: 5px;
            font-weight: bold;
        }
        input, select {
            width: 100%;
            padding: 10px;
            border: 1px solid #ddd;
            border-radius: 5px;
            font-size: 16px;
        }
        .grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 15px;
        }
        .habitacion-card, .servicio-card {
            border: 1px solid #ddd;
            border-radius: 8px;
            padding: 15px;
            margin-bottom: 15px;
            background: #f9f9f9;
        }
        .habitacion-card h3, .servicio-card h3 {
            color: #2c3e50;
            margin-bottom: 10px;
        }
        .error {
            color: red;
            background: #ffe6e6;
            padding: 10px;
            border-radius: 5px;
            margin-bottom: 15px;
        }
        .success {
            color: green;
            background: #e6ffe6;
            padding: 10px;
            border-radius: 5px;
            margin-bottom: 15px;
        }
        button {
            background: #3498db;
            color: white;
            padding: 12px 20px;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-size: 16px;
            width: 100%;
            margin-top: 10px;
        }
        button:hover {
            background: #2980b9;
        }
        .total {
            background: #ecf0f1;
            padding: 15px;
            border-radius: 5px;
            text-align: right;
            font-weight: bold;
            margin-top: 15px;
        }
        @media (max-width: 600px) {
            .grid {
                grid-template-columns: 1fr;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Reserva de Hotel</h1>
        
        <?php if (isset($message)): ?>
            <div class="success"><?php echo $message; ?></div>
        <?php endif; ?>
        
        <?php if (!empty($errors)): ?>
            <div class="error">
                <ul>
                    <?php foreach ($errors as $error): ?>
                        <li><?php echo $error; ?></li>
                    <?php endforeach; ?>
                </ul>
            </div>
        <?php endif; ?>

        <form method="POST" id="formReserva">
            <!-- Datos del Usuario -->
            <h2>Datos del Huésped</h2>
            <div class="grid">
                <div class="form-group">
                    <label for="nombre">Nombre:</label>
                    <input type="text" id="nombre" name="nombre" required>
                </div>
                <div class="form-group">
                    <label for="apellido">Apellido:</label>
                    <input type="text" id="apellido" name="apellido" required>
                </div>
                <div class="form-group">
                    <label for="email">Email:</label>
                    <input type="email" id="email" name="email" required>
                </div>
                <div class="form-group">
                    <label for="celular">Celular:</label>
                    <input type="tel" id="celular" name="celular" required>
                </div>
            </div>

            <!-- Número de Huéspedes (basado en SET de la BD: adultos 1-3, niños 0-2) -->
            <h2>Detalles de la Reserva</h2>
            <div class="grid">
                <div class="form-group">
                    <label for="adultos">Adultos:</label>
                    <select id="adultos" name="adultos" required>
                        <option value="">Seleccione</option>
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="ninos">Niños:</label>
                    <select id="ninos" name="ninos">
                        <option value="">0</option>
                        <option value="1">1</option>
                        <option value="2">2</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="fecha_inicio">Fecha de Inicio:</label>
                    <input type="date" id="fecha_inicio" name="fecha_inicio" min="<?php echo date('Y-m-d'); ?>" required>
                </div>
                <div class="form-group">
                    <label for="fecha_fin">Fecha de Fin:</label>
                    <input type="date" id="fecha_fin" name="fecha_fin" required>
                </div>
            </div>

            <!-- Selección de Habitación -->
            <h2>Disponibilidad de Habitaciones</h2>
            <?php if (empty($habitaciones)): ?>
                <p>No hay habitaciones disponibles en este momento.</p>
            <?php else: ?>
                <div class="form-group">
                    <label for="id_habitacion">Seleccione Habitación:</label>
                    <select id="id_habitacion" name="id_habitacion" required onchange="calcularTotal()">
                        <option value="">Seleccione una habitación</option>
                        <?php foreach ($habitaciones as $hab): ?>
                            <option value="<?php echo $hab['id_hab']; ?>" data-precio="<?php echo $hab['precio']; ?>">
                                <?php echo $hab['tipo_hab']; ?> - <?php echo $hab['descripcion_hab']; ?> (Bs. <?php echo $hab['precio']; ?>/noche)
                            </option>
                        <?php endforeach; ?>
                    </select>
                </div>
            <?php endif; ?>

            <!-- Selección de Servicio -->
            <h2>Servicios Adicionales</h2>
            <div class="form-group">
                <label for="id_servicio">Seleccione Servicio:</label>
                <select id="id_servicio" name="id_servicio" required>
                    <option value="">Seleccione un servicio</option>
                    <?php foreach ($servicios as $serv): ?>
                        <option value="<?php echo $serv['id_servicio']; ?>">
                            <?php echo $serv['tipo_servicio']; ?> - <?php echo $serv['descripcion_servicio']; ?>
                        </option>
                    <?php endforeach; ?>
                </select>
            </div>

            <!-- Pago -->
            <h2>Información de Pago</h2>
            <div class="form-group">
                <label for="tarjeta">Número de Tarjeta (16 dígitos):</label>
                <input type="text" id="tarjeta" name="tarjeta" maxlength="16" placeholder="1234567890123456" required>
            </div>

            <!-- Total Estimado (calculado con JS) -->
            <div id="totalEstimado" class="total" style="display: none;">
                Total Estimado: <span id="totalAmount">0</span> Bs.
            </div>

            <button type="submit" name="reservar">Confirmar Reserva</button>
        </form>
    </div>

    <script>
        // JS inline para validaciones y cálculos
        const fechaInicio = document.getElementById('fecha_inicio');
        const fechaFin = document.getElementById('fecha_fin');
        const idHabitacion = document.getElementById('id_habitacion');
        const totalDiv = document.getElementById('totalEstimado');
        const totalAmount = document.getElementById('totalAmount');

        // Actualizar min de fecha fin cuando cambie fecha inicio
        fechaInicio.addEventListener('change', function() {
            const minDate = this.value;
            fechaFin.min = minDate;
            calcularTotal();
        });

        fechaFin.addEventListener('change', calcularTotal);
        idHabitacion.addEventListener('change', calcularTotal);

        function calcularTotal() {
            const inicio = new Date(fechaInicio.value);
            const fin = new Date(fechaFin.value);
            const noches = (fin - inicio) / (1000 * 60 * 60 * 24);
            const precioNoche = idHabitacion.options[idHabitacion.selectedIndex]?.dataset.precio || 0;

            if (noches > 0 && precioNoche > 0) {
                const total = noches * parseFloat(precioNoche);
                totalAmount.textContent = total.toFixed(2);
                totalDiv.style.display = 'block';
            } else {
                totalDiv.style.display = 'none';
            }
        }

        // Validación adicional en submit
        document.getElementById('formReserva').addEventListener('submit', function(e) {
            if (fechaInicio.value >= fechaFin.value) {
                alert('La fecha de fin debe ser posterior a la de inicio.');
                e.preventDefault();
            }
            if (!/^\d{16}$/.test(document.getElementById('tarjeta').value.replace(/\s/g, ''))) {
                alert('Número de tarjeta debe tener exactamente 16 dígitos.');
                e.preventDefault();
            }
        });
    </script>
</body>
</html>