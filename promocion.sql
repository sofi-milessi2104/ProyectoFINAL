-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 30-09-2025 a las 21:53:43
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

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `promocion`
--
ALTER TABLE `promocion`
  ADD PRIMARY KEY (`id_promo`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `promocion`
--
ALTER TABLE `promocion`
  MODIFY `id_promo` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
