-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 30-09-2025 a las 21:53:02
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
(4, 'Valentina', 'Suarez', 'valentina.fernandez@example.com', '59895678901', ''),
(5, 'Maria', 'Mendendez', 'mari21@example.com', '0987452354', '$2y$10$2GxprrcQVo7/3suf0rqAgurDmIkW2BjdXwB1dAl7CyVz/BX64a93m'),
(6, 'Valentina', 'Fernández', 'valentina.fernandez@example.com', '59895678901', '$2y$10$OHCvAvTEUJ/dkjXeU1eYNeizzjhYWRS226xQE7HcX.gN0KadTDHfm'),
(7, 'lupita', 'gonzales', 'lupita@gmail.com', '099586420', '$2y$10$SUFnKyN/QRh7QtYouO6PGO2Ng.HwGDed1hr5cSdPXDk0UNAQ9reRu'),
(8, 'Sofia', 'milessi', 'sofimilessi04@gmail.com', '789451235', '$2y$10$B8PPTLTWU641yCSRqaBYMOkT/ssaQNpb3Apbt/IKDyCn.KFyq68Zi'),
(14, 'laura', 'lopez', 'laura@gmail.com', '0998564', '$2y$10$6jXK8rPPCFJUYClcXBu4EOaamO.Vtn2ToJBLSyyJR/kkp9EucDpEC'),
(15, 'Lucia', 'Fernandez', 'luxbur1606@example.com', '09478526', '$2y$10$fy.FUCSt1nV3if4J97d92eMGFh5w2En0GvN6onPW7d.nWwPyVwqjW');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `usuario`
--
ALTER TABLE `usuario`
  ADD PRIMARY KEY (`id_usuario`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `usuario`
--
ALTER TABLE `usuario`
  MODIFY `id_usuario` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
