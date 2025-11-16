-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 16-11-2025 a las 02:02:57
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
  `tipo_hab` varchar(255) NOT NULL,
  `descripcion_hab` varchar(400) NOT NULL,
  `disponible` tinyint(1) NOT NULL,
  `imagen` varchar(255) NOT NULL,
  `precio` varchar(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `habitacion`
--

INSERT INTO `habitacion` (`id_hab`, `tipo_hab`, `descripcion_hab`, `disponible`, `imagen`, `precio`) VALUES
(1, 'Suite', 'Esta es una espaciosa suite con una sala de estar separada que permite una cama adicional. Cuenta con un cómodo albornoz y zapatillas.', 8, 'http://localhost/ProyectoFinal/Fronted/img/Suite.jpeg', '3.438'),
(2, 'River Suite', 'Esta suite cuenta con baño privado, cocina, ventanales y una terraza con una espléndida vista al río, además de muebles de madera y cortinas de color beige. Hay un salón con sofá cama, TV LCD, reproductor de DVD, microondas, secador de pelo y conexión WIFI gratis.', 20, 'http://localhost/ProyectoFinal/Fronted/img/River%20Suite.jpeg', '6.849'),
(3, 'Loft', 'Este loft cuenta con baño privado, zona de cocina, ventanales y terraza, así como muebles de madera y cortinas de color beige. Hay TV LCD, reproductor de DVD, secador de pelo y conexión WiFi gratis. No se pueden acomodar camas supletorias.', 15, 'http://localhost/ProyectoFinal/Fronted/img/Loft.jpeg', '10.273'),
(4, 'River Loft', 'Este loft cuenta con baño privado, cocina, ventanales de techo a suelo y una terraza con una espléndida vista al río, además de muebles de madera y cortinas color beige. Hay TV LCD, reproductor de DVD, secador de pelo y conexión WiFi gratis. No se pueden acomodar camas supletorias.', 3, 'http://localhost/ProyectoFinal/Fronted/img/River%20Loft.jpeg', '13.755'),
(5, 'Super Loft', 'Esta suite cuenta con baño privado, zona de cocina y un balcón doble con una espléndida vista al río, así como muebles de madera y cortinas de color beige. Hay TV LCD, reproductor de DVD, microondas, secador de pelo y conexión WiFi gratuita. No se pueden acomodar camas supletorias.', 2, 'http://localhost/ProyectoFinal/Fronted/img/Super%20Loft.jpeg', '17.123');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `promocion`
--

CREATE TABLE `promocion` (
  `id_promo` int(11) NOT NULL,
  `tipo_promo` varchar(255) NOT NULL,
  `descripcion_promo` varchar(550) NOT NULL,
  `img_promo` varchar(255) NOT NULL,
  `precio_promo` varchar(24) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `promocion`
--

INSERT INTO `promocion` (`id_promo`, `tipo_promo`, `descripcion_promo`, `img_promo`, `precio_promo`) VALUES
(1, 'DaySpa', 'Experiencia de relajación sin hospedaje. Incluye acceso al spa (jacuzzi, sauna, piscina climatizada), masaje de 45 min, aromaterapia, música, infusiones detox, snacks saludables y áreas de descanso.', 'http://localhost/ProyectoFinal/Fronted/img/Spa.jpeg', '1790'),
(2, 'DayUse', 'Uso de habitación durante el día, sin pernocte. Ideal para descansar, trabajar o tener privacidad. Incluye Wi-Fi, aire acondicionado, TV, baño privado y servicios del hotel.', 'http://localhost/ProyectoFinal/Fronted/img/Comida.jpeg', '1359'),
(3, 'Cupón', 'Descuento exclusivo en servicios seleccionados (alojamiento, spa, dayuse, etc.). Se aplica presentando el cupón en la reserva o check-in. No acumulable, válido por tiempo limitado y sujeto a disponibilidad.', 'http://localhost/ProyectoFinal/Fronted/img/1.jpg', '799'),
(4, 'FamilyPlan', 'Alojamiento familiar con desayuno, acceso a áreas recreativas y beneficios para niños (alojamiento gratis para menores acompañados). Ideal para escapadas familiares con ahorro y diversión. Válido todos los días con reserva anticipada.', 'http://localhost/ProyectoFinal/Fronted/img/Super%20Loft%202.jpeg', '3500'),
(5, 'Media pensión', 'Incluye desayuno y cena en el restaurante del hotel. Comodidad sin preocuparse por dónde comer. Bebidas no incluidas (salvo aclaración).', 'http://localhost/ProyectoFinal/Fronted/img/River%20Suite%202.jpeg', '2700'),
(6, 'Temporada', 'Beneficios y actividades especiales según la estación (verano, otoño, invierno, primavera). Cada temporada ofrece experiencias únicas adaptadas al clima y al entorno.', 'http://localhost/ProyectoFinal/Fronted/img/Piscina%20al%20aire%20libre.jpeg', '1420');

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
  `tarjeta` varbinary(255) NOT NULL,
  `nombre_tarjeta` varchar(255) DEFAULT NULL,
  `vencimiento` varchar(10) DEFAULT NULL,
  `cvc` varchar(10) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `reserva`
--

INSERT INTO `reserva` (`id_reserva`, `id_usuario`, `adultos`, `niños`, `fecha_inicio`, `fecha_fin`, `id_habitacion`, `tarjeta`, `nombre_tarjeta`, `vencimiento`, `cvc`) VALUES
(1, 1, '1', '', '2025-08-01', '2025-08-03', 4, 0xd0ed0950d4d5f75002f21c7efd0639c35737bf296f593e0a068a05a3f98e22cb, NULL, NULL, NULL),
(2, 2, '2', '2', '2025-09-05', '2025-09-10', 2, 0x954e94d2fe9709168ea9e6606df3e48f5737bf296f593e0a068a05a3f98e22cb, NULL, NULL, NULL),
(5, 5, '1', '1', '2025-09-24', '2025-09-28', 3, 0x24682864702d4bce5ef75a58000668cb5737bf296f593e0a068a05a3f98e22cb, NULL, NULL, NULL),
(6, 6, '3', '2', '2025-09-27', '2025-10-11', 5, 0xcbfb8ea2f6a90ccabc5a766601fcc0f35737bf296f593e0a068a05a3f98e22cb, NULL, NULL, NULL),
(7, 7, '2', '2', '2025-10-01', '2025-10-29', 4, 0x6e654df07bc61bf3ecfd21c41d3fee3e5737bf296f593e0a068a05a3f98e22cb, NULL, NULL, NULL),
(8, 7, '1', '', '2025-10-01', '2025-10-29', 2, 0x620811d20f43fc16049854fafc9ca30c5737bf296f593e0a068a05a3f98e22cb, NULL, NULL, NULL),
(9, NULL, '1', '0', '2025-10-13', '2025-10-19', 1, 0xc448b99bc803eac2740fa5073f20d9495737bf296f593e0a068a05a3f98e22cb, 'Patricia lara', '02/12', '569'),
(10, NULL, '1', '0', '2025-10-13', '2025-10-19', 1, 0x769dfbc286a017df558f87639d163c635737bf296f593e0a068a05a3f98e22cb, 'Patricia lara', '02/12', '869'),
(11, NULL, '1', '0', '2025-10-13', '2025-10-19', 1, 0x8971fa7bace1cc49860b752ea21c2cbe5737bf296f593e0a068a05a3f98e22cb, 'Patricia lara', '02/12', '568'),
(12, NULL, '1', '0', '2025-10-13', '2025-10-19', 1, 0x66c737ea61839de74e07215c7661cea35737bf296f593e0a068a05a3f98e22cb, 'Patricia lara', '02/12', '457'),
(13, NULL, '1', '2', '2025-10-21', '2025-11-01', 1, 0xc448b99bc803eac2740fa5073f20d9495737bf296f593e0a068a05a3f98e22cb, 'Clara sofia', '03/15', '741'),
(14, NULL, '3', '2', '2025-10-22', '2025-10-29', 1, 0x4c24fa73dbd55b6012df862ae449b7595737bf296f593e0a068a05a3f98e22cb, 'Pablo Martinm', '11/16', '742'),
(15, NULL, '2', '1', '2025-10-30', '2025-11-06', 5, 0xf2bdaf25cf0265fd7fee6039186fdf285737bf296f593e0a068a05a3f98e22cb, 'Sofia Milessi', '01/31', '475'),
(16, NULL, '1', '1', '2025-10-31', '2025-11-09', 1, 0x4a8420c4fcfd6691062e3a7bba7fb4d35737bf296f593e0a068a05a3f98e22cb, 'Pamela Antonia', '06/25', '486'),
(17, NULL, '1', '0', '2025-10-13', '2025-10-31', 1, 0xbb0fe7e27a74ece3d6bc739123b99c275737bf296f593e0a068a05a3f98e22cb, 'Sandra Palacios', '12/25', '693'),
(18, NULL, '3', '2', '2025-10-13', '2025-10-19', 2, 0x7280117aea19cd53394f48b75e6c1b505737bf296f593e0a068a05a3f98e22cb, 'Joel Caras', '12/24', '586'),
(19, NULL, '1', '0', '2025-10-16', '2025-10-26', 1, 0xa478f73f8396997a5b3bda8c11ee26365737bf296f593e0a068a05a3f98e22cb, 'Jane Die', '12/26', '586'),
(20, NULL, '1', '0', '2025-10-16', '2025-10-30', 1, 0x66c737ea61839de74e07215c7661cea35737bf296f593e0a068a05a3f98e22cb, 'Joel Juares', '12/28', '475'),
(21, NULL, '1', '2', '2025-10-31', '2025-11-01', 5, 0x15259d416a8a0187380c1e94ad0425355737bf296f593e0a068a05a3f98e22cb, 'Lara Nara', '12/26', '896'),
(22, NULL, '1', '1', '2025-11-04', '2025-11-14', 2, 0x66c737ea61839de74e07215c7661cea35737bf296f593e0a068a05a3f98e22cb, 'Manuela Rios', '12/26', '458'),
(23, NULL, '3', '2', '2025-11-06', '2025-11-09', 2, 0x31323334353637383930313233343536, 'Zoe Dalas', '12/26', '158'),
(24, NULL, '3', '2', '2025-11-28', '2025-12-07', 3, 0x7f05551cc382543f84aa9fc7a7d1b87789c2e2f6851dab182df5dbbb0a899cbb, 'Marcela Suarez', '12/26', '478'),
(25, NULL, '2', '2', '2025-11-06', '2025-11-30', 4, 0xe26ec19f1d92a27cf112e014b9084b4489c2e2f6851dab182df5dbbb0a899cbb, 'Sol Martinez', '05/27', '369'),
(26, NULL, '1', '0', '2025-11-06', '2025-11-09', 5, 0x8c94563351d83a03eabc432fc9f25aa889c2e2f6851dab182df5dbbb0a899cbb, 'Patricia Solena', '12/26', '158'),
(27, NULL, '1', '0', '2025-11-06', '2025-11-09', 5, 0x3e63e65be32fb14df05de7798fe6407b89c2e2f6851dab182df5dbbb0a899cbb, 'Sofia Suarez', '01/29', '024'),
(28, NULL, '2', '1', '2025-11-06', '2025-11-09', 2, 0xb990940c2efebb4a65900aa5b66525b889c2e2f6851dab182df5dbbb0a899cbb, 'Rene Ternis', '10/35', '475'),
(29, NULL, '1', '2', '2025-11-06', '2025-11-09', 3, 0x49d61341421a22f0f2853829365247ef89c2e2f6851dab182df5dbbb0a899cbb, 'Henrique Lunde', '04/26', '548'),
(30, NULL, '1', '1', '2025-11-06', '2025-11-09', 2, 0x8b77932b85b4e0352a73e04fe07fe55989c2e2f6851dab182df5dbbb0a899cbb, 'LAura MArtinez', '12/26', '458'),
(31, NULL, '1', '2', '2025-11-06', '2025-11-09', 1, 0x8b77932b85b4e0352a73e04fe07fe55989c2e2f6851dab182df5dbbb0a899cbb, 'Olga Orlandi', '04/28', '029'),
(32, NULL, '1', '0', '2025-11-06', '2025-11-29', 2, 0x8b77932b85b4e0352a73e04fe07fe55989c2e2f6851dab182df5dbbb0a899cbb, 'Karen Keri', '12/26', '147'),
(33, NULL, '1', '2', '2025-11-07', '2025-11-09', 2, 0x8b77932b85b4e0352a73e04fe07fe55989c2e2f6851dab182df5dbbb0a899cbb, 'Sol Marel', '12/29', '358'),
(34, NULL, '3', '1', '2025-11-07', '2025-11-23', 1, 0x3d2aba47f02a4ded5260b0b981db778189c2e2f6851dab182df5dbbb0a899cbb, 'Laura Suarez', '12/26', '386'),
(35, NULL, '1', '1', '2025-11-10', '2025-11-16', 2, 0x8b77932b85b4e0352a73e04fe07fe55989c2e2f6851dab182df5dbbb0a899cbb, 'Lena Litos', '11/29', '753'),
(36, NULL, '2', '2', '2025-11-10', '2025-11-16', 2, 0x8b77932b85b4e0352a73e04fe07fe55989c2e2f6851dab182df5dbbb0a899cbb, 'Pampita Suarez', '03/48', '963'),
(37, NULL, '1', '1', '2025-11-10', '2025-11-11', 2, 0x8b77932b85b4e0352a73e04fe07fe55989c2e2f6851dab182df5dbbb0a899cbb, 'Sabrina Sanchez', '12/29', '458'),
(38, NULL, '3', '2', '2025-11-10', '2025-11-16', 3, 0x31323334353637383930313233343536, 'Juan Pablo', '12/29', '125'),
(39, NULL, '3', '2', '2025-11-11', '2025-11-16', 1, 0x31323334353637383930313233343536, 'Lily Cooke', '07/29', '596'),
(40, NULL, '1', '1', '2025-11-13', '2025-11-16', 2, 0x5373704675624643774d6b466934754b5263634c776d52456447396b596d3932564556514e44685a656e42784f47647651315a49565452734d555a335a576734554856574e7a46595a47553562546739, 'Pamela Palito', '12/58', '145'),
(41, NULL, '1', '1', '2025-11-13', '2025-11-16', 4, 0x33755050526579775555343365385555506f676f6a6b52336557746153697458556b746d62466835536d39545a6b4d72525845784d6d6c5057557836644842524d335258526a6c4b6454684864453039, 'Lana Morena', '12/28', '259'),
(42, NULL, '1', '1', '2025-11-13', '2025-11-29', 3, 0x722b523570336e5a74676347716d6e386b4a5a792b5855775445706d4b7a686a65566c4d566b597654316732596e427665557042616c70765154523653456436516d39744e475a474e446c6162556b39, 'Juan Perez', '11/27', '486'),
(43, NULL, '1', '2', '2025-11-13', '2025-11-16', 3, 0x2b6d6d4775554d4a6b4b7a6f3977726158463135705555795244425461456b3164446455636c464b65544e6d6257785257556b32616e644352336c46646c49724f475a6a516e704f5547777957577339, 'Manu Vico', '09/26', '953'),
(44, NULL, '3', '2', '2025-11-13', '2025-11-29', 3, 0x54616f61512b4d555a7135797047546b3077396b656e56504d6c525655584d30624646746547784d645468726247705356456c744e6c4e59526b3169524641794d6d747a6433687a59555178637a4139, 'Lily Cooke', '12/29', '268'),
(45, NULL, '3', '2', '2025-11-13', '2025-11-29', 3, 0x64334f6f5258467032534f37575a5061364d696164444a33646d4535527974354d6b784e626e59354c316f76543163324d446c795a4531575245527665475a5a616e52694f574e6c636d683557566b39, 'Lily Cooke', '03/28', '594'),
(49, 25, '1', '0', '2025-11-14', '2025-11-29', 5, 0x584c343971506f4739374e365475757438586d74536b6b32516d5532516e42765958465755585a31546e706f595868324d30316f646d64344c3156495a6c706961555a78656e6c6b4e5778595a336339, 'Lily Cooke', '05/29', '189');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `reserva_servicio`
--

CREATE TABLE `reserva_servicio` (
  `id_reserva` int(11) NOT NULL,
  `id_servicio` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `reserva_servicio`
--

INSERT INTO `reserva_servicio` (`id_reserva`, `id_servicio`) VALUES
(9, 5),
(10, 6),
(11, 2),
(12, 2),
(12, 5),
(12, 7),
(13, 2),
(14, 2),
(14, 5),
(14, 7),
(15, 1),
(15, 2),
(15, 4),
(16, 2),
(16, 5),
(17, 2),
(18, 1),
(18, 2),
(18, 5),
(19, 1),
(19, 4),
(20, 3),
(20, 5),
(21, 2),
(21, 5),
(22, 2),
(22, 6),
(23, 2),
(23, 6),
(24, 1),
(24, 2),
(26, 1),
(26, 2),
(26, 3),
(27, 2),
(27, 3),
(28, 1),
(28, 2),
(28, 3),
(29, 2),
(29, 6),
(30, 2),
(30, 6),
(31, 2),
(31, 6),
(32, 2),
(33, 2),
(33, 6),
(34, 3),
(34, 6),
(35, 2),
(35, 6),
(36, 2),
(36, 6),
(37, 2),
(37, 7),
(38, 3),
(38, 7),
(39, 2),
(39, 7),
(40, 1),
(40, 2),
(40, 3),
(40, 5),
(41, 2),
(41, 6),
(41, 7),
(42, 3),
(42, 4),
(42, 7),
(43, 2),
(43, 3),
(43, 7),
(44, 3),
(44, 4),
(44, 7),
(45, 1),
(45, 2),
(45, 5),
(45, 6),
(49, 1),
(49, 2),
(49, 3),
(49, 4);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `servicio`
--

CREATE TABLE `servicio` (
  `id_servicio` int(11) NOT NULL,
  `tipo_servicio` varchar(255) NOT NULL,
  `descripcion_servicio` varchar(400) NOT NULL,
  `imagen` varchar(255) NOT NULL,
  `id_promo` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `servicio`
--

INSERT INTO `servicio` (`id_servicio`, `tipo_servicio`, `descripcion_servicio`, `imagen`, `id_promo`) VALUES
(1, 'Restaurante', 'Restaurante y bar: platos tradicionales y locales con estilo gourmet. Con Room Service y desayuno buffet incluido en todas las tarifas.', 'http://localhost/ProyectoFinal/Fronted/img/Restaurante.jpeg', 4),
(2, 'Spa & Masajes', 'Sesión de spa completa con masajes relajantes (con cargo adicional).', 'http://localhost/ProyectoFinal/Fronted/img/Spa.jpeg', 2),
(3, 'Gym', 'Accede al gimnasio durante la estadía (con cargo adicional).', 'http://localhost/ProyectoFinal/Fronted/img/Gimnasio.jpeg', 5),
(4, 'Sauna', 'Sauna seca, ideal para relajación (con cargo adicional).', 'http://localhost/ProyectoFinal/Fronted/img/Sauna.jpeg', 1),
(5, 'Piscina interior', 'Piscina climatizada todo el año.', 'http://localhost/ProyectoFinal/Fronted/img/Piscina%20interior%20-%20cerrada.jpeg', 3),
(6, 'Piscina exterior', 'Piscina climatizada en verano con solárium y servicio de comida y bebida.', 'http://localhost/ProyectoFinal/Fronted/img/Piscina%20al%20aire%20libre.jpeg', 6),
(7, 'Estacionamiento', 'Estacionamiento descubierto gratuito y limitado.', 'http://localhost/ProyectoFinal/Fronted/img/Estacionamiento.jpg', 4);

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
  `password` varchar(250) NOT NULL,
  `id_ci` int(9) NOT NULL,
  `verification_token` varchar(255) DEFAULT NULL,
  `token_expiry` datetime DEFAULT NULL,
  `is_verified` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `usuario`
--

INSERT INTO `usuario` (`id_usuario`, `nombre`, `apellido`, `email`, `celular`, `password`, `id_ci`, `verification_token`, `token_expiry`, `is_verified`) VALUES
(1, 'Mateo', 'Pérez', 'mateo.perez@example.com', '59892345678', '5678jaja', 10123456, NULL, NULL, 0),
(2, 'Sofía', 'González', 'sofia.gonzalez@example.com', '59893456789', '', 10123456, NULL, NULL, 0),
(3, 'Juan', 'Rodríguez', 'juan.rodriguez@example.com', '59894567890', '', 10123456, NULL, NULL, 0),
(4, 'Valentina', 'Fernández', 'valentina.fernandez@example.com', '59895678901', '', 10123456, NULL, NULL, 0),
(5, 'Pablo', 'Martinez', 'pablojaja@gmail.com', '45484746421598762', 'password_default', 10123456, NULL, NULL, 0),
(6, 'Carla', 'Jolela', 'caluta@gmail.com', '565845126', 'password_default', 10123456, NULL, NULL, 0),
(7, 'Patricia', 'Lola', 'particia@gmail.com', '459236847', 'password_default', 10123456, NULL, NULL, 0),
(8, 'Sofia', 'milessi', 'sofimilessi04@gmail.com', '789451235', '$2y$10$B8PPTLTWU641yCSRqaBYMOkT/ssaQNpb3Apbt/IKDyCn.KFyq68Zi', 10123456, NULL, NULL, 0),
(9, 'laura', 'lopez', 'laura@gmail.com', '0998564', '$2y$10$6jXK8rPPCFJUYClcXBu4EOaamO.Vtn2ToJBLSyyJR/kkp9EucDpEC', 10123456, NULL, NULL, 0),
(10, 'Lucia', 'Fernandez', 'luxbur1606@example.com', '09478526', '$2y$10$fy.FUCSt1nV3if4J97d92eMGFh5w2En0GvN6onPW7d.nWwPyVwqjW', 10123456, NULL, NULL, 0),
(11, 'Manuela', 'Deditos', 'manu584@gmail.com', '258369014', '$2y$10$jv2v.RD6vdhYHnYIXVWX6ujmw/Hs6ssp4Csz8ttFRIY3CWEamrNUe', 10123456, NULL, NULL, 0),
(12, 'kiss', 'me', 'kissmemore@gmali.com', '2589775', '$2y$10$x/UNkp/CfCtAveWi0gPQWuC6.OOt5DES60/H9CC1hgOeXXW/fqXUW', 10123456, NULL, NULL, 0),
(13, 'lucia', 'bur', 'lucia21@gmail.com', '0321568', '$2y$10$Tx7PWBcqhl2HkQomiZAL3esxtkQKbKnULCFsFhbVKFXoKclGTzyzq', 10123456, NULL, NULL, 0),
(14, 'Manuela', 'Arias', 'manuela@gmail.com', '258369147', '$2y$10$UXY1r6U4UtWYPUYTCbh6wOmB4mStwS6LWGKbtNKqjX/EJj9EONs5O', 10123456, NULL, NULL, 0),
(15, 'sofia', 'milessi', 'sofia.milessi2008@gmail.com', '0987456', '$2y$10$w5RjSmi5mtw2JcBGYewxQucIOX3HYfxNyjceEYPt/2onOdArskQVW', 10123456, '2672df5ec434b10d63b4727984dd24c5', '2025-11-05 21:14:33', 0),
(16, 'manuela', 'ramona', 'sofia.milessi2008@gmail.com', '0658944', '$2y$10$gBO4XQIRnGPqtrmO9wrR4uKnchSIFnfyn4p3oG6OikTgyQgCni9NO', 10123456, '6b7085a198dba797c612ed30708703c6', '2025-11-05 21:16:57', 0),
(25, 'Lily', 'Cooke', 'luxbur1606@gmail.com', '012345678', '$2y$10$GgAqHe1tqdp4H2xVTxRwEuBx0Te7bIAJiGHJe0Bj.Zvwe0NR1hjsa', 0, '845c97ec2794c08fe93e6c60c39a4a43', '2025-11-12 17:53:40', 0),
(26, 'Lily', 'Cooke', 'luxbur1606@gmail.com', '012345678', '$2y$10$Vsk.Qb.FbLFvrcyjUSiODuNWdxC.ZKZU8e37ftk8A52MBoRXEgCFi', 0, 'ce5d750d8d326dc7a457836b6f03cfeb', '2025-11-12 17:54:08', 0),
(27, 'Lily', 'Cooke', 'luxbur1606@gmail.com', '012345678', '$2y$10$hEQCez5GYDJjuwptPHdZ.e4iFQl/gTE3S9J8bZYd/aY9bt/vgA9j2', 0, 'e9bb7892d990136f39303f3d69c36737', '2025-11-12 18:02:36', 0),
(28, 'Lily', 'Cooke', 'luxbur1606@gmail.com', '012345678', '$2y$10$RoJ4vYBfI1ymvBK0FxGvkO8aQpOxK4xGQ2Aytnkvv2e8hrTzv5PTu', 0, 'f992158a272873a636992f204494f47b', '2025-11-12 18:09:03', 0),
(29, 'Lily', 'Cooke', 'luxbur1606@gmail.com', '012345678', '$2y$10$fUcuTyNuBO0NYlelRVxQbulxxo2ZAQQ6DrEPGNo.qdtSjc9r2yalK', 0, 'cadc26171a769a68b5ff8c5dbf1f0094', '2025-11-12 18:10:20', 0),
(30, 'Lily', 'Cooke', 'luxbur1606@gmail.com', '012345678', '$2y$10$Kb.Zx.HgbPuTQPOKRiuk9O.tZxjkSsf2n/lFkDwYyO.A/eILsFkOa', 0, '82a35a3825fbd7e64118a8c69fef8665', '2025-11-12 18:17:55', 0),
(31, 'Lily', 'Cooke', 'luxbur1606@gmail.com', '012345678', '$2y$10$Np0S7SFV3mutdVIO3yCsJ.YjhkxQjLpTM2hAJhyQD7Kibr58qcA1W', 0, '465278962fc100bd660561e455d957fe', '2025-11-12 18:18:13', 0);

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
  ADD KEY `fk_reserva_usuario` (`id_usuario`),
  ADD KEY `fk_reserva_hab` (`id_habitacion`);

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
  ADD PRIMARY KEY (`id_servicio`),
  ADD KEY `servicioPromo` (`id_promo`);

--
-- Indices de la tabla `usuario`
--
ALTER TABLE `usuario`
  ADD PRIMARY KEY (`id_usuario`),
  ADD KEY `adminUsuario` (`id_ci`);

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
  MODIFY `id_hab` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT de la tabla `promocion`
--
ALTER TABLE `promocion`
  MODIFY `id_promo` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT de la tabla `reserva`
--
ALTER TABLE `reserva`
  MODIFY `id_reserva` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=51;

--
-- AUTO_INCREMENT de la tabla `servicio`
--
ALTER TABLE `servicio`
  MODIFY `id_servicio` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT de la tabla `usuario`
--
ALTER TABLE `usuario`
  MODIFY `id_usuario` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=32;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `reserva`
--
ALTER TABLE `reserva`
  ADD CONSTRAINT `fk_reserva_hab` FOREIGN KEY (`id_habitacion`) REFERENCES `habitacion` (`id_hab`),
  ADD CONSTRAINT `fk_reserva_usuario` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id_usuario`);

--
-- Filtros para la tabla `reserva_servicio`
--
ALTER TABLE `reserva_servicio`
  ADD CONSTRAINT `reserva_servicio_ibfk_1` FOREIGN KEY (`id_reserva`) REFERENCES `reserva` (`id_reserva`),
  ADD CONSTRAINT `reserva_servicio_ibfk_2` FOREIGN KEY (`id_servicio`) REFERENCES `servicio` (`id_servicio`);

--
-- Filtros para la tabla `servicio`
--
ALTER TABLE `servicio`
  ADD CONSTRAINT `servicioPromo` FOREIGN KEY (`id_promo`) REFERENCES `promocion` (`id_promo`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
