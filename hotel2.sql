-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 28-07-2025 a las 23:44:42
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
(10123456, 'Laura Fernández', 'laura.fernandez@empresa.com', 'Recursos humanos', ''),
(10234567, 'Carlos Gómez', 'carlos.gomez@empresa.com', 'Administración', ''),
(10345678, 'Ana Torres', 'ana.torres@empresa.com', 'Gerencia', '');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `habitacion`
--

CREATE TABLE `habitacion` (
  `id_hab` int(11) NOT NULL,
  `tipo_hab` set('Loft','River Loft','Suit','River Suit','Suit Loft') NOT NULL,
  `descripcion_hab` varchar(400) NOT NULL,
  `disponible` tinyint(1) NOT NULL,
  `imagen` varchar(255) NOT NULL,
  `precio` varchar(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `habitacion`
--

INSERT INTO `habitacion` (`id_hab`, `tipo_hab`, `descripcion_hab`, `disponible`, `imagen`, `precio`) VALUES
(1, 'Suit', 'Esta es una espaciosa suite con una sala de estar separada que permite una cama adicional. Cuenta con un cómodo albornoz y zapatillas.', 3, 'Suite.jpeg', '3.438'),
(2, 'River Suit', 'Esta suite cuenta con baño privado, cocina, ventanales y una terraza con una espléndida vista al río, además de muebles de madera y cortinas de color beige. Hay un salón con sofá cama, TV LCD, reproductor de DVD, microondas, secador de pelo y conexión WIFI gratis.', 1, 'River Suite.jpeg', '6.849'),
(3, 'Loft', 'Este loft cuenta con baño privado, zona de cocina, ventanales y terraza, así como muebles de madera y cortinas de color beige. Hay TV LCD, reproductor de DVD, secador de pelo y conexión WiFi gratis. No se pueden acomodar camas supletorias.', 1, 'Loft.jpeg', '10.273'),
(4, 'River Loft', 'Este loft cuenta con baño privado, cocina, ventanales de techo a suelo y una terraza con una espléndida vista al río, además de muebles de madera y cortinas color beige. Hay TV LCD, reproductor de DVD, secador de pelo y conexión WiFi gratis. No se pueden acomodar camas supletorias.', 1, 'River Loft.jpeg', '13.755'),
(5, 'Suit Loft', 'Esta suite cuenta con baño privado, zona de cocina y un balcón doble con una espléndida vista al río, así como muebles de madera y cortinas de color beige. Hay TV LCD, reproductor de DVD, microondas, secador de pelo y conexión WiFi gratuita. No se pueden acomodar camas supletorias.', 1, 'Super Loft.jpeg', '17.123');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `promocion`
--

CREATE TABLE `promocion` (
  `id_promo` int(11) NOT NULL,
  `tipo_promo` set('DaySpa','DayUse','Cupón','FamilyPlan','Media pensión','temporada') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `promocion`
--

INSERT INTO `promocion` (`id_promo`, `tipo_promo`) VALUES
(1, 'DaySpa'),
(2, 'DayUse'),
(3, 'Cupón'),
(4, 'FamilyPlan'),
(5, 'Media pensión'),
(6, 'temporada');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `reserva`
--

CREATE TABLE `reserva` (
  `id_reserva` int(11) NOT NULL,
  `id_usuario` int(11) DEFAULT NULL,
  `adultos` set('1','2','3') NOT NULL,
  `niños` set('1','2') NOT NULL,
  `fecha_inicio` date NOT NULL,
  `fecha_fin` date NOT NULL,
  `id_habitacion` int(11) NOT NULL,
  `id_servicio` int(11) NOT NULL,
  `tarjeta` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `reserva`
--

INSERT INTO `reserva` (`id_reserva`, `id_usuario`, `adultos`, `niños`, `fecha_inicio`, `fecha_fin`, `id_habitacion`, `id_servicio`, `tarjeta`) VALUES
(1, 1, '1', '', '2025-08-01', '2025-08-03', 4, 5, '2345678901234567'),
(2, 2, '2', '2', '2025-09-05', '2025-09-10', 2, 96, '3456789012345678'),
(3, 3, '3', '1', '2025-07-20', '2025-07-25', 16, 3, '4567890123456789'),
(4, 4, '1', '', '2025-10-01', '2025-10-05', 8, 20, '5678901234567890');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `servicio`
--

CREATE TABLE `servicio` (
  `id_servicio` int(11) NOT NULL,
  `tipo_servicio` set('Restaurante','Spa & Masajes','Gym','Sauna','Piscina interior','Piscina exterior','Estacionamiento') NOT NULL,
  `precio` int(6) NOT NULL,
  `descripcion_servicio` varchar(400) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `servicio`
--

INSERT INTO `servicio` (`id_servicio`, `tipo_servicio`, `precio`, `descripcion_servicio`) VALUES
(1, 'Restaurante', 25000, 'Servicio de restaurante con menú a la carta y desayuno buffet incluido.'),
(2, 'Spa & Masajes', 40000, 'Sesión de spa completa con masajes relajantes y aromaterapia.'),
(3, 'Gym', 15000, 'Acceso ilimitado al gimnasio totalmente equipado durante la estadía.'),
(4, 'Sauna', 12000, 'Uso de sauna seca y húmeda, ideal para relajación.'),
(5, 'Piscina interior', 20000, 'Piscina climatizada abierta todo el año con zona de relajación.'),
(6, 'Piscina exterior', 18000, 'Piscina al aire libre con servicio de bar y camastros.'),
(7, 'Estacionamiento', 10000, 'Estacionamiento privado con vigilancia las 24 horas.');

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
(1, 'Mateo', 'Pérez', 'mateo.perez@example.com', '59892345678', ''),
(2, 'Sofía', 'González', 'sofia.gonzalez@example.com', '59893456789', ''),
(3, 'Juan', 'Rodríguez', 'juan.rodriguez@example.com', '59894567890', ''),
(4, 'Valentina', 'Fernández', 'valentina.fernandez@example.com', '59895678901', '');

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
  MODIFY `id_reserva` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `servicio`
--
ALTER TABLE `servicio`
  MODIFY `id_servicio` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT de la tabla `usuario`
--
ALTER TABLE `usuario`
  MODIFY `id_usuario` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `reserva`
--
ALTER TABLE `reserva`
  ADD CONSTRAINT `fk_reserva_usuario` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id_usuario`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
