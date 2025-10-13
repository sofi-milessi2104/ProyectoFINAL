-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 13-10-2025 a las 20:15:34
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `hotel2`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `administrador`
--

CREATE TABLE `administrador` (
  `ci` int(11) NOT NULL,
  `nombre_completo` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `area` set('Recursos humanos','Administración','Gerencia') NOT NULL,
  `password` varchar(250) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `administrador`
--

INSERT INTO `administrador` (`ci`, `nombre_completo`, `email`, `area`, `password`) VALUES
(10123456, 'Laura Fernández', 'laura.fernandez@empresa.com', 'Recursos humanos', '$2y$10$uROVCguTKX84gvgm/hOlWeAY46hHWdNeze8bv8NfqUq8XvROIhJNS'),
(10234567, 'Carlos Gómez', 'carlos.gomez@empresa.com', 'Administración', '$2y$10$Rq0am3TcdtNlBG8kRni65ecHw08.kml.YyIRXSNKuNYu/SiZ15JIO'),
(10345678, 'Ana Torres', 'ana.torres@empresa.com', 'Gerencia', '$2y$10$gAzFGSbwNFAn0idd7zwTpecyi3NKdUAabMlinGS6bPph2Veihtdfa');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `habitacion`
--

CREATE TABLE `habitacion` (
  `id_hab` int(11) NOT NULL,
  `tipo_hab` set('Loft','River Loft','Suite','River Suite','Super Loft') NOT NULL,
  `descripcion_hab` varchar(400) NOT NULL,
  `disponible` tinyint(1) NOT NULL,
  `imagen` varchar(255) NOT NULL,
  `precio` varchar(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `habitacion`
--

INSERT INTO `habitacion` (`id_hab`, `tipo_hab`, `descripcion_hab`, `disponible`, `imagen`, `precio`) VALUES
(1, 'Suite', 'Esta es una espaciosa suite con una sala de estar separada que permite una cama adicional. Cuenta con un cómodo albornoz y zapatillas.', 8, 'Suite.jpeg', '3.438'),
(2, 'River Suite', 'Esta suite cuenta con baño privado, cocina, ventanales y una terraza con una espléndida vista al río, además de muebles de madera y cortinas de color beige. Hay un salón con sofá cama, TV LCD, reproductor de DVD, microondas, secador de pelo y conexión WIFI gratis.', 20, 'River Suite.jpeg', '6.849'),
(3, 'Loft', 'Este loft cuenta con baño privado, zona de cocina, ventanales y terraza, así como muebles de madera y cortinas de color beige. Hay TV LCD, reproductor de DVD, secador de pelo y conexión WiFi gratis. No se pueden acomodar camas supletorias.', 15, 'Loft.jpeg', '10.273'),
(4, 'River Loft', 'Este loft cuenta con baño privado, cocina, ventanales de techo a suelo y una terraza con una espléndida vista al río, además de muebles de madera y cortinas color beige. Hay TV LCD, reproductor de DVD, secador de pelo y conexión WiFi gratis. No se pueden acomodar camas supletorias.', 3, 'River Loft.jpeg', '13.755'),
(5, 'Super Loft', 'Esta suite cuenta con baño privado, zona de cocina y un balcón doble con una espléndida vista al río, así como muebles de madera y cortinas de color beige. Hay TV LCD, reproductor de DVD, microondas, secador de pelo y conexión WiFi gratuita. No se pueden acomodar camas supletorias.', 2, 'Super Loft.jpeg', '17.123');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `promocion`
--

CREATE TABLE `promocion` (
  `id_promo` int(11) NOT NULL,
  `tipo_promo` set('DaySpa','DayUse','Cupón','FamilyPlan','Media pensión','temporada') NOT NULL,
  `descripcion_promo` varchar(550) NOT NULL,
  `img_promo` varchar(255) NOT NULL,
  `precio_promo` varchar(24) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `promocion`
--

INSERT INTO `promocion` (`id_promo`, `tipo_promo`, `descripcion_promo`, `img_promo`, `precio_promo`) VALUES
(1, 'DaySpa', 'Experiencia de relajación sin hospedaje.\nIncluye acceso al spa (jacuzzi, sauna, piscina climatizada), masaje de 45 min, aromaterapia, música, infusiones detox, snacks saludables y áreas de descanso.', 'Spa.jpeg', '1790'),
(2, 'DayUse', 'Uso de habitación durante el día, sin pernocte.\nIdeal para descansar, trabajar o tener privacidad. Incluye Wi-Fi, aire acondicionado, TV, baño privado y servicios del hotel.', 'Comida.jpeg', '1359'),
(3, 'Cupón', 'Descuento exclusivo en servicios seleccionados (alojamiento, spa, dayuse, etc.).\nSe aplica presentando el cupón en la reserva o check-in.\nNo acumulable, válido por tiempo limitado y sujeto a disponibilidad.', '1.jpg', '799'),
(4, 'FamilyPlan', 'Alojamiento familiar con desayuno, acceso a áreas recreativas y beneficios para niños (alojamiento gratis para menores acompañados).\nIdeal para escapadas familiares con ahorro y diversión.\nVálido todos los días con reserva anticipada.', 'Super Loft 2.jpeg', '3500'),
(5, 'Media pensión', 'Incluye desayuno y cena en el restaurante del hotel.\nComodidad sin preocuparse por dónde comer.\nBebidas no incluidas (salvo aclaración).', 'River Suite.jpeg', '2700'),
(6, 'temporada', 'Beneficios y actividades especiales según la estación (verano, otoño, invierno, primavera).\nCada temporada ofrece experiencias únicas adaptadas al clima y al entorno.', 'Piscina al aire libre.jpeg', '1420');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `reserva`
--

CREATE TABLE `reserva` (
  `id_reserva` int(11) NOT NULL,
  `id_usuario` int(11) DEFAULT NULL,
  `adultos` set('1','2','3') NOT NULL,
  `niños` set('0','1','2') NOT NULL,
  `fecha_inicio` date NOT NULL,
  `fecha_fin` date NOT NULL,
  `id_habitacion` int(11) NOT NULL,
  `tarjeta` varchar(20) NOT NULL,
  `nombre_tarjeta` varchar(255) DEFAULT NULL,
  `vencimiento` varchar(10) DEFAULT NULL,
  `cvc` varchar(10) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `reserva`
--

INSERT INTO `reserva` (`id_reserva`, `id_usuario`, `adultos`, `niños`, `fecha_inicio`, `fecha_fin`, `id_habitacion`, `tarjeta`, `nombre_tarjeta`, `vencimiento`, `cvc`) VALUES
(1, 1, '1', '', '2025-08-01', '2025-08-03', 4, '2345678901234567', NULL, NULL, NULL),
(2, 2, '2', '2', '2025-09-05', '2025-09-10', 2, '3456789012345678', NULL, NULL, NULL),
(3, 3, '3', '1', '2025-07-20', '2025-07-25', 16, '4567890123456789', NULL, NULL, NULL),
(4, 4, '1', '', '2025-10-01', '2025-10-05', 8, '5678901234567890', NULL, NULL, NULL),
(5, 5, '1', '1', '2025-09-24', '2025-09-28', 3, '5658214723264198', NULL, NULL, NULL),
(6, 6, '3', '2', '2025-09-27', '2025-10-11', 5, '4565821398710265', NULL, NULL, NULL),
(7, 7, '2', '2', '2025-10-01', '2025-10-29', 4, '4569871236665781', NULL, NULL, NULL),
(8, 7, '1', '', '2025-10-01', '2025-10-29', 2, '5862493157862158', NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `reserva_servicio`
--

CREATE TABLE `reserva_servicio` (
  `id_reserva` int(11) NOT NULL,
  `id_servicio` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `servicio`
--

CREATE TABLE `servicio` (
  `id_servicio` int(11) NOT NULL,
  `tipo_servicio` set('Restaurante','Spa & Masajes','Gym','Sauna','Piscina interior','Piscina exterior','Estacionamiento') NOT NULL,
  `descripcion_servicio` varchar(400) NOT NULL,
  `imagen` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `servicio`
--

INSERT INTO `servicio` (`id_servicio`, `tipo_servicio`, `descripcion_servicio`, `imagen`) VALUES
(1, 'Restaurante', 'Restaurante y bar: platos tradicionales y locales con estilo gourmet. Con Room Service y desayuno buffet incluido en todas las tarifas.', 'Restaurante.jpeg'),
(2, 'Spa & Masajes', 'Sesión de spa completa con masajes relajantes (con cargo adicional).', 'Spa.jpeg'),
(3, 'Gym', 'Accede al gimnasio durante la estadía (con cargo adicional).', 'Gimnasio.jpeg'),
(4, 'Sauna', 'Sauna seca, ideal para relajación (con cargo adicional).', 'Sauna.jpeg'),
(5, 'Piscina interior', 'Piscina climatizada todo el año.', 'Piscina interior - cerrada.jpeg'),
(6, 'Piscina exterior', 'Piscina climatizada en verano con solárium y servicio de comida y bebida.', 'Piscina al aire libre.jpeg'),
(7, 'Estacionamiento', 'Estacionamiento descubierto gratuito y limitado.', 'Estacionamiento.jpg');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuario`
--

CREATE TABLE `usuario` (
  `id_usuario` int(11) NOT NULL,
  `nombre` varchar(50) NOT NULL,
  `apellido` varchar(50) NOT NULL,
  `email` text NOT NULL,
  `celular` varchar(20) NOT NULL,
  `password` varchar(250) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `usuario`
--

INSERT INTO `usuario` (`id_usuario`, `nombre`, `apellido`, `email`, `celular`, `password`) VALUES
(1, 'Mateo', 'Pérez', 'mateo.perez@example.com', '59892345678', '5678jaja'),
(2, 'Sofía', 'González', 'sofia.gonzalez@example.com', '59893456789', ''),
(3, 'Juan', 'Rodríguez', 'juan.rodriguez@example.com', '59894567890', ''),
(4, 'Valentina', 'Fernández', 'valentina.fernandez@example.com', '59895678901', ''),
(5, 'Pablo', 'Martinez', 'pablojaja@gmail.com', '45484746421598762', 'password_default'),
(6, 'Carla', 'Jolela', 'caluta@gmail.com', '565845126', 'password_default'),
(7, 'Patricia', 'Lola', 'particia@gmail.com', '459236847', 'password_default');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `administrador`
--
ALTER TABLE `administrador`
  ADD PRIMARY KEY (`ci`);

--
-- Indices de la tabla `habitacion`
--
ALTER TABLE `habitacion`
  ADD PRIMARY KEY (`id_hab`);

--
-- Indices de la tabla `promocion`
--
ALTER TABLE `promocion`
  ADD PRIMARY KEY (`id_promo`);

--
-- Indices de la tabla `reserva`
--
ALTER TABLE `reserva`
  ADD PRIMARY KEY (`id_reserva`),
  ADD KEY `fk_reserva_usuario` (`id_usuario`);

--
-- Indices de la tabla `reserva_servicio`
--
ALTER TABLE `reserva_servicio`
  ADD PRIMARY KEY (`id_reserva`,`id_servicio`),
  ADD KEY `id_servicio` (`id_servicio`);

--
-- Indices de la tabla `servicio`
--
ALTER TABLE `servicio`
  ADD PRIMARY KEY (`id_servicio`);

--
-- Indices de la tabla `usuario`
--
ALTER TABLE `usuario`
  ADD PRIMARY KEY (`id_usuario`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `administrador`
--
ALTER TABLE `administrador`
  MODIFY `ci` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10345679;

--
-- AUTO_INCREMENT de la tabla `habitacion`
--
ALTER TABLE `habitacion`
  MODIFY `id_hab` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `promocion`
--
ALTER TABLE `promocion`
  MODIFY `id_promo` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT de la tabla `reserva`
--
ALTER TABLE `reserva`
  MODIFY `id_reserva` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT de la tabla `servicio`
--
ALTER TABLE `servicio`
  MODIFY `id_servicio` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT de la tabla `usuario`
--
ALTER TABLE `usuario`
  MODIFY `id_usuario` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `reserva`
--
ALTER TABLE `reserva`
  ADD CONSTRAINT `fk_reserva_usuario` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id_usuario`);

--
-- Filtros para la tabla `reserva_servicio`
--
ALTER TABLE `reserva_servicio`
  ADD CONSTRAINT `reserva_servicio_ibfk_1` FOREIGN KEY (`id_reserva`) REFERENCES `reserva` (`id_reserva`),
  ADD CONSTRAINT `reserva_servicio_ibfk_2` FOREIGN KEY (`id_servicio`) REFERENCES `servicio` (`id_servicio`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
