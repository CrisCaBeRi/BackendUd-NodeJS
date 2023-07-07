CREATE DATABASE hospital;

USE hospital;

CREATE TABLE `medicos` (
  `cedula` int PRIMARY KEY,
  `nombre` varchar(100),
  `apellido` varchar(100),
  `especialidad` varchar(150),
  `consultorio` char(3),
  `correo` varchar(100)
);

CREATE TABLE `pacientes` (
  `cedula` int PRIMARY KEY,
  `nombre` varchar(100),
  `apellido` varchar(100),
  `edad` int,
  `telefono` int
);

CREATE TABLE `cita_medica` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `id_paciente` int,
  `id_medico` int,
  `fecha` date
);

ALTER TABLE `cita_medica` ADD FOREIGN KEY (`id_paciente`) REFERENCES `pacientes` (`cedula`);

ALTER TABLE `cita_medica` ADD FOREIGN KEY (`id_medico`) REFERENCES `medicos` (`cedula`);