-- MySQL dump 10.13  Distrib 8.0.19, for Win64 (x86_64)
--
-- Host: localhost    Database: enter
-- ------------------------------------------------------
-- Server version	8.0.39

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `appointments`
--

DROP TABLE IF EXISTS `appointments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `appointments` (
  `id` int unsigned NOT NULL,
  `name` varchar(191) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `description` varchar(191) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT NULL,
  `time` varchar(191) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT NULL,
  `appointment_date` timestamp NULL DEFAULT NULL,
  `status` tinyint(1) NOT NULL DEFAULT '0',
  `patient_id` int unsigned NOT NULL,
  `doctor_id` int unsigned NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `appointments`
--

LOCK TABLES `appointments` WRITE;
/*!40000 ALTER TABLE `appointments` DISABLE KEYS */;
/*!40000 ALTER TABLE `appointments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `dependencias`
--

DROP TABLE IF EXISTS `dependencias`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `dependencias` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `descripcion` varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT NULL,
  `color` varchar(100) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT NULL,
  `estado` enum('ACTIVO','INACTIVO') CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL DEFAULT 'ACTIVO',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `dependencias`
--

LOCK TABLES `dependencias` WRITE;
/*!40000 ALTER TABLE `dependencias` DISABLE KEYS */;
INSERT INTO `dependencias` VALUES (10,'Recepcion',NULL,'#31EC37','ACTIVO'),(11,'Caja',NULL,'#304AF3','INACTIVO'),(12,'Primer Piso',NULL,'#FFFF00','ACTIVO'),(13,'Segundo Piso',NULL,'#FF5733','ACTIVO'),(14,'Tercer Piso',NULL,'#FF9800','ACTIVO'),(15,'TURNERO',NULL,'#F9A8D4','ACTIVO');
/*!40000 ALTER TABLE `dependencias` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `impresoras`
--

DROP TABLE IF EXISTS `impresoras`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `impresoras` (
  `id` int NOT NULL AUTO_INCREMENT,
  `descripcion` varchar(100) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `tipo` varchar(100) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `archivo_principal` varchar(100) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `archivo_secundario` varchar(100) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT NULL,
  `foto` varchar(100) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT NULL,
  `imagen_frente` varchar(100) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT NULL,
  `imagen_dorso` varchar(100) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT NULL,
  `subcarpeta` varchar(100) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT NULL,
  `texto_codigo` varchar(100) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT NULL,
  `texto_valor` varchar(100) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `estado` enum('ACTIVO','INACTIVO') CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT 'ACTIVO',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `impresoras`
--

LOCK TABLES `impresoras` WRITE;
/*!40000 ALTER TABLE `impresoras` DISABLE KEYS */;
INSERT INTO `impresoras` VALUES (1,'Impresora Tostadora','TOSTADORA','MRZ_DATA.json','Text_Data.json','Photo.png','WHITE.png','WHITE.png','Page1/','fieldType','value','2023-09-26 00:41:57','ACTIVO'),(2,'Impresora SCANNER','SCANNER','MRZ_DATA.json','Text_Data.json','Photo.png','WHITE.png','WHITE.png','Page1/','fieldType','value','2023-09-26 00:41:57','ACTIVO');
/*!40000 ALTER TABLE `impresoras` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pantallas`
--

DROP TABLE IF EXISTS `pantallas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pantallas` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(50) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `fecha_create` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `fecha_inactive` datetime DEFAULT NULL,
  `estado` enum('ACTIVO','INACTIVO') CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL DEFAULT 'ACTIVO',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pantallas`
--

LOCK TABLES `pantallas` WRITE;
/*!40000 ALTER TABLE `pantallas` DISABLE KEYS */;
INSERT INTO `pantallas` VALUES (5,'VisitasDia','2023-09-26 00:44:05',NULL,'ACTIVO'),(6,'Movimientos','2023-09-26 00:44:05',NULL,'ACTIVO'),(7,'Gestion','2023-09-26 00:44:05',NULL,'ACTIVO'),(8,'Sistema','2023-09-26 00:44:05',NULL,'ACTIVO');
/*!40000 ALTER TABLE `pantallas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `puestos`
--

DROP TABLE IF EXISTS `puestos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `puestos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `descripcion` varchar(100) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `nombre` varchar(100) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `ip` varchar(25) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT NULL,
  `puerto` int DEFAULT NULL,
  `ubicacion` varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `servidor` tinyint(1) DEFAULT NULL,
  `tipo` enum('XAMPP','LOCAL') CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT NULL,
  `ubicacion_servidor` varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT NULL,
  `ubicacion_servidor_xampp` varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT NULL,
  `url_api` varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT NULL,
  `sistema_operativo` enum('WINDOWS','MACOS') CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT 'WINDOWS',
  `id_impresora` int DEFAULT NULL,
  `estado` enum('ACTIVO','INACTIVO') CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL DEFAULT 'ACTIVO',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `puestos`
--

LOCK TABLES `puestos` WRITE;
/*!40000 ALTER TABLE `puestos` DISABLE KEYS */;
INSERT INTO `puestos` VALUES (1,'PC WIN','PCWIN','127.0.0.1',80,'C:\\ENTER\\DOCS\\',1,'LOCAL','C:\\\\ENTER\\\\documentos\\\\',NULL,'http://127.0.0.1:7001/api/','WINDOWS',1,'INACTIVO','2023-09-26 00:48:38'),(2,'PC MAC','PCMAC','127.0.0.1',80,'C:\\ENTER\\DOCS\\',1,'LOCAL','C:\\\\ENTER\\\\documentos\\\\',NULL,'http://127.0.0.1:7001/api/','WINDOWS',1,'ACTIVO','2023-09-26 00:47:00');
/*!40000 ALTER TABLE `puestos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `puntoatencion`
--

DROP TABLE IF EXISTS `puntoatencion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `puntoatencion` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(200) NOT NULL,
  `descripcion` text,
  `ubicacion` varchar(255) DEFAULT NULL,
  `activo` tinyint(1) DEFAULT '1',
  PRIMARY KEY (`id`),
  UNIQUE KEY `nombre` (`nombre`)
) ENGINE=InnoDB AUTO_INCREMENT=63 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `puntoatencion`
--

LOCK TABLES `puntoatencion` WRITE;
/*!40000 ALTER TABLE `puntoatencion` DISABLE KEYS */;
INSERT INTO `puntoatencion` VALUES (58,'Atención al Cliente 1','Punto de atención para consultas generales.','Planta Baja - Sector A',1),(59,'Caja 1','Punto de atención para pagos y retiros.','Planta ALTA - Sector B',1),(60,'ATENCION ACADEMICA 1','ATENCION DE PARTE DE UN ACADEMICO','Planta ALTA - Sector A',1),(61,'CAJA FISCAL','CAJA DE MINISTERIO DE HACIENDA','1ER PISO BLOQUE B',1),(62,'COORDINACION 1','COORDINACION DE CARRERA','1ER PISO BLOQUE A',1);
/*!40000 ALTER TABLE `puntoatencion` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `roles`
--

DROP TABLE IF EXISTS `roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `roles` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(50) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `fecha_create` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `fecha_inactive` datetime DEFAULT NULL,
  `estado` enum('ACTIVO','INACTIVO') CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL DEFAULT 'ACTIVO',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `roles`
--

LOCK TABLES `roles` WRITE;
/*!40000 ALTER TABLE `roles` DISABLE KEYS */;
INSERT INTO `roles` VALUES (1,'Administrador','2023-07-27 13:49:15',NULL,'ACTIVO'),(2,'Guardia','2023-07-27 13:49:24',NULL,'ACTIVO');
/*!40000 ALTER TABLE `roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `roles_pantallas`
--

DROP TABLE IF EXISTS `roles_pantallas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `roles_pantallas` (
  `id` int NOT NULL AUTO_INCREMENT,
  `id_rol` int NOT NULL,
  `id_pantalla` int NOT NULL,
  `fecha_create` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `fecha_inactive` datetime DEFAULT NULL,
  `estado` enum('ACTIVO','INACTIVO') CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL DEFAULT 'ACTIVO',
  PRIMARY KEY (`id`),
  KEY `id_rol` (`id_rol`),
  KEY `id_pantalla` (`id_pantalla`),
  CONSTRAINT `roles_pantallas_ibfk_1` FOREIGN KEY (`id_rol`) REFERENCES `roles` (`id`),
  CONSTRAINT `roles_pantallas_ibfk_2` FOREIGN KEY (`id_pantalla`) REFERENCES `pantallas` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `roles_pantallas`
--

LOCK TABLES `roles_pantallas` WRITE;
/*!40000 ALTER TABLE `roles_pantallas` DISABLE KEYS */;
/*!40000 ALTER TABLE `roles_pantallas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tipo_documento`
--

DROP TABLE IF EXISTS `tipo_documento`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tipo_documento` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `descripcion` varchar(100) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `codigo` varchar(10) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT NULL,
  `estado` enum('ACTIVO','INACTIVO') CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL DEFAULT 'ACTIVO',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tipo_documento`
--

LOCK TABLES `tipo_documento` WRITE;
/*!40000 ALTER TABLE `tipo_documento` DISABLE KEYS */;
/*!40000 ALTER TABLE `tipo_documento` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tramites`
--

DROP TABLE IF EXISTS `tramites`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tramites` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  `descripcion` text,
  `prioridad` enum('BAJA','MEDIA','ALTA') DEFAULT 'MEDIA',
  `tiempo_estimado` int DEFAULT '10',
  `activo` tinyint(1) DEFAULT '1',
  PRIMARY KEY (`id`),
  UNIQUE KEY `nombre` (`nombre`)
) ENGINE=InnoDB AUTO_INCREMENT=58 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tramites`
--

LOCK TABLES `tramites` WRITE;
/*!40000 ALTER TABLE `tramites` DISABLE KEYS */;
INSERT INTO `tramites` VALUES (1,'Solicitud de Certificado Actualizada','Nueva descripción actualizada','ALTA',20,1),(2,'Solicitud de Constancia','Emisión de Constancia oficiales','MEDIA',15,1),(3,'Solicitud de Actas','Emisión de Actas oficiales','MEDIA',15,1),(4,'Presentacion de Actas','Presentacion de Actas oficiales','MEDIA',15,1),(5,'Presentacion de Certificados','Presentacion de Certificados oficiales','MEDIA',0,1),(6,'Certificado de Nacimiento','Solicitud hecha ante el Registro Civil','MEDIA',10,1),(7,'Antecedentes Policiales','Solicitud hecha ante la Policía Nacional','MEDIA',10,1),(8,'Antecedentes Judiciales','Solicitud hecha ante el Poder Judicial','MEDIA',10,1),(9,'Antecedentes de INTERPOL','Solicitud hecha ante la INTERPOL','MEDIA',10,1),(10,'Certificado Medico','Solicitado al MSPyBS','MEDIA',10,1),(12,'Constancia Medica','Solicitud hecha ante el MSPyBS','MEDIA',10,1),(13,'Constancia No ser Contribuyente','Solicitada al Ministerio de Hacienda','MEDIA',10,1),(14,'CCT','Ministerio de Hacienda','MEDIA',10,1),(15,'No ser Contribuyente','Hacienda','MEDIA',10,1),(16,'Constancia de Grado Academico','MEC','MEDIA',10,1),(17,'Certificado de Estudios','Universidad','MEDIA',10,1),(18,'Constancia de Matriculacion','Universidad','MEDIA',10,1),(19,'Alumno Culminante','Alumno que termino la malla','MEDIA',10,1),(20,'Solicitud de Admision','Admisión ','MEDIA',10,1),(21,'Solicitud de Egreso','Para Egresados','MEDIA',10,1),(22,'Solicitud de Matriculacion','Matriculación','MEDIA',10,1),(23,'Renovacion de Cedula','Renovacion de CI ','MEDIA',10,1),(28,'Solicitud de Pasaporte','Pasaporte','MEDIA',10,1),(29,'ASIGNACION DE MATERIAS','ACADEMICO','MEDIA',10,1),(31,'REASIGNACION DE MATERIAS','ACADEMICO','MEDIA',10,1),(32,'Exclusion de materias','Academico','MEDIA',10,1),(33,'Exclusion de matricula','Academico','MEDIA',10,1),(34,'Solicitud de Titulo','Titulacion de Grado','MEDIA',10,1),(36,'Solicitud de Titulo Post','Titulacion de PostGrado','MEDIA',10,1),(37,'Post Certificado de Estudios','Certifcado de Estudios de Postgrado','MEDIA',10,1),(38,'Atencion al Cliente','Atención al cliente ','MEDIA',10,1),(40,'CAJA','Caja en Ventanilla','MEDIA',10,1),(45,'Ventanilla','Ventanilla','MEDIA',10,1),(47,'CAJA 2','CAJA','MEDIA',10,1),(52,'CAJA2','CAJA2','MEDIA',10,1),(54,'CAJA3','CAJA3','MEDIA',10,1),(56,'CAJA4','CAJA4','MEDIA',10,1),(57,'CAJA 5','CAJA 5','MEDIA',10,1);
/*!40000 ALTER TABLE `tramites` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `turnos`
--

DROP TABLE IF EXISTS `turnos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `turnos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `id_visita` int NOT NULL,
  `codigo_turno` varchar(10) NOT NULL,
  `estado` enum('PENDIENTE','ATENDIENDO','FINALIZADO','CANCELADO') DEFAULT 'PENDIENTE',
  `tramite` varchar(100) NOT NULL,
  `fecha_emision` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `fecha_llamado` timestamp NULL DEFAULT NULL,
  `fecha_finalizacion` timestamp NULL DEFAULT NULL,
  `tiempo_espera` int DEFAULT NULL,
  `id_tramite` int NOT NULL,
  `box` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `id_visita` (`id_visita`),
  KEY `id_tramite` (`id_tramite`),
  CONSTRAINT `turnos_ibfk_1` FOREIGN KEY (`id_visita`) REFERENCES `visitas` (`id`) ON DELETE CASCADE,
  CONSTRAINT `turnos_ibfk_2` FOREIGN KEY (`id_tramite`) REFERENCES `tramites` (`id`) ON DELETE RESTRICT
) ENGINE=InnoDB AUTO_INCREMENT=29 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `turnos`
--

LOCK TABLES `turnos` WRITE;
/*!40000 ALTER TABLE `turnos` DISABLE KEYS */;
INSERT INTO `turnos` VALUES (1,187,'LL697','PENDIENTE','Solicitud de Certificado','2025-02-28 17:51:31','2025-03-22 23:48:38',NULL,0,1,59),(2,187,'LL697','PENDIENTE','CAJA4','2025-02-28 17:52:39',NULL,NULL,NULL,56,NULL),(3,197,'JC697','PENDIENTE','CAJA 2','2025-03-17 15:02:37',NULL,NULL,NULL,47,NULL),(4,199,'JC697','PENDIENTE','CAJA3','2025-03-17 15:26:17',NULL,NULL,NULL,54,NULL),(5,200,'AASAD','PENDIENTE','CAJA4','2025-03-17 15:27:11',NULL,NULL,NULL,56,NULL),(6,201,'LL697','PENDIENTE','CAJA 5','2025-03-17 15:29:33',NULL,NULL,NULL,57,NULL),(7,202,'LL697','ATENDIENDO','CAJA','2025-03-17 15:39:22','2025-03-24 15:10:34',NULL,1,40,59),(8,203,'FDZX<','PENDIENTE','CAJA 2','2025-03-17 15:40:57',NULL,NULL,NULL,47,NULL),(9,204,'FDZX<','PENDIENTE','CAJA3','2025-03-17 15:49:33',NULL,NULL,0,54,NULL),(10,205,'FDZX<','PENDIENTE','CAJA4','2025-03-17 15:58:32',NULL,NULL,NULL,56,NULL),(11,206,'FDZX<','PENDIENTE','CAJA 5','2025-03-17 16:07:33',NULL,NULL,NULL,57,NULL),(12,207,'AD215','ATENDIENDO','CAJA','2025-03-17 16:08:42','2025-03-24 15:42:44',NULL,NULL,40,59),(13,208,'JC697','PENDIENTE','CAJA','2025-03-23 01:42:21',NULL,NULL,NULL,40,NULL),(14,209,'LL215','PENDIENTE','CAJA 5','2025-03-23 01:53:21',NULL,NULL,NULL,57,NULL),(15,210,'ADZX<','PENDIENTE','CAJA3','2025-03-23 02:07:58',NULL,NULL,NULL,54,NULL),(16,211,'LLZX<','PENDIENTE','CAJA4','2025-03-23 02:15:02',NULL,NULL,NULL,56,NULL),(17,212,'AD697','PENDIENTE','CAJA3','2025-03-23 02:20:09',NULL,NULL,NULL,54,NULL),(18,213,'AD768','PENDIENTE','CAJA 5','2025-03-23 02:39:42',NULL,NULL,NULL,57,NULL),(19,214,'CD697','PENDIENTE','CAJA3','2025-03-23 02:55:54',NULL,NULL,NULL,54,NULL),(20,215,'FDZXC','PENDIENTE','CAJA','2025-03-23 02:58:26',NULL,NULL,NULL,40,NULL),(21,216,'AB385','PENDIENTE','CCT','2025-03-23 19:10:41',NULL,NULL,NULL,14,NULL),(22,223,'AB385','PENDIENTE','CCT','2025-03-24 02:15:14',NULL,NULL,NULL,14,NULL),(23,226,'AB385','PENDIENTE','CAJA3','2025-03-24 03:04:13',NULL,NULL,NULL,54,NULL),(24,230,'JC697','PENDIENTE','CAJA','2025-03-24 14:03:29',NULL,NULL,NULL,40,NULL),(25,231,'JC697','PENDIENTE','CAJA 2','2025-03-24 14:08:52',NULL,NULL,NULL,47,NULL),(26,232,'JC697','PENDIENTE','CAJA 5','2025-03-24 14:36:33',NULL,NULL,NULL,57,NULL),(27,234,'JC697','PENDIENTE','CAJA3','2025-03-24 14:39:46',NULL,NULL,NULL,54,NULL),(28,236,'JC697','PENDIENTE','CAJA4','2025-03-25 15:52:09',NULL,NULL,NULL,56,NULL);
/*!40000 ALTER TABLE `turnos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuarios`
--

DROP TABLE IF EXISTS `usuarios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuarios` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `apellido` varchar(100) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `documento` varchar(50) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `contrasena` varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `id_rol` int NOT NULL,
  `foto` varchar(100) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT NULL,
  `imagen_frente` varchar(100) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT NULL,
  `imagen_dorso` varchar(100) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT NULL,
  `id_tipo_documento` int DEFAULT NULL,
  `tipo_documento` varchar(50) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `correo` varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT NULL,
  `nro_celular` varchar(25) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT NULL,
  `nro_telefono` varchar(25) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT NULL,
  `cod_nacionalidad` varchar(100) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT NULL,
  `nacionalidad` varchar(100) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT NULL,
  `fecha_nacimiento` varchar(100) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT NULL,
  `fecha_emision` varchar(100) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT NULL,
  `fecha_expiracion` varchar(100) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT NULL,
  `cod_sexo` varchar(100) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT NULL,
  `sexo` varchar(100) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT NULL,
  `estado_civil` varchar(100) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT NULL,
  `activo` tinyint(1) NOT NULL DEFAULT '0',
  `fecha_create` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `estado` enum('ACTIVO','INACTIVO') CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL DEFAULT 'ACTIVO',
  PRIMARY KEY (`id`),
  KEY `roles_usuarios_fk` (`id_rol`),
  CONSTRAINT `roles_usuarios_fk` FOREIGN KEY (`id_rol`) REFERENCES `roles` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=28 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuarios`
--

LOCK TABLES `usuarios` WRITE;
/*!40000 ALTER TABLE `usuarios` DISABLE KEYS */;
INSERT INTO `usuarios` VALUES (6,'Admin','Web','123456','$2a$10$t9tGgK48LHheJj0s2Yc64OQqRNkwO7ufLj5zmfqNvJlEoKgYwBdRK',1,'foto.png','frente.png','dorso.png',1,'ID','admin@correo.com','0981300200',NULL,'PRY','PARAGUAYA','911201','19-06-2015','250619','M','MASCULINO','SOLTERO',1,'2023-09-26 03:27:32','ACTIVO'),(26,'GUARDIA','DE PRUEBA','12345','$2a$10$4svFYtGuR2mob.OrQmYks.JxDW4N6GaWbxw3XD1D.mwOMKRwL3Il6',2,'foto.png','frente.png','dorso.png',1,'ID','CORREO@CORREO.COM.PY','0981900900',NULL,'PRY','PARAGUAYA',NULL,NULL,NULL,NULL,'OTROS',NULL,0,'2024-08-30 10:45:02','ACTIVO'),(27,'1010','1010','1010','$2a$10$O7VyjkNvJIUQ75k3hgGHee8xfJBZ4se9QeG1utY0yIYZ6vhOOJZDS',1,'foto.png','frente.png','dorso.png',1,'ID','1010','1010',NULL,'PRY','PARAGUAYA',NULL,NULL,NULL,NULL,'OTROS',NULL,0,'2024-09-04 15:53:35','ACTIVO');
/*!40000 ALTER TABLE `usuarios` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuarios_marcacion`
--

DROP TABLE IF EXISTS `usuarios_marcacion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuarios_marcacion` (
  `id` int NOT NULL AUTO_INCREMENT,
  `id_usuario` int NOT NULL,
  `id_dependencia` int DEFAULT NULL,
  `entrada` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `salida` datetime DEFAULT NULL,
  PRIMARY KEY (`id`,`id_usuario`),
  KEY `usuarios_usuarios_marcacion_fk` (`id_usuario`),
  CONSTRAINT `usuarios_usuarios_marcacion_fk` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuarios_marcacion`
--

LOCK TABLES `usuarios_marcacion` WRITE;
/*!40000 ALTER TABLE `usuarios_marcacion` DISABLE KEYS */;
INSERT INTO `usuarios_marcacion` VALUES (20,26,NULL,'2024-08-30 10:45:36','2024-10-02 14:30:21'),(21,26,NULL,'2024-10-02 14:30:32',NULL);
/*!40000 ALTER TABLE `usuarios_marcacion` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `visitas`
--

DROP TABLE IF EXISTS `visitas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `visitas` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `apellido` varchar(100) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `nro_documento` varchar(50) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `id_tipo_documento` int DEFAULT NULL,
  `tipo_documento` varchar(50) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `foto` varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT NULL,
  `imagen_frente` varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT NULL,
  `imagen_dorso` varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT NULL,
  `cod_nacionalidad` varchar(25) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT NULL,
  `nacionalidad` varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT NULL,
  `fecha_nacimiento` varchar(100) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT NULL,
  `fecha_expiracion` varchar(100) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT NULL,
  `fecha_emision` varchar(100) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT NULL,
  `cod_sexo` varchar(1) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT NULL,
  `sexo` varchar(25) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT NULL,
  `estado_civil` varchar(100) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT NULL,
  `identity_card_number` varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT NULL,
  `entrada` datetime DEFAULT NULL,
  `salida` datetime DEFAULT NULL,
  `id_dependencia` int DEFAULT NULL,
  `id_puesto` int DEFAULT NULL,
  `id_usuario` int DEFAULT NULL,
  `codigo_tarjeta` varchar(100) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT NULL,
  `descripcion` varchar(55) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=237 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `visitas`
--

LOCK TABLES `visitas` WRITE;
/*!40000 ALTER TABLE `visitas` DISABLE KEYS */;
INSERT INTO `visitas` VALUES (167,'ALDO','BENITEZ','A5082697',NULL,'PASAPORTE','foto.png','frente.png','dorso.png',NULL,'Argentina',NULL,NULL,NULL,NULL,'OTROS',NULL,NULL,'2025-02-24 11:11:48',NULL,13,NULL,26,'XC<XC',''),(168,'AUGUSTUS','ARGUELLO','ABENITEZ1231215',NULL,'PASAPORTE','foto.png','frente.png','dorso.png',NULL,'Argentina',NULL,NULL,NULL,NULL,'OTROS',NULL,NULL,'2025-02-24 11:16:46',NULL,14,NULL,26,NULL,''),(169,'12345','12345','12345',NULL,'DOCUMENTO DE IDENTIDAD','foto.png','frente.png','dorso.png',NULL,'Antártida',NULL,NULL,NULL,NULL,'OTROS',NULL,NULL,'2025-02-24 11:20:20',NULL,12,NULL,26,NULL,''),(170,'123456','123456','123456',NULL,'VISA','foto.png','frente.png','dorso.png',NULL,'Alemania',NULL,NULL,NULL,NULL,'OTROS',NULL,NULL,'2025-02-24 11:25:17',NULL,13,NULL,26,NULL,''),(171,'1234566','1234566','1234566',NULL,'PASAPORTE','foto.png','frente.png','dorso.png',NULL,'Alemania',NULL,NULL,NULL,NULL,'OTROS',NULL,NULL,'2025-02-24 11:29:22',NULL,10,NULL,26,NULL,''),(172,'1234567','1234567','1234567',NULL,'PASAPORTE','foto.png','frente.png','dorso.png',NULL,'Alemania',NULL,NULL,NULL,NULL,'OTROS',NULL,NULL,'2025-02-24 11:30:05',NULL,12,NULL,26,NULL,''),(173,'22','22','22',NULL,'PASAPORTE','foto.png','frente.png','dorso.png',NULL,'Albania',NULL,NULL,NULL,NULL,'OTROS',NULL,NULL,'2025-02-24 11:36:35',NULL,14,NULL,26,NULL,''),(174,'33','333','33',NULL,'VISA','foto.png','frente.png','dorso.png',NULL,'Alemania',NULL,NULL,NULL,NULL,'OTROS',NULL,NULL,'2025-02-24 11:49:28',NULL,13,NULL,26,NULL,''),(175,'44','44','44',NULL,'VISA','foto.png','frente.png','dorso.png',NULL,'Alemania',NULL,NULL,NULL,NULL,'OTROS',NULL,NULL,'2025-02-24 11:51:37',NULL,13,NULL,26,NULL,''),(176,'00','00','00',NULL,'VISA','foto.png','frente.png','dorso.png',NULL,'Argentina',NULL,NULL,NULL,NULL,'OTROS',NULL,NULL,'2025-02-24 12:19:06',NULL,14,NULL,26,NULL,''),(177,'007','007','007',NULL,'PASAPORTE','foto.png','frente.png','dorso.png',NULL,'Reino Unido',NULL,NULL,NULL,NULL,'OTROS',NULL,NULL,'2025-02-24 12:21:42',NULL,14,NULL,26,NULL,''),(178,'008','008','008',NULL,'PASAPORTE','foto.png','frente.png','dorso.png',NULL,'Irlanda',NULL,NULL,NULL,NULL,'OTROS',NULL,NULL,'2025-02-24 12:23:47',NULL,13,NULL,26,NULL,''),(179,'ALDO','BENITEZ','3758768',NULL,'DOCUMENTO DE IDENTIDAD','foto.png','frente.png','dorso.png',NULL,'Australia',NULL,NULL,NULL,NULL,'OTROS',NULL,NULL,'2025-02-24 12:42:56',NULL,13,NULL,26,'XC<XC',''),(180,'JUANA ROSSANA','CABRERA RUIZ','5082697',NULL,'DOCUMENTO DE IDENTIDAD','foto.png','frente.png','dorso.png','PRY','Paraguay','23/06/1997','23/05/2026',NULL,'F','FEMENINO',NULL,NULL,'2025-02-25 16:16:24',NULL,13,NULL,26,NULL,''),(181,'ALEJANDRO','DE FILIPPIS BERAUD','1951597',NULL,'DOCUMENTO DE IDENTIDAD','foto.png','frente.png','dorso.png','PRY','Paraguay','16/11/1976','22/06/2027',NULL,'M','MASCULINO',NULL,NULL,'2025-02-25 16:17:49',NULL,12,NULL,26,NULL,''),(182,'ALDO NOEL','8ENITEZ OZORIO','3758768',NULL,'DOCUMENTO DE IDENTIDAD','foto.png','frente.png','dorso.png','PRY','Paraguay','05/12/1992','28/02/2033',NULL,'M','MASCULINO',NULL,NULL,'2025-02-25 16:21:07',NULL,12,NULL,26,NULL,''),(183,'AUGUSTUS','CESAR','A2021',NULL,'VISA','foto.png','frente.png','dorso.png',NULL,'Países Bajos',NULL,NULL,NULL,NULL,'OTROS',NULL,NULL,'2025-02-27 16:41:40',NULL,13,NULL,26,NULL,''),(184,'AUGUSTUS','CESAR','A2021',NULL,'VISA','foto.png','frente.png','dorso.png',NULL,'Países Bajos',NULL,NULL,NULL,NULL,'OTROS',NULL,NULL,'2025-02-27 16:44:01',NULL,13,NULL,26,NULL,''),(185,'FULANO','DETAL','A5082697',NULL,'PASAPORTE','foto.png','frente.png','dorso.png',NULL,'Argentina',NULL,NULL,NULL,NULL,'OTROS',NULL,NULL,'2025-02-27 16:46:42',NULL,14,NULL,26,NULL,''),(186,'ALDO','BENITEZ','3758768',NULL,'DOCUMENTO DE IDENTIDAD','foto.png','frente.png','dorso.png',NULL,'Argentina',NULL,NULL,NULL,NULL,'OTROS',NULL,NULL,'2025-02-28 10:22:22',NULL,13,NULL,26,'XC<XC',''),(187,'LEOPOLDO','LOPEZ','A5082697',NULL,'PASAPORTE','foto.png','frente.png','dorso.png',NULL,'Argentina',NULL,NULL,NULL,NULL,'OTROS',NULL,NULL,'2025-02-28 10:23:50','2025-03-22 20:48:53',13,NULL,26,'4',''),(188,'FULANO','DETAL','ABENITEZ1231215',NULL,'PASAPORTE','foto.png','frente.png','dorso.png',NULL,'Armenia',NULL,NULL,NULL,NULL,'OTROS',NULL,NULL,'2025-02-28 10:25:05',NULL,14,NULL,26,NULL,''),(189,'FULANO','DETAL','3758768K',NULL,'PASAPORTE','foto.png','frente.png','dorso.png',NULL,'Aruba',NULL,NULL,NULL,NULL,'OTROS',NULL,NULL,'2025-02-28 10:26:23',NULL,14,NULL,26,NULL,''),(190,'22','22','22',NULL,'VISA','foto.png','frente.png','dorso.png',NULL,'Australia',NULL,NULL,NULL,NULL,'OTROS',NULL,NULL,'2025-02-28 10:33:13',NULL,13,NULL,26,NULL,''),(191,'ALDO','BENITEZ','ABENITEZ123121S5ZFSD',NULL,'VISA','foto.png','frente.png','dorso.png',NULL,'Argentina',NULL,NULL,NULL,NULL,'OTROS',NULL,NULL,'2025-02-28 10:34:16',NULL,13,NULL,26,'XC<XC',''),(192,'LEOPOLDO','LOPEZ','A5082697ASD',NULL,'PASAPORTE','foto.png','frente.png','dorso.png',NULL,'Argentina',NULL,NULL,NULL,NULL,'OTROS',NULL,NULL,'2025-02-28 11:17:20',NULL,12,NULL,26,'4',''),(193,'LEOPOLDO','LOPEZ','A5082697ASD',NULL,'PASAPORTE','foto.png','frente.png','dorso.png',NULL,'Argentina',NULL,NULL,NULL,NULL,'OTROS',NULL,NULL,'2025-02-28 11:24:13',NULL,12,NULL,26,'4',''),(194,'JUANA ROSSANA','CABRERA RUIZ','5082697',NULL,'DOCUMENTO DE IDENTIDAD','foto.png','frente.png','dorso.png','PRY','Paraguay','23/06/1997','23/05/2026',NULL,'F','FEMENINO',NULL,NULL,'2025-03-13 17:08:56',NULL,10,NULL,26,NULL,''),(195,'JUANA ROSSANA','CABRERA RUIZ','5082697',NULL,'DOCUMENTO DE IDENTIDAD','foto.png','frente.png','dorso.png','PRY','Paraguay','23/06/1997','23/05/2026',NULL,'F','FEMENINO',NULL,NULL,'2025-03-14 11:19:33',NULL,13,NULL,26,NULL,''),(196,'ASDASD','ADASD','ASDSAD',NULL,'PASAPORTE','foto.png','frente.png','dorso.png',NULL,'Arabia Saudita',NULL,NULL,NULL,NULL,'OTROS',NULL,NULL,'2025-03-17 11:08:50',NULL,10,NULL,26,NULL,NULL),(197,'JUANA ROSSANA','CABRERA RUIZ','5082697',NULL,'DOCUMENTO DE IDENTIDAD','foto.png','frente.png','dorso.png','PRY','Paraguay','23/06/1997','23/05/2026',NULL,'F','FEMENINO',NULL,NULL,'2025-03-17 11:57:59',NULL,15,NULL,26,NULL,NULL),(198,'JUANA ROSSANA','CABRERA RUIZ','5082697',NULL,'DOCUMENTO DE IDENTIDAD','foto.png','frente.png','dorso.png','PRY','Paraguay','23/06/1997','23/05/2026',NULL,'F','FEMENINO',NULL,NULL,'2025-03-17 12:25:32',NULL,15,NULL,26,NULL,NULL),(199,'JUANA ROSSANA','CABRERA RUIZ','5082697',NULL,'DOCUMENTO DE IDENTIDAD','foto.png','frente.png','dorso.png','PRY','Paraguay','23/06/1997','23/05/2026',NULL,'F','FEMENINO',NULL,NULL,'2025-03-17 12:26:17',NULL,15,NULL,26,NULL,NULL),(200,'ASDASD','ADASD','ASDSAD',NULL,'PASAPORTE','foto.png','frente.png','dorso.png',NULL,'Australia',NULL,NULL,NULL,NULL,'OTROS',NULL,NULL,'2025-03-17 12:27:11',NULL,15,NULL,26,NULL,NULL),(201,'LEOPOLDO','LOPEZ','A5082697',NULL,'PASAPORTE','foto.png','frente.png','dorso.png',NULL,'Austria',NULL,NULL,NULL,NULL,'OTROS',NULL,NULL,'2025-03-17 12:29:33',NULL,15,NULL,26,NULL,NULL),(202,'LEOPOLDO','LOPEZ','A5082697',NULL,'PASAPORTE','foto.png','frente.png','dorso.png',NULL,'Australia',NULL,NULL,NULL,NULL,'OTROS',NULL,NULL,'2025-03-17 12:39:22','2025-03-22 17:52:01',15,NULL,26,NULL,NULL),(203,'FULANO','DETAL','5082697X<XZ<ZX<ZX<ZX<ZX<ZX<ZSDAAX<ZX<',NULL,'VISA','foto.png','frente.png','dorso.png',NULL,'Aruba',NULL,NULL,NULL,NULL,'OTROS',NULL,NULL,'2025-03-17 12:40:57',NULL,15,NULL,26,NULL,NULL),(204,'FULANO','DETAL','5082697X<XZ<ZX<ZX<ZX<ZX<ZX<ZSDAAX<ZX<',NULL,'PASAPORTE','foto.png','frente.png','dorso.png',NULL,'Argentina',NULL,NULL,NULL,NULL,'OTROS',NULL,NULL,'2025-03-17 12:49:33',NULL,15,NULL,26,NULL,NULL),(205,'FULANO','DETAL','5082697X<XZ<ZX<ZX<ZX<ZX<ZX<ZSDAAX<ZX<',NULL,'PASAPORTE','foto.png','frente.png','dorso.png',NULL,'Argentina',NULL,NULL,NULL,NULL,'OTROS',NULL,NULL,'2025-03-17 12:58:32',NULL,15,NULL,26,NULL,NULL),(206,'FULANO','DETAL','5082697X<XZ<ZX<ZX<ZX<ZX<ZX<ZSDAAX<ZX<',NULL,'PASAPORTE','foto.png','frente.png','dorso.png',NULL,'Argentina',NULL,NULL,NULL,NULL,'OTROS',NULL,NULL,'2025-03-17 13:07:33',NULL,15,NULL,26,NULL,NULL),(207,'ASDASD','DASDSAD','ABENITEZ1231215',NULL,'VISA','foto.png','frente.png','dorso.png',NULL,'Argentina',NULL,NULL,NULL,NULL,'OTROS',NULL,NULL,'2025-03-17 13:08:42',NULL,15,NULL,26,NULL,NULL),(208,'JUANA ROSSANA','CABRERA RUIZ','5082697',NULL,'DOCUMENTO DE IDENTIDAD','foto.png','frente.png','dorso.png','PRY','Paraguay','23/06/1997','23/05/2026',NULL,'F','FEMENINO',NULL,NULL,'2025-03-22 22:42:21','2025-03-22 22:44:46',15,NULL,26,NULL,NULL),(209,'LEOPOLDO','LOPEZ','ABENITEZ1231215',NULL,'VISA','foto.png','frente.png','dorso.png',NULL,'Argentina',NULL,NULL,NULL,NULL,'OTROS',NULL,NULL,'2025-03-22 22:53:20',NULL,15,NULL,26,NULL,NULL),(210,'ASDASD','DASDSAD','5082697X<XZ<ZX<ZX<ZX<ZX<ZX<ZSDAAX<ZX<',NULL,'PASAPORTE','foto.png','frente.png','dorso.png',NULL,'Australia',NULL,NULL,NULL,NULL,'OTROS',NULL,NULL,'2025-03-22 23:07:58',NULL,15,NULL,26,NULL,NULL),(211,'LEOPOLDO','LOPEZ','5082697X<XZ<ZX<ZX<ZX<ZX<ZX<ZSDAAX<ZX<',NULL,'PASAPORTE','foto.png','frente.png','dorso.png',NULL,'Australia',NULL,NULL,NULL,NULL,'OTROS',NULL,NULL,'2025-03-22 23:15:02',NULL,15,NULL,26,NULL,NULL),(212,'ASDASD','DASDSAD','A5082697',NULL,'PASAPORTE','foto.png','frente.png','dorso.png',NULL,'Aruba',NULL,NULL,NULL,NULL,'OTROS',NULL,NULL,'2025-03-22 23:20:08',NULL,15,NULL,26,NULL,NULL),(213,'ASDASD','DASDSAD','3758768',NULL,'PASAPORTE','foto.png','frente.png','dorso.png',NULL,'Aruba',NULL,NULL,NULL,NULL,'OTROS',NULL,NULL,'2025-03-22 23:39:42',NULL,15,NULL,26,NULL,NULL),(214,'CUARTO PISO','DETAL','5082697',NULL,'VISA','foto.png','frente.png','dorso.png',NULL,'Australia',NULL,NULL,NULL,NULL,'OTROS',NULL,NULL,'2025-03-22 23:55:54',NULL,15,NULL,26,NULL,NULL),(215,'FULANO','DETAL','ZXCZXC',NULL,'PASAPORTE','foto.png','frente.png','dorso.png',NULL,'Bélgica',NULL,NULL,NULL,NULL,'OTROS',NULL,NULL,'2025-03-22 23:58:26',NULL,15,NULL,26,NULL,NULL),(216,'ANTOLIANO','BENITEZ ESCOBAR','900385',NULL,'DOCUMENTO DE IDENTIDAD','foto.png','frente.png','dorso.png','PRY','Paraguay','06/02/1958','25/08/2026',NULL,'M','MASCULINO',NULL,NULL,'2025-03-23 16:10:41','2025-03-23 22:18:39',15,NULL,26,NULL,NULL),(217,'ANTOLIANO','BENITEZ ESCOBAR','900385',NULL,'DOCUMENTO DE IDENTIDAD','foto.png','frente.png','dorso.png','PRY','PARAGUAYA','06/02/1958','25/08/2026','25/08/2016','M','MASCULINO','CASADO','38009871962064','2025-03-23 22:18:43','2025-03-23 22:24:19',13,NULL,26,NULL,''),(218,'ANTOLIANO','BENITEZ ESCOBAR','900385',NULL,'DOCUMENTO DE IDENTIDAD','foto.png','frente.png','dorso.png','PRY','PARAGUAYA','06/02/1958','25/08/2026','25/08/2016','M','MASCULINO','CASADO','38009871962064','2025-03-23 22:44:08','2025-03-23 22:44:45',13,NULL,26,NULL,''),(219,'ANTOLIANO','BENITEZ ESCOBAR','900385',NULL,'DOCUMENTO DE IDENTIDAD','foto.png','frente.png','dorso.png','PRY','PARAGUAYA','06/02/1958','25/08/2026','25/08/2016','M','MASCULINO','CASADO','38009871962064','2025-03-23 22:45:05','2025-03-23 23:06:11',13,NULL,26,NULL,''),(220,'ANTOLIANO','BENITEZ ESCOBAR','900385',NULL,'DOCUMENTO DE IDENTIDAD','foto.png','frente.png','dorso.png','PRY','PARAGUAYA','06/02/1958','25/08/2026','25/08/2016','M','MASCULINO','CASADO','38009871962064','2025-03-23 23:06:15','2025-03-23 23:13:16',13,NULL,26,NULL,''),(221,'ANTOLIANO','BENITEZ ESCOBAR','900385',NULL,'DOCUMENTO DE IDENTIDAD','foto.png','frente.png','dorso.png','PRY','PARAGUAYA','06/02/1958','25/08/2026','25/08/2016','M','MASCULINO','CASADO','38009871962064','2025-03-23 23:13:24','2025-03-23 23:14:34',15,NULL,26,NULL,''),(222,'ANTOLIANO','BENITEZ ESCOBAR','900385',NULL,'DOCUMENTO DE IDENTIDAD','foto.png','frente.png','dorso.png','PRY','PARAGUAYA','06/02/1958','25/08/2026','25/08/2016','M','MASCULINO','CASADO','38009871962064','2025-03-23 23:14:48','2025-03-23 23:48:35',13,NULL,26,NULL,''),(223,'ANTOLIANO','BENITEZ ESCOBAR','900385',NULL,'DOCUMENTO DE IDENTIDAD','foto.png','frente.png','dorso.png','PRY','PARAGUAYA','06/02/1958','25/08/2026','25/08/2016','M','MASCULINO','CASADO','38009871962064','2025-03-23 23:15:14','2025-03-23 23:48:41',15,NULL,26,NULL,NULL),(224,'ANTOLIANO','BENITEZ ESCOBAR','900385',NULL,'DOCUMENTO DE IDENTIDAD','foto.png','frente.png','dorso.png','PRY','PARAGUAYA','06/02/1958','25/08/2026','25/08/2016','M','MASCULINO','CASADO','38009871962064','2025-03-23 23:49:07',NULL,14,NULL,26,NULL,''),(225,'ANTOLIANO','BENITEZ ESCOBAR','900385',NULL,'DOCUMENTO DE IDENTIDAD','foto.png','frente.png','dorso.png','PRY','PARAGUAYA','06/02/1958','25/08/2026','25/08/2016','M','MASCULINO','CASADO','38009871962064','2025-03-24 00:03:15','2025-03-24 00:03:39',12,NULL,26,NULL,''),(226,'ANTOLIANO','BENITEZ ESCOBAR','900385',NULL,'DOCUMENTO DE IDENTIDAD','foto.png','frente.png','dorso.png','PRY','PARAGUAYA','06/02/1958','25/08/2026','25/08/2016','M','MASCULINO','CASADO','38009871962064','2025-03-24 00:04:13','2025-03-24 00:22:37',15,NULL,26,NULL,NULL),(227,'ANTOLIANO','BENITEZ ESCOBAR','900385',NULL,'DOCUMENTO DE IDENTIDAD','foto.png','frente.png','dorso.png','PRY','PARAGUAYA','06/02/1958','25/08/2026','25/08/2016','M','MASCULINO','CASADO','38009871962064','2025-03-24 00:22:43','2025-03-24 10:46:21',10,NULL,26,NULL,''),(228,'ANTOLIANO','BENITEZ ESCOBAR','900385',NULL,'DOCUMENTO DE IDENTIDAD','foto.png','frente.png','dorso.png','PRY','PARAGUAYA','06/02/1958','25/08/2026','25/08/2016','M','MASCULINO','CASADO','38009871962064','2025-03-24 10:46:29',NULL,10,NULL,26,NULL,''),(229,'JUANA ROSSANA','CABRERA RUIZ','5082697',NULL,'DOCUMENTO DE IDENTIDAD','foto.png','frente.png','dorso.png','PRY','Paraguay','23/06/1997','23/05/2026',NULL,'F','FEMENINO',NULL,NULL,'2025-03-24 10:53:23','2025-03-24 11:03:13',13,NULL,26,NULL,''),(230,'JUANA ROSSANA','CABRERA RUIZ','5082697',NULL,'DOCUMENTO DE IDENTIDAD','foto.png','frente.png','dorso.png','PRY','Paraguay','23/06/1997','23/05/2026',NULL,'F','FEMENINO',NULL,NULL,'2025-03-24 11:03:29','2025-03-24 11:05:59',15,NULL,26,NULL,NULL),(231,'JUANA ROSSANA','CABRERA RUIZ','5082697',NULL,'DOCUMENTO DE IDENTIDAD','foto.png','frente.png','dorso.png','PRY','Paraguay','23/06/1997','23/05/2026',NULL,'F','FEMENINO',NULL,NULL,'2025-03-24 11:08:52','2025-03-24 11:37:13',15,NULL,26,NULL,NULL),(232,'JUANA ROSSANA','CABRERA RUIZ','5082697',NULL,'DOCUMENTO DE IDENTIDAD','foto.png','frente.png','dorso.png','PRY','Paraguay','23/06/1997','23/05/2026',NULL,'F','FEMENINO',NULL,NULL,'2025-03-24 11:36:33','2025-03-24 11:37:15',15,NULL,26,NULL,NULL),(233,'JUANA ROSSANA','CABRERA RUIZ','5082697',NULL,'DOCUMENTO DE IDENTIDAD','foto.png','frente.png','dorso.png','PRY','Paraguay','23/06/1997','23/05/2026',NULL,'F','FEMENINO',NULL,NULL,'2025-03-24 11:38:23','2025-03-24 11:41:26',15,NULL,26,NULL,NULL),(234,'JUANA ROSSANA','CABRERA RUIZ','5082697',NULL,'DOCUMENTO DE IDENTIDAD','foto.png','frente.png','dorso.png','PRY','Paraguay','23/06/1997','23/05/2026',NULL,'F','FEMENINO',NULL,NULL,'2025-03-24 11:39:46','2025-03-24 11:41:25',15,NULL,26,NULL,NULL),(235,'JUANA ROSSANA','CABRERA RUIZ','5082697',NULL,'DOCUMENTO DE IDENTIDAD','foto.png','frente.png','dorso.png','PRY','Paraguay','23/06/1997','23/05/2026',NULL,'F','FEMENINO',NULL,NULL,'2025-03-24 11:41:53','2025-03-24 11:42:06',10,NULL,26,NULL,''),(236,'JUANA ROSSANA','CABRERA RUIZ','5082697',NULL,'DOCUMENTO DE IDENTIDAD','foto.png','frente.png','dorso.png','PRY','Paraguay','23/06/1997','23/05/2026',NULL,'F','FEMENINO',NULL,NULL,'2025-03-25 12:52:08',NULL,15,NULL,26,NULL,NULL);
/*!40000 ALTER TABLE `visitas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `visitas_datos_puesto`
--

DROP TABLE IF EXISTS `visitas_datos_puesto`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `visitas_datos_puesto` (
  `id` int NOT NULL AUTO_INCREMENT,
  `id_visita` int NOT NULL,
  `transaction_id` varchar(100) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT NULL,
  `computer_name` varchar(100) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT NULL,
  `user_name` varchar(100) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT NULL,
  `sdk_version` varchar(100) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT NULL,
  `file_version` varchar(100) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT NULL,
  `device_type` varchar(100) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT NULL,
  `device_number` varchar(100) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT NULL,
  `device_abel_number` varchar(100) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`,`id_visita`)
) ENGINE=InnoDB AUTO_INCREMENT=199 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `visitas_datos_puesto`
--

LOCK TABLES `visitas_datos_puesto` WRITE;
/*!40000 ALTER TABLE `visitas_datos_puesto` DISABLE KEYS */;
INSERT INTO `visitas_datos_puesto` VALUES (49,81,'24202f7b-f031-4e1c-8c19-8c0266dcc163','DESKTOP-LDCO92T','JOSUE','6.8.0.6084','6.8','7027 (OV 5Mp)','0x089FC582','338J2283','2023-09-26 01:43:48'),(50,82,'1','24202f7b-f031-4e1c-8c19-8c0266dcc163','DESKTOP-LDCO92T','JOSUE','6.8.0.6084','6.8','7027 (OV 5Mp)','0x089FC582','2023-09-26 02:35:36'),(51,83,'1','24202f7b-f031-4e1c-8c19-8c0266dcc163','DESKTOP-LDCO92T','JOSUE','6.8.0.6084','6.8','7027 (OV 5Mp)','0x089FC582','2023-09-26 04:10:37'),(52,84,'1','24202f7b-f031-4e1c-8c19-8c0266dcc163','DESKTOP-LDCO92T','JOSUE','6.8.0.6084','6.8','7027 (OV 5Mp)','0x089FC582','2023-09-26 04:12:00'),(53,85,'24202f7b-f031-4e1c-8c19-8c0266dcc163','DESKTOP-LDCO92T','JOSUE','6.8.0.6084','6.8','7027 (OV 5Mp)','0x089FC582','338J2283','2023-09-26 04:25:35'),(54,86,'1',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2023-12-18 10:41:51'),(55,87,'1',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2023-12-18 10:44:54'),(56,88,'1',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2023-12-18 13:20:08'),(57,89,'1',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2023-12-19 17:37:09'),(58,90,'1',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2023-12-19 17:37:37'),(59,91,'cf0e2342-6a28-42a8-b390-017f626f368f','DESKTOP-EKHR975','Acer','6.9.0.6210','6.9','72x3 (OV 5.1 Mp)','0x109D6799','7E5774BA1548','2024-01-02 16:31:02'),(60,92,'84e7b6db-9d26-4cde-9f15-6451bbdd2619','DESKTOP-EKHR975','Acer','6.9.0.6210','6.9','72x3 (OV 5.1 Mp)','0x109D6799','7E5774BA1548','2024-01-02 16:45:53'),(61,93,'c227b8b9-2f67-4911-bf91-1434b7df7ab7','DESKTOP-EKHR975','Acer','6.9.0.6210','6.9','72x3 (OV 5.1 Mp)','0x109D6799','7E5774BA1548','2024-01-02 16:47:01'),(62,94,'a88abf13-8406-44e6-89fc-b035d0d23b26','MSI','aldo-','6.8.0.6084','6.8','72x3 (OV 5.1 Mp)','0x109D6799','7E5774BA1548','2024-02-08 12:37:39'),(63,95,'2103b309-2ad0-467d-abfb-4c0f25a758d8','MSI','aldo-','6.8.0.6084','6.8','72x3 (OV 5.1 Mp)','0x109D6799','7E5774BA1548','2024-02-08 12:38:52'),(64,96,'c5377c1b-dce4-48d1-8391-dfa5e395edd2','MSI','aldo-','6.8.0.6084','6.8','72x3 (OV 5.1 Mp)','0x109D6799','7E5774BA1548','2024-02-08 14:15:00'),(65,97,'e0a0c855-334e-4f02-a69a-fc53c1d53c16','MSI','aldo-','6.8.0.6084','6.8','72x3 (OV 5.1 Mp)','0x109D6799','7E5774BA1548','2024-02-08 14:19:33'),(66,98,'0fbc870a-784c-40cb-92bf-00b4ae2cadab','MSI','aldo-','6.8.0.6084','6.8','72x3 (OV 5.1 Mp)','0x109D6799','7E5774BA1548','2024-02-08 14:23:00'),(67,99,'7dfc8183-30d7-492b-b815-8bcb009bc40c','MSI','aldo-','6.8.0.6084','6.8','72x3 (OV 5.1 Mp)','0x109D6799','7E5774BA1548','2024-02-08 14:29:39'),(68,100,'49eff971-c392-477c-b2d8-4e46644e8cf5','MSI','aldo-','6.8.0.6084','6.8','72x3 (OV 5.1 Mp)','0x109D6799','7E5774BA1548','2024-02-08 14:32:07'),(69,101,'d7f2b3ac-8b9d-44b7-a487-1ce4b2491854','MSI','aldo-','6.8.0.6084','6.8','72x3 (OV 5.1 Mp)','0x109D6799','7E5774BA1548','2024-02-08 14:34:25'),(70,102,'e83b8c73-e4f4-4c11-95f5-5a95a33bb5e4','MSI','aldo-','6.8.0.6084','6.8','72x3 (OV 5.1 Mp)','0x109D6799','7E5774BA1548','2024-02-08 14:43:00'),(71,103,'7939ce48-8fd2-4b1d-903c-b0d14daecd15','MSI','aldo-','6.8.0.6084','6.8','72x3 (OV 5.1 Mp)','0x109D6799','7E5774BA1548','2024-02-08 15:31:15'),(72,104,'1',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2024-02-09 16:59:39'),(73,105,'08a2f300-14f2-481b-a9a8-3c787ef9d66d','MSI','aldo-','6.8.0.6084','6.8','72x3 (OV 5.1 Mp)','0x109D6799','7E5774BA1548','2024-02-16 11:14:51'),(74,106,'ce2cb06e-937f-421c-8a9e-e3a19f012063','MSI','aldo-','6.8.0.6084','6.8','72x3 (OV 5.1 Mp)','0x109D6799','7E5774BA1548','2024-02-16 12:37:17'),(75,107,'23e74982-600a-40f9-88c6-24a87e0fdd19','MSI','aldo-','6.8.0.6084','6.8','72x3 (OV 5.1 Mp)','0x109D6799','7E5774BA1548','2024-02-16 13:31:27'),(76,108,'0e2c0a72-76bd-4049-8108-eb2084506c69','MSI','aldo-','6.8.0.6084','6.8','72x3 (OV 5.1 Mp)','0x109D6799','7E5774BA1548','2024-02-16 13:32:20'),(77,109,'89d176a9-c19a-4347-993f-b0ee8da9384c','MSI','aldo-','6.8.0.6084','6.8','72x3 (OV 5.1 Mp)','0x109D6799','7E5774BA1548','2024-02-16 13:50:17'),(78,110,'92b2c421-e831-48ab-811b-7bb91790f7b2','MSI','aldo-','6.8.0.6084','6.8','72x3 (OV 5.1 Mp)','0x109D6799','7E5774BA1548','2024-02-16 13:51:49'),(79,111,'1',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2024-02-20 15:08:35'),(80,112,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2024-02-27 15:27:05'),(81,113,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2024-03-13 14:23:13'),(82,114,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2024-03-13 14:26:58'),(83,115,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2024-03-13 14:34:31'),(84,116,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2024-03-13 14:39:07'),(85,117,'1',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2024-03-13 16:14:15'),(86,118,'1',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2024-03-13 16:19:07'),(87,119,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2024-03-25 15:07:21'),(88,120,'1',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2024-03-25 15:16:40'),(89,121,'1',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2024-03-25 15:18:52'),(90,122,'1',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2024-03-25 15:19:05'),(91,123,'1',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2024-06-27 12:38:47'),(92,124,'1',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2024-07-04 15:07:00'),(93,125,'2b9c359c-161e-4587-9021-4e5d787239c8','LAPTOP-4NMG90VP','Usuario','6.8.0.6084','6.8','70x4.115M (Micron 3.1)','0x052B649F','386H2424','2024-08-05 10:38:24'),(94,126,'2b9c359c-161e-4587-9021-4e5d787239c8','LAPTOP-4NMG90VP','Usuario','6.8.0.6084','6.8','70x4.115M (Micron 3.1)','0x052B649F','386H2424','2024-08-05 10:40:49'),(95,127,'c06bafd9-4c99-4a8c-b4a6-0fda5195be3f','MSI','aldo-','6.8.0.6084','6.8','72x3 (OV 5.1 Mp)','0x109D6799','7E5774BA1548','2024-08-05 10:43:31'),(96,128,'2b9c359c-161e-4587-9021-4e5d787239c8','LAPTOP-4NMG90VP','Usuario','6.8.0.6084','6.8','70x4.115M (Micron 3.1)','0x052B649F','386H2424','2024-08-05 12:04:11'),(97,129,'2b9c359c-161e-4587-9021-4e5d787239c8','LAPTOP-4NMG90VP','Usuario','6.8.0.6084','6.8','70x4.115M (Micron 3.1)','0x052B649F','386H2424','2024-08-05 12:53:24'),(98,130,'1',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2024-08-23 11:19:24'),(99,131,'2b9c359c-161e-4587-9021-4e5d787239c8','LAPTOP-4NMG90VP','Usuario','6.8.0.6084','6.8','70x4.115M (Micron 3.1)','0x052B649F','386H2424','2024-08-26 10:13:18'),(100,132,'2b9c359c-161e-4587-9021-4e5d787239c8','LAPTOP-4NMG90VP','Usuario','6.8.0.6084','6.8','70x4.115M (Micron 3.1)','0x052B649F','386H2424','2024-08-26 10:14:26'),(101,133,'2b9c359c-161e-4587-9021-4e5d787239c8','LAPTOP-4NMG90VP','Usuario','6.8.0.6084','6.8','70x4.115M (Micron 3.1)','0x052B649F','386H2424','2024-08-26 10:20:38'),(102,134,'1',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2024-08-28 15:57:09'),(103,135,'1',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2024-08-28 15:59:53'),(104,136,'1',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2024-08-28 16:15:18'),(105,141,'1',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2024-08-28 17:30:37'),(106,144,'1',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2024-08-28 17:54:24'),(107,145,'1',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2024-08-28 17:55:38'),(108,146,'1',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2024-08-29 11:26:35'),(109,147,'2b9c359c-161e-4587-9021-4e5d787239c8','LAPTOP-4NMG90VP','Usuario','6.8.0.6084','6.8','70x4.115M (Micron 3.1)','0x052B649F','386H2424','2024-08-30 10:47:31'),(110,148,'1',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2024-08-30 10:48:46'),(111,149,'2b9c359c-161e-4587-9021-4e5d787239c8','LAPTOP-4NMG90VP','Usuario','6.8.0.6084','6.8','70x4.115M (Micron 3.1)','0x052B649F','386H2424','2024-09-05 20:59:22'),(112,150,'1',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2024-09-05 21:00:28'),(113,151,'2b9c359c-161e-4587-9021-4e5d787239c8','LAPTOP-4NMG90VP','Usuario','6.8.0.6084','6.8','70x4.115M (Micron 3.1)','0x052B649F','386H2424','2024-10-02 14:25:29'),(114,152,'2b9c359c-161e-4587-9021-4e5d787239c8','LAPTOP-4NMG90VP','Usuario','6.8.0.6084','6.8','70x4.115M (Micron 3.1)','0x052B649F','386H2424','2025-02-17 20:45:21'),(115,153,'1',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2025-02-22 21:20:49'),(116,154,'1',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2025-02-23 00:15:52'),(117,155,'1',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2025-02-23 00:32:57'),(118,156,'1',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2025-02-23 00:36:11'),(119,157,'1',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2025-02-23 00:41:52'),(120,158,'1',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2025-02-23 00:47:16'),(121,159,'1',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2025-02-23 00:48:32'),(122,160,'1',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2025-02-23 00:49:30'),(123,161,'1',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2025-02-23 00:54:05'),(124,162,'1',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2025-02-23 00:55:35'),(125,163,'1',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2025-02-24 10:30:31'),(126,164,'1',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2025-02-24 10:34:32'),(127,165,'1',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2025-02-24 10:35:28'),(128,166,'1',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2025-02-24 11:08:26'),(129,167,'1',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2025-02-24 11:11:48'),(130,168,'1',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2025-02-24 11:16:46'),(131,169,'1',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2025-02-24 11:20:20'),(132,170,'1',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2025-02-24 11:25:17'),(133,171,'1',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2025-02-24 11:29:22'),(134,172,'1',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2025-02-24 11:30:05'),(135,173,'1',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2025-02-24 11:36:35'),(136,174,'1',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2025-02-24 11:49:28'),(137,175,'1',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2025-02-24 11:51:37'),(138,176,'1',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2025-02-24 12:19:06'),(139,177,'1',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2025-02-24 12:21:42'),(140,178,'1',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2025-02-24 12:23:47'),(141,179,'1',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2025-02-24 12:42:56'),(142,180,'2b9c359c-161e-4587-9021-4e5d787239c8','LAPTOP-4NMG90VP','Usuario','6.8.0.6084','6.8','70x4.115M (Micron 3.1)','0x052B649F','386H2424','2025-02-25 16:16:24'),(143,181,'94799094-40f1-48b0-974c-5a32d0885ee1','MSI','aldo-','6.8.0.6084','6.8','72x3 (OV 5.1 Mp)','0x109D6799','7E5774BA1548','2025-02-25 16:17:49'),(144,182,'1f711cee-ea15-4c7c-9ea2-7829a1d553e1','MSI','aldo-','6.8.0.6084','6.8','72x3 (OV 5.1 Mp)','0x109D6799','7E5774BA1548','2025-02-25 16:21:07'),(145,183,'1',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2025-02-27 16:41:40'),(146,184,'1',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2025-02-27 16:44:01'),(147,185,'1',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2025-02-27 16:46:42'),(148,186,'1',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2025-02-28 10:22:22'),(149,187,'1',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2025-02-28 10:23:50'),(150,188,'1',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2025-02-28 10:25:05'),(151,189,'1',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2025-02-28 10:26:23'),(152,190,'1',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2025-02-28 10:33:13'),(153,191,'1',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2025-02-28 10:34:16'),(154,192,'1',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2025-02-28 11:17:21'),(155,193,'1',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2025-02-28 11:24:13'),(156,194,'2b9c359c-161e-4587-9021-4e5d787239c8','LAPTOP-4NMG90VP','Usuario','6.8.0.6084','6.8','70x4.115M (Micron 3.1)','0x052B649F','386H2424','2025-03-13 17:08:56'),(157,195,'2b9c359c-161e-4587-9021-4e5d787239c8','LAPTOP-4NMG90VP','Usuario','6.8.0.6084','6.8','70x4.115M (Micron 3.1)','0x052B649F','386H2424','2025-03-14 11:19:33'),(158,196,'1',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2025-03-17 11:08:50'),(159,197,'2b9c359c-161e-4587-9021-4e5d787239c8','LAPTOP-4NMG90VP','Usuario','6.8.0.6084','6.8','70x4.115M (Micron 3.1)','0x052B649F','386H2424','2025-03-17 11:57:59'),(160,198,'2b9c359c-161e-4587-9021-4e5d787239c8','LAPTOP-4NMG90VP','Usuario','6.8.0.6084','6.8','70x4.115M (Micron 3.1)','0x052B649F','386H2424','2025-03-17 12:25:32'),(161,199,'2b9c359c-161e-4587-9021-4e5d787239c8','LAPTOP-4NMG90VP','Usuario','6.8.0.6084','6.8','70x4.115M (Micron 3.1)','0x052B649F','386H2424','2025-03-17 12:26:17'),(162,200,'1',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2025-03-17 12:27:11'),(163,201,'1',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2025-03-17 12:29:33'),(164,202,'1',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2025-03-17 12:39:22'),(165,203,'1',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2025-03-17 12:40:57'),(166,204,'1',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2025-03-17 12:49:33'),(167,205,'1',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2025-03-17 12:58:32'),(168,206,'1',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2025-03-17 13:07:33'),(169,207,'1',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2025-03-17 13:08:42'),(170,208,'2b9c359c-161e-4587-9021-4e5d787239c8','LAPTOP-4NMG90VP','Usuario','6.8.0.6084','6.8','70x4.115M (Micron 3.1)','0x052B649F','386H2424','2025-03-22 22:42:21'),(171,209,'1',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2025-03-22 22:53:20'),(172,210,'1',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2025-03-22 23:07:58'),(173,211,'1',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2025-03-22 23:15:02'),(174,212,'1',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2025-03-22 23:20:08'),(175,213,'1',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2025-03-22 23:39:42'),(176,214,'1',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2025-03-22 23:55:54'),(177,215,'1',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2025-03-22 23:58:26'),(178,216,'5dd7dcf4-bd05-4777-bfc7-d39d35b6e3d8','MSI','aldo-','6.8.0.6084','6.8','72x3 (OV 5.1 Mp)','0x109D6799','7E5774BA1548','2025-03-23 16:10:41'),(179,217,'5d6ae6d7-f38a-47e3-a14d-5734a48573f2','MSI','aldo-','7.5.0.7062','7.5','72x3 (OV 5.1 Mp)','0x109D6799','7E5774BA1548','2025-03-23 22:18:43'),(180,218,'bc2b3ae5-77c2-4662-9fa0-b23e810badbc','MSI','aldo-','7.5.0.7062','7.5','72x3 (OV 5.1 Mp)','0x109D6799','7E5774BA1548','2025-03-23 22:44:08'),(181,219,'9b282e3e-00a1-4429-aa88-8b9bf02ad9ae','MSI','aldo-','7.5.0.7062','7.5','72x3 (OV 5.1 Mp)','0x109D6799','7E5774BA1548','2025-03-23 22:45:05'),(182,220,'7c19471f-f6c4-42cc-9958-45e7d579eaa2','MSI','aldo-','7.5.0.7062','7.5','72x3 (OV 5.1 Mp)','0x109D6799','7E5774BA1548','2025-03-23 23:06:15'),(183,221,'7c19471f-f6c4-42cc-9958-45e7d579eaa2','MSI','aldo-','7.5.0.7062','7.5','72x3 (OV 5.1 Mp)','0x109D6799','7E5774BA1548','2025-03-23 23:13:24'),(184,222,'07ba2926-2f59-421f-989f-57e9995fec6d','MSI','aldo-','7.5.0.7062','7.5','72x3 (OV 5.1 Mp)','0x109D6799','7E5774BA1548','2025-03-23 23:14:48'),(185,223,'d26da054-b3c7-4777-883b-252495919d37','MSI','aldo-','7.5.0.7062','7.5','72x3 (OV 5.1 Mp)','0x109D6799','7E5774BA1548','2025-03-23 23:15:14'),(186,224,'2907e848-c10a-4c63-bf73-28483554c1ea','MSI','aldo-','7.5.0.7062','7.5','72x3 (OV 5.1 Mp)','0x109D6799','7E5774BA1548','2025-03-23 23:49:07'),(187,225,'aba2d068-ba24-4d4b-8a53-a9174bd876c3','MSI','aldo-','7.5.0.7062','7.5','72x3 (OV 5.1 Mp)','0x109D6799','7E5774BA1548','2025-03-24 00:03:15'),(188,226,'df4db112-564e-4269-80f5-bbb751517017','MSI','aldo-','7.5.0.7062','7.5','72x3 (OV 5.1 Mp)','0x109D6799','7E5774BA1548','2025-03-24 00:04:13'),(189,227,'541a2b5c-9c1d-461d-b58d-42224cb5259b','MSI','aldo-','7.5.0.7062','7.5','72x3 (OV 5.1 Mp)','0x109D6799','7E5774BA1548','2025-03-24 00:22:43'),(190,228,'1c4f851c-dac1-4bb9-a64d-db00a0022654','MSI','aldo-','7.5.0.7062','7.5','72x3 (OV 5.1 Mp)','0x109D6799','7E5774BA1548','2025-03-24 10:46:29'),(191,229,'2b9c359c-161e-4587-9021-4e5d787239c8','LAPTOP-4NMG90VP','Usuario','6.8.0.6084','6.8','70x4.115M (Micron 3.1)','0x052B649F','386H2424','2025-03-24 10:53:23'),(192,230,'2b9c359c-161e-4587-9021-4e5d787239c8','LAPTOP-4NMG90VP','Usuario','6.8.0.6084','6.8','70x4.115M (Micron 3.1)','0x052B649F','386H2424','2025-03-24 11:03:29'),(193,231,'2b9c359c-161e-4587-9021-4e5d787239c8','LAPTOP-4NMG90VP','Usuario','6.8.0.6084','6.8','70x4.115M (Micron 3.1)','0x052B649F','386H2424','2025-03-24 11:08:52'),(194,232,'2b9c359c-161e-4587-9021-4e5d787239c8','LAPTOP-4NMG90VP','Usuario','6.8.0.6084','6.8','70x4.115M (Micron 3.1)','0x052B649F','386H2424','2025-03-24 11:36:33'),(195,233,'2b9c359c-161e-4587-9021-4e5d787239c8','LAPTOP-4NMG90VP','Usuario','6.8.0.6084','6.8','70x4.115M (Micron 3.1)','0x052B649F','386H2424','2025-03-24 11:38:23'),(196,234,'2b9c359c-161e-4587-9021-4e5d787239c8','LAPTOP-4NMG90VP','Usuario','6.8.0.6084','6.8','70x4.115M (Micron 3.1)','0x052B649F','386H2424','2025-03-24 11:39:46'),(197,235,'2b9c359c-161e-4587-9021-4e5d787239c8','LAPTOP-4NMG90VP','Usuario','6.8.0.6084','6.8','70x4.115M (Micron 3.1)','0x052B649F','386H2424','2025-03-24 11:41:53'),(198,236,'2b9c359c-161e-4587-9021-4e5d787239c8','LAPTOP-4NMG90VP','Usuario','6.8.0.6084','6.8','70x4.115M (Micron 3.1)','0x052B649F','386H2424','2025-03-25 12:52:08');
/*!40000 ALTER TABLE `visitas_datos_puesto` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping routines for database 'enter'
--
/*!50003 DROP PROCEDURE IF EXISTS `sp_actualizar_tarjeta` */;
ALTER DATABASE `enter` CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_AUTO_VALUE_ON_ZERO' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_actualizar_tarjeta`(IN `userId` INT, IN `nuevoActivo` VARCHAR(5))
BEGIN
    
    DECLARE activoInt INT;
    IF nuevoActivo = 'true' THEN
        SET activoInt = 1;
    ELSE
        SET activoInt = 0;
    END IF;
    
    
    IF (SELECT id_rol FROM usuarios WHERE id = userId) = 1 THEN
        
        UPDATE usuarios SET activo = activoInt WHERE id = userId;
    ELSE
        
        SELECT 'El usuario no tiene el rol necesario para cambiar el estado.';
    END IF;
    
    
    IF (SELECT id_rol FROM usuarios WHERE id = userId) = 1 THEN
        
        UPDATE usuarios SET activo = activoInt;
    END IF;
    
    SELECT 'Se han actualizado los estados de los usuarios correctamente.';
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
ALTER DATABASE `enter` CHARACTER SET latin1 COLLATE latin1_swedish_ci ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_dashboard_cabecera_list` */;
ALTER DATABASE `enter` CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_AUTO_VALUE_ON_ZERO' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_dashboard_cabecera_list`()
BEGIN

	DECLARE errno SMALLINT UNSIGNED DEFAULT 31001;
	DECLARE errmsg VARCHAR(100);

	SELECT
	
	
	
	(SELECT COUNT(id) FROM usuarios_marcacion WHERE entrada is not null AND salida is null AND CAST(entrada AS DATE) = CURDATE()) AS guardiasActivos,

	(SELECT COUNT(id) FROM visitas WHERE CAST(entrada AS DATE) = CURDATE() AND entrada is not null AND salida is null) AS visitasPermanecen,
	(SELECT COUNT(id) FROM visitas WHERE CAST(entrada AS DATE) = CURDATE() AND entrada is not null AND salida is not null) AS salidasDia,
	(SELECT COUNT(id) FROM visitas WHERE CAST(entrada AS DATE) = CURDATE() ) AS ingresosDia;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
ALTER DATABASE `enter` CHARACTER SET latin1 COLLATE latin1_swedish_ci ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_dashboard_dependencia` */;
ALTER DATABASE `enter` CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_AUTO_VALUE_ON_ZERO' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_dashboard_dependencia`(IN `v_user` INT, IN `v_marcacion` VARCHAR(50))
BEGIN

	DECLARE errno SMALLINT UNSIGNED DEFAULT 31001;
	DECLARE errmsg VARCHAR(100);

	SELECT COUNT(t1.id) AS cantidad,
	t2.nombre AS name,
	t2.color
	FROM visitas t1
		LEFT JOIN dependencias t2 ON t1.id_dependencia = t2.id
	WHERE CAST(t1.entrada AS DATE) = CURDATE() 
		AND IFNULL(v_marcacion,'ALL') like 
			CASE WHEN v_marcacion = 'Entrada' THEN 'Entrada'
			WHEN v_marcacion = 'Salida' AND t1.entrada IS NOT NULL AND t1.salida IS NOT NULL THEN 'Salida'
			WHEN v_marcacion = 'Permanecen' AND t1.entrada IS NOT NULL AND t1.salida IS NULL THEN 'Permanecen'
			ELSE 'ALL' END
	GROUP BY t2.nombre, t2.color;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
ALTER DATABASE `enter` CHARACTER SET latin1 COLLATE latin1_swedish_ci ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_dashboard_visita_list` */;
ALTER DATABASE `enter` CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_AUTO_VALUE_ON_ZERO' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_dashboard_visita_list`()
BEGIN

	DECLARE errno SMALLINT UNSIGNED DEFAULT 31001;
	DECLARE errmsg VARCHAR(100);
	
	SELECT 
	t1.id AS idVisita,
	t1.nombre,
	t1.apellido,
	t1.nro_documento AS documento,
	t1.tipo_documento AS tipoDocumento,
	t1.foto,
	t1.imagen_frente AS fotoCedulaFrente,
	t1.imagen_dorso AS fotoCedulaDorso,
	
	t1.nacionalidad,
	DATE_FORMAT(t1.entrada, '%d-%m-%Y %h:%i:%s') AS entrada,
	DATE_FORMAT(t1.salida, '%d-%m-%Y %h:%i:%s') AS salida,
	CASE WHEN t1.entrada IS NOT NULL AND t1.salida IS NULL THEN 'Entrada' 
		WHEN t1.entrada IS NOT NULL AND t1.salida IS NOT NULL THEN 'Salida' 
		WHEN t1.entrada IS NULL AND t1.salida IS NULL THEN 'Sin Marcacion'
		ELSE 'Sin Entrada' END AS marcacion
	FROM visitas t1
	ORDER BY  t1.entrada DESC LIMIT 10;
	
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
ALTER DATABASE `enter` CHARACTER SET latin1 COLLATE latin1_swedish_ci ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_dependencias_inactive` */;
ALTER DATABASE `enter` CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_AUTO_VALUE_ON_ZERO' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_dependencias_inactive`(IN `v_idUser` INT, IN `v_id` INT)
BEGIN
			
	DECLARE errno SMALLINT UNSIGNED DEFAULT 31001;
	DECLARE errmsg VARCHAR(100);	

	IF NOT EXISTS (SELECT id FROM usuarios WHERE id = v_idUser) THEN 
	SET errmsg = 'El usuario no existe';
	SIGNAL SQLSTATE '45000' SET MYSQL_ERRNO = errno, MESSAGE_TEXT = errmsg;
	
		ELSE
		UPDATE dependencias
		SET 
		estado = 'INACTIVO'
		WHERE id = v_id;
	
	END IF;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
ALTER DATABASE `enter` CHARACTER SET latin1 COLLATE latin1_swedish_ci ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_dependencias_insert` */;
ALTER DATABASE `enter` CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_AUTO_VALUE_ON_ZERO' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_dependencias_insert`(IN `v_idUser` INT, IN `v_nombre` VARCHAR(100), IN `v_color` VARCHAR(100))
BEGIN
			
	DECLARE errno SMALLINT UNSIGNED DEFAULT 31001;
	DECLARE errmsg VARCHAR(100);	

	IF NOT EXISTS (SELECT id FROM usuarios WHERE id = v_idUser) THEN 
	SET errmsg = 'El usuario no existe';
	SIGNAL SQLSTATE '45000' SET MYSQL_ERRNO = errno, MESSAGE_TEXT = errmsg;
	
		ELSE
		INSERT INTO dependencias
		(nombre, color)
		VALUES
		(v_nombre, v_color);
	
		SELECT LAST_INSERT_ID() AS idDepndencia; 
	
	END IF;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
ALTER DATABASE `enter` CHARACTER SET latin1 COLLATE latin1_swedish_ci ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_dependencias_list` */;
ALTER DATABASE `enter` CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_AUTO_VALUE_ON_ZERO' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_dependencias_list`(IN `v_idUser` INT)
BEGIN
			
	DECLARE errno SMALLINT UNSIGNED DEFAULT 31001;
	DECLARE errmsg VARCHAR(100);	

	IF NOT EXISTS (SELECT id FROM usuarios WHERE id = v_idUser) THEN 
	SET errmsg = 'El usuario no existe';
	SIGNAL SQLSTATE '45000' SET MYSQL_ERRNO = errno, MESSAGE_TEXT = errmsg;
	
		ELSE
		SELECT 
		id AS idDependencia,
		nombre, color
		FROM dependencias
		WHERE estado = 'ACTIVO';

	
	END IF;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
ALTER DATABASE `enter` CHARACTER SET latin1 COLLATE latin1_swedish_ci ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_dependencias_update` */;
ALTER DATABASE `enter` CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_AUTO_VALUE_ON_ZERO' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_dependencias_update`(IN `v_idUser` INT, IN `v_id` INT, IN `v_nombre` VARCHAR(255), IN `v_color` VARCHAR(100))
BEGIN
			
	DECLARE errno SMALLINT UNSIGNED DEFAULT 31001;
	DECLARE errmsg VARCHAR(100);	

	IF NOT EXISTS (SELECT id FROM usuarios WHERE id = v_idUser) THEN 
	SET errmsg = 'El usuario no existe';
	SIGNAL SQLSTATE '45000' SET MYSQL_ERRNO = errno, MESSAGE_TEXT = errmsg;
	
		ELSE
		UPDATE dependencias
		SET 
		nombre = v_nombre,
		color = v_color
		WHERE id = v_id;
	
	END IF;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
ALTER DATABASE `enter` CHARACTER SET latin1 COLLATE latin1_swedish_ci ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_grafica_semana_listar` */;
ALTER DATABASE `enter` CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_AUTO_VALUE_ON_ZERO' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_grafica_semana_listar`()
BEGIN

	DECLARE errno SMALLINT UNSIGNED DEFAULT 31001;
	DECLARE errmsg VARCHAR(100);
	
		SELECT 
			'Luneas' AS dia,
			'22' AS entradas,
			'22' AS salidas
	UNION ALL
		SELECT 
			'Martes' AS dia,
			'30' AS entradas,
			'25' AS salidas
	UNION ALL
		SELECT 
			'Miercoles' AS dia,
			'29' AS entradas,
			'29' AS salidas
	UNION ALL
		SELECT 
			'Jueves' AS dia,
			'25' AS entradas,
			'25' AS salidas
	UNION ALL
		SELECT 
			'Viernes' AS dia,
			'20' AS entradas,
			'5' AS salidas
	UNION ALL
		SELECT 
			'Sabado' AS dia,
			'0' AS entradas,
			'0' AS salidas
	UNION ALL
		SELECT 
			'Domingo' AS dia,
			'0' AS entradas,
			'0' AS salidas;
	
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
ALTER DATABASE `enter` CHARACTER SET latin1 COLLATE latin1_swedish_ci ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_marcacion_insert` */;
ALTER DATABASE `enter` CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_AUTO_VALUE_ON_ZERO' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_marcacion_insert`(IN `v_user` INT, IN `v_idDependencia` INT)
BEGIN

	DECLARE errno SMALLINT UNSIGNED DEFAULT 31001;
	DECLARE errmsg VARCHAR(100);
	DECLARE p_id INT;

	IF NOT EXISTS(SELECT id FROM usuarios WHERE id = v_user) THEN
	SET errmsg = 'El usuario no esta registrado';
	SIGNAL SQLSTATE '45000' SET MYSQL_ERRNO = errno, MESSAGE_TEXT = errmsg;

	
	ELSEIF NOT EXISTS(SELECT t1.id FROM usuarios_marcacion t1 JOIN (SELECT MAX(id) AS id FROM usuarios_marcacion WHERE id_usuario = v_user) t2 ON t1.id = t2.id
				WHERE entrada IS NOT NULL AND salida IS NULL) THEN
				
		INSERT INTO usuarios_marcacion
		(id_usuario, entrada, id_dependencia)
		VALUES 
		(v_user, now(), v_idDependencia);
		
		SELECT LAST_INSERT_ID() AS idMarcacion; 
	

	
	ELSEIF EXISTS(SELECT t1.id FROM usuarios_marcacion t1 JOIN (SELECT MAX(id) AS id FROM usuarios_marcacion WHERE id_usuario = v_user) t2 ON t1.id = t2.id
				WHERE entrada IS NOT NULL AND salida IS NULL) THEN
				
		SET p_id = (SELECT t1.id FROM usuarios_marcacion t1 JOIN (SELECT MAX(id) AS id FROM usuarios_marcacion WHERE id_usuario = v_user) t2 ON t1.id = t2.id
				WHERE entrada IS NOT NULL AND salida IS NULL);
				
		UPDATE usuarios_marcacion
		SET 
		salida = now()
		WHERE id = p_id;
		
		SELECT p_id AS idMarcacion;
	
	END IF;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
ALTER DATABASE `enter` CHARACTER SET latin1 COLLATE latin1_swedish_ci ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_marcacion_list` */;
ALTER DATABASE `enter` CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_AUTO_VALUE_ON_ZERO' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_marcacion_list`(IN `v_idRol` INT, IN `v_fechaDesde` DATE, IN `v_fechaHasta` DATE, IN `v_marcacion` VARCHAR(100), IN `v_idDependencia` INT)
BEGIN
    
    IF v_idRol IS NULL AND v_fechaDesde IS NULL AND v_fechaHasta IS NULL AND v_marcacion IS NULL AND v_idDependencia IS NULL THEN
        SET v_idRol = 2;
        SET v_fechaDesde = '1900-01-01';
        SET v_fechaHasta = '2100-01-01';
    END IF;

    SELECT 
        t2.id AS idMarcacion,
        t1.id AS idUsuario,
        t1.nombre,
        t1.apellido,
        t1.documento AS documento,
        t1.foto,
        t1.tipo_documento AS tipoDocumento,
        t1.correo,
        t1.nro_celular AS celular,
        t1.nro_telefono AS telefono,
        t3.id AS idRol,
        t3.nombre AS rol,
        DATE_FORMAT(t2.entrada, '%d-%m-%Y %h:%i:%s') AS entrada,
        DATE_FORMAT(t2.salida, '%d-%m-%Y %h:%i:%s') AS salida,
        CASE 
            WHEN t2.entrada IS NOT NULL AND t2.salida IS NULL THEN 'Entrada' 
            WHEN t2.entrada IS NOT NULL AND t2.salida IS NOT NULL THEN 'Salida' 
            WHEN t2.entrada IS NULL AND t2.salida IS NULL THEN 'Sin Marcacion'
            ELSE 'Sin Entrada' 
        END AS marcacion,
        t4.id AS idDependencia,
        t4.nombre AS dependencia
    FROM 
        usuarios t1
        JOIN usuarios_marcacion t2 ON t1.id = t2.id_usuario
        LEFT JOIN roles t3 ON t1.id_rol = t3.id
        LEFT JOIN dependencias t4 ON t2.id_dependencia = t4.id
    WHERE 
        t1.id_rol LIKE CASE WHEN v_idRol IS NOT NULL THEN v_idRol ELSE '%%' END
        AND t2.entrada BETWEEN v_fechaDesde AND v_fechaHasta
        
    ORDER BY 
        t2.id DESC;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
ALTER DATABASE `enter` CHARACTER SET latin1 COLLATE latin1_swedish_ci ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_puestos_inactive` */;
ALTER DATABASE `enter` CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_AUTO_VALUE_ON_ZERO' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_puestos_inactive`(IN `v_id` INT)
BEGIN

	DECLARE errno SMALLINT UNSIGNED DEFAULT 31001;
	DECLARE errmsg VARCHAR(100);
	
	UPDATE puestos 
	SET
	estado = 'INACTIVO'
	WHERE id = v_id;

END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
ALTER DATABASE `enter` CHARACTER SET latin1 COLLATE latin1_swedish_ci ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_puestos_insert` */;
ALTER DATABASE `enter` CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_AUTO_VALUE_ON_ZERO' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_puestos_insert`(IN `v_descripcion` VARCHAR(100), IN `v_nombre` VARCHAR(100), IN `v_ip` VARCHAR(25), IN `v_puerto` VARCHAR(25), IN `v_url` VARCHAR(255), IN `v_subcarpeta` VARCHAR(100), IN `v_servidor` BOOL, IN `v_tipo` VARCHAR(100), IN `v_ubicacionServidor` VARCHAR(100))
BEGIN

	DECLARE errno SMALLINT UNSIGNED DEFAULT 31001;
	DECLARE errmsg VARCHAR(100);
	
	INSERT INTO puestos 
	(descripcion,
	nombre,
	ip,
	puerto,
	ubicacion,
	subcarpeta,
	servidor,
	tipo,
	ubicacion_servidor)
	VALUES
	(v_descripcion,
	v_nombre,
	v_ip,
	v_puerto,
	v_url,
	v_subcarpeta,
	IFNULL(v_servidor,false),
	v_tipo,
	v_ubicacionServidor);

	SELECT LAST_INSERT_ID() AS idPuesto; 
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
ALTER DATABASE `enter` CHARACTER SET latin1 COLLATE latin1_swedish_ci ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_puestos_list` */;
ALTER DATABASE `enter` CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_AUTO_VALUE_ON_ZERO' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_puestos_list`(IN `v_id` INT)
BEGIN 
	
	SELECT 
	t1.id AS idPuesto,
	t1.descripcion,
	t1.nombre,
	t1.ip AS ipPuesto,
	t1.puerto,
	t1.ubicacion AS ubicacionCarpeta,
	t1.servidor,
	t1.tipo,
	t1.ubicacion_servidor AS ubicacionServidor,
	t1.subcarpeta,
	t1.sistema_operativo,
	t2.id AS idImpresora,
	t2.archivo_principal AS archivoPrincipal,
	t2.archivo_secundario AS archivoSecundario,
	t2.foto,
	t2.imagen_frente AS imagenFrente,
	t2.imagen_dorso AS imagenDorso,
	t2.subcarpeta AS subcarpetaImpresora,
	t1.ubicacion_servidor AS urlServidor
	
	FROM puestos t1
		LEFT JOIN impresoras t2 ON t1.id_impresora = t2.id
	WHERE t1.id like CASE WHEN v_id IS NULL THEN '%%'  ELSE v_id END;
	
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
ALTER DATABASE `enter` CHARACTER SET latin1 COLLATE latin1_swedish_ci ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_puestos_update` */;
ALTER DATABASE `enter` CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_AUTO_VALUE_ON_ZERO' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_puestos_update`(IN `v_id` INT, IN `v_descripcion` VARCHAR(100), IN `v_nombre` VARCHAR(100), IN `v_ip` VARCHAR(25), IN `v_puerto` VARCHAR(25), IN `v_url` VARCHAR(255), IN `v_subcarpeta` VARCHAR(100), IN `v_servidor` BOOL, IN `v_tipo` VARCHAR(100), IN `v_ubicacionServidor` VARCHAR(100))
BEGIN

	DECLARE errno SMALLINT UNSIGNED DEFAULT 31001;
	DECLARE errmsg VARCHAR(100);
	
	UPDATE puestos 
	SET
	descripcion = v_descripcion,
	nombre = v_nombre,
	ip = v_ip,
	puerto = v_puerto,
	ubicacion = v_url,
	subcarpeta = v_subcarpeta,
	servidor = IFNULL(v_servidor, false),
	tipo = v_tipo,
	ubicacion_servidor = v_ubicacionServidor
	WHERE id = v_id;

END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
ALTER DATABASE `enter` CHARACTER SET latin1 COLLATE latin1_swedish_ci ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_puntoatencion_crear` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_puntoatencion_crear`(
    IN p_nombre VARCHAR(200),
    IN p_descripcion TEXT,
    IN p_ubicacion VARCHAR(255),
    IN p_activo TINYINT(1)
)
BEGIN
    INSERT INTO puntoatencion (nombre, descripcion, ubicacion, activo)
    VALUES (p_nombre, p_descripcion, p_ubicacion, p_activo);
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_puntoatencion_editar` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_puntoatencion_editar`(
    IN p_id INT,
    IN p_nombre VARCHAR(200),
    IN p_descripcion TEXT,
    IN p_ubicacion VARCHAR(255),
    IN p_activo TINYINT(1)
)
BEGIN
    UPDATE puntoatencion
    SET nombre = p_nombre,
        descripcion = p_descripcion,
        ubicacion = p_ubicacion,
        activo = p_activo
    WHERE id = p_id;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_puntoatencion_listar` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_puntoatencion_listar`()
BEGIN
    SELECT * FROM puntoatencion WHERE activo = 1;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_rol_list` */;
ALTER DATABASE `enter` CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_AUTO_VALUE_ON_ZERO' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_rol_list`()
BEGIN

	DECLARE errno SMALLINT UNSIGNED DEFAULT 31001;
	DECLARE errmsg VARCHAR(100);

	SELECT id AS idRol, nombre
	FROM roles
	WHERE estado = 'ACTIVO';

END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
ALTER DATABASE `enter` CHARACTER SET latin1 COLLATE latin1_swedish_ci ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_test` */;
ALTER DATABASE `enter` CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_AUTO_VALUE_ON_ZERO' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_test`(IN `v_user` INT)
    COMMENT 'es solo para probar '
BEGIN

	DECLARE errno SMALLINT UNSIGNED DEFAULT 31001;
	DECLARE errmsg VARCHAR(100);

	IF NOT EXISTS(SELECT id FROM usuarios WHERE id = v_user) THEN
	SET errmsg = 'El usuario no esta registrado';
	SIGNAL SQLSTATE '45000' SET MYSQL_ERRNO = errno, MESSAGE_TEXT = errmsg;

	ELSE	
	SELECT 
	t1.id,
	t1.nombre,
	t1.apellido,
	t1.correo,
	t1.documento AS documento,
	t1.tipo_documento AS tipoDocumento,
	t3.id AS idRol,
	t3.nombre AS rol,
	t1.nro_celular AS celular,
	t1.nro_telefono AS telefono,
	DATE_FORMAT(t2.entrada, '%d-%m-%Y %h:%i:%s') AS entrada,
	DATE_FORMAT(t2.salida, '%d-%m-%Y %h:%i:%s') AS salida,
	CASE WHEN t2.entrada IS NOT NULL AND t2.salida IS NULL THEN 'Entrada' 
		WHEN t2.entrada IS NOT NULL AND t2.salida IS NOT NULL THEN 'Salida' 
		WHEN t2.entrada IS NULL AND t2.salida IS NULL THEN 'Sin Marcacion'
		ELSE 'Sin Entrada' END AS marcacion,
	t2.id_dependencia AS idDependencia,
	t4.nombre AS dependencia,
	CASE WHEN t1.id_rol = 1 THEN true ELSE false END AS visitasDia,
	CASE WHEN t1.id_rol = 1 THEN true ELSE false END AS movimientos,
	CASE WHEN t1.id_rol = 1 THEN true ELSE false END AS gestion,
	CASE WHEN t1.id_rol = 1 THEN true ELSE false END AS sistema
	FROM usuarios t1
		LEFT JOIN (SELECT MAX(id) AS id, id_usuario FROM usuarios_marcacion GROUP BY id_usuario) t5 ON t1.id = t5.id_usuario
		LEFT JOIN usuarios_marcacion t2 ON t1.id = t2.id_usuario AND t5.id = t2.id
		LEFT JOIN roles t3 ON t1.id_rol = t3.id
		LEFT JOIN dependencias t4 ON t2.id_dependencia = t4.id 
	WHERE t1.id = v_user;
	
	END IF;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
ALTER DATABASE `enter` CHARACTER SET latin1 COLLATE latin1_swedish_ci ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_tipo_documento_list` */;
ALTER DATABASE `enter` CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_AUTO_VALUE_ON_ZERO' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_tipo_documento_list`()
BEGIN

	DECLARE errno SMALLINT UNSIGNED DEFAULT 31001;
	DECLARE errmsg VARCHAR(100);
	
	SELECT 
	id AS idTipoDocumento,
	nombre AS descripcion,
	codigo
	FROM tipo_documento
	WHERE estado = 'ACTIVO';
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
ALTER DATABASE `enter` CHARACTER SET latin1 COLLATE latin1_swedish_ci ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_tramites_crear` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_tramites_crear`(
    IN p_nombre VARCHAR(100),
    IN p_descripcion TEXT,
    IN p_prioridad ENUM('BAJA', 'MEDIA', 'ALTA'),
    IN p_tiempo_estimado INT
)
BEGIN
    INSERT INTO tramites (nombre, descripcion, prioridad, tiempo_estimado)
    VALUES (p_nombre, p_descripcion, p_prioridad, p_tiempo_estimado);
    
    SELECT LAST_INSERT_ID() AS tramite_id;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_tramites_editar` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_tramites_editar`(
    IN p_id INT,
    IN p_nombre VARCHAR(100),
    IN p_descripcion TEXT,
    IN p_prioridad ENUM('BAJA', 'MEDIA', 'ALTA'),
    IN p_tiempo_estimado INT
)
BEGIN
    UPDATE tramites
    SET nombre = p_nombre,
        descripcion = p_descripcion,
        prioridad = p_prioridad,
        tiempo_estimado = p_tiempo_estimado
    WHERE id = p_id;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_tramites_listar` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_tramites_listar`()
BEGIN
    SELECT * FROM tramites WHERE activo = TRUE ORDER BY prioridad DESC, nombre ASC;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_turnos_crear` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_turnos_crear`( 
    IN p_id_visita INT,
    IN p_id_tramite INT
)
BEGIN
    DECLARE p_codigo_turno VARCHAR(10);
    DECLARE p_tramite VARCHAR(100);

    -- Obtener el nombre del trámite
    SELECT nombre INTO p_tramite FROM tramites WHERE id = p_id_tramite;

    -- Validar que el trámite exista
    IF p_tramite IS NULL THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'El trámite seleccionado no existe o está inactivo.';
    END IF;

    -- Generar código de turno (Ejemplo: AL123 basado en iniciales y los últimos 3 dígitos del documento)
    SET p_codigo_turno = CONCAT(
        LEFT((SELECT nombre FROM visitas WHERE id = p_id_visita LIMIT 1), 1),
        LEFT((SELECT apellido FROM visitas WHERE id = p_id_visita LIMIT 1), 1),
        RIGHT((SELECT nro_documento FROM visitas WHERE id = p_id_visita LIMIT 1), 3)
    );

    -- Insertar nuevo turno con el trámite vinculado
    INSERT INTO turnos (id_visita, id_tramite, tramite, codigo_turno)
    VALUES (p_id_visita, p_id_tramite, p_tramite, p_codigo_turno);

    -- Retornar el ID generado
    SELECT LAST_INSERT_ID() AS turno_id;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_turnos_finalizar` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_turnos_finalizar`(
    IN p_id_turno INT
)
BEGIN
    DECLARE tiempo_espera INT;

    -- Calcular tiempo de espera en minutos
    SET tiempo_espera = TIMESTAMPDIFF(MINUTE, (SELECT fecha_llamado FROM turnos WHERE id = p_id_turno), NOW());

    -- Marcar turno como finalizado y guardar el tiempo de espera
    UPDATE turnos
    SET estado = 'FINALIZADO', fecha_finalizacion = NOW(), tiempo_espera = tiempo_espera
    WHERE id = p_id_turno;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_turnos_listar` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_turnos_listar`(
    IN p_estado ENUM('PENDIENTE', 'ATENDIENDO', 'FINALIZADO', 'CANCELADO'),
    IN p_prioridades VARCHAR(255),  -- Lista de prioridades separadas por comas
    IN p_tramites VARCHAR(255),     -- Lista de ID de trámites separadas por comas
    IN p_box INT
)
BEGIN
    SELECT 
        t.id AS id_turno,
        t.codigo_turno,
        t.estado,
        t.tramite,
        t.fecha_emision,
        t.fecha_llamado,
        t.fecha_finalizacion,
        t.tiempo_espera,
        t.box,
        v.id AS id_visita,
        v.nro_documento,
        v.nombre AS nombre_visitante,
        v.apellido AS apellido_visitante,
        tr.id AS id_tramite,
        tr.nombre AS nombre_tramite,
        tr.prioridad AS prioridad_tramite
    FROM turnos t
    JOIN visitas v ON t.id_visita = v.id
    JOIN tramites tr ON t.id_tramite = tr.id
    WHERE (p_estado IS NULL OR t.estado = p_estado)
      AND (p_prioridades IS NULL OR FIND_IN_SET(tr.prioridad, p_prioridades) > 0)
      AND (p_tramites IS NULL OR FIND_IN_SET(tr.id, p_tramites) > 0)
      AND (p_box IS NULL OR t.box = p_box)
    ORDER BY 
        CASE 
            WHEN t.estado = 'ATENDIENDO' THEN 1
            WHEN t.estado = 'PENDIENTE' THEN 2
            WHEN t.estado = 'FINALIZADO' THEN 3
            WHEN t.estado = 'CANCELADO' THEN 4
        END,
        t.fecha_emision ASC;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_turnos_llamar` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_turnos_llamar`()
BEGIN
    DECLARE turno_id INT;

    -- Obtener el primer turno pendiente
    SELECT id INTO turno_id FROM turnos
    WHERE estado = 'PENDIENTE'
    ORDER BY fecha_emision ASC
    LIMIT 1;

    -- Si hay turnos pendientes, actualizar el estado y la fecha de llamado
    IF turno_id IS NOT NULL THEN
        UPDATE turnos
        SET estado = 'ATENDIENDO', fecha_llamado = NOW()
        WHERE id = turno_id;

        -- Retornar el turno llamado
        SELECT * FROM turnos WHERE id = turno_id;
    ELSE
        -- Si no hay turnos pendientes, devolver un mensaje vacío
        SELECT 'NO HAY TURNOS DISPONIBLES' AS mensaje;
    END IF;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_turnos_obtener_detalle` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_turnos_obtener_detalle`(IN idTurno INT)
BEGIN
    SELECT 
        t.codigo_turno,
        v.nombre,
        v.apellido,
        v.nro_documento,
        t.tramite,
        t.fecha_emision
    FROM turnos t
    JOIN visitas v ON v.id = t.id_visita
    WHERE t.id = idTurno;
end ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_user_activar_desactivar` */;
ALTER DATABASE `enter` CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_AUTO_VALUE_ON_ZERO' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_user_activar_desactivar`(IN `v_user_id` INT, IN `v_estado` VARCHAR(25))
BEGIN
    UPDATE usuarios
    SET estado = v_estado
    WHERE id = v_user_id;
end ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
ALTER DATABASE `enter` CHARACTER SET latin1 COLLATE latin1_swedish_ci ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_user_documentos_update` */;
ALTER DATABASE `enter` CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_AUTO_VALUE_ON_ZERO' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_user_documentos_update`(IN `v_id` INT, IN `v_foto` VARCHAR(255), IN `v_frente` VARCHAR(255), IN `v_dorso` VARCHAR(255))
BEGIN
			
	DECLARE errno SMALLINT UNSIGNED DEFAULT 31001;
	DECLARE errmsg VARCHAR(100);	

	IF NOT EXISTS (SELECT id FROM usuarios WHERE id = v_id) THEN 
	SET errmsg = 'El usuario no existe';
	SIGNAL SQLSTATE '45000' SET MYSQL_ERRNO = errno, MESSAGE_TEXT = errmsg;
	
		ELSE
		UPDATE usuarios 
		SET
		foto = v_foto,
		imagen_frente = v_frente,
		imagen_dorso  = v_dorso
		WHERE id = v_id;
	
	END IF;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
ALTER DATABASE `enter` CHARACTER SET latin1 COLLATE latin1_swedish_ci ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_user_list` */;
ALTER DATABASE `enter` CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_AUTO_VALUE_ON_ZERO' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_user_list`(IN `v_idRol` INT, IN `v_estado` VARCHAR(50))
BEGIN

	DECLARE errno SMALLINT UNSIGNED DEFAULT 31001;
	DECLARE errmsg VARCHAR(100);
	DECLARE urlEndpoint VARCHAR(255) DEFAULT (SELECT 'usuarios/ver-archivo/nro/');
	
	SELECT 
	t1.id AS idUsuario,
	t1.nombre,
	t1.apellido,
	t1.documento AS documento,
	
	t1.tipo_documento AS tipoDocumento,
	t1.correo,
	t1.nro_celular AS celular,
	t1.nro_telefono AS telefono,
	t3.id AS idRol,
	t3.nombre AS rol,
	CONCAT(t4.url_api,urlEndpoint,t1.documento,'/archivo/',t1.foto) AS foto,
	CONCAT(t4.url_api,urlEndpoint,t1.documento,'/archivo/',t1.foto) AS urlFoto,
	t4.url_api, urlEndpoint, t1.documento as doc,  t1.foto as fot
	
	FROM usuarios t1
		LEFT JOIN roles t3 ON t1.id_rol = t3.id
		LEFT JOIN puestos t4 ON t4.id =(SELECT id FROM puestos WHERE servidor = true AND estado = 'ACTIVO' ORDER BY id LIMIT 1)
	WHERE t1.id_rol LIKE CASE WHEN v_idRol IS NOT NULL THEN v_idRol ELSE '%%' END
		AND t1.estado = 'ACTIVO';
	
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
ALTER DATABASE `enter` CHARACTER SET latin1 COLLATE latin1_swedish_ci ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_user_list_create` */;
ALTER DATABASE `enter` CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_AUTO_VALUE_ON_ZERO' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_user_list_create`(IN `v_idRol` INT, IN `v_estado` VARCHAR(50), IN `v_fecha_desde` DATE, IN `v_fecha_hasta` DATE)
BEGIN

    DECLARE errno SMALLINT UNSIGNED DEFAULT 31001;
    DECLARE errmsg VARCHAR(100);
    DECLARE urlEndpoint VARCHAR(255) DEFAULT (SELECT 'usuarios/ver-archivo/nro/');
    
    SELECT 
        t1.id AS idUsuario,
        t1.nombre,
        t1.apellido,
        t1.documento AS documento,
        
        t1.tipo_documento AS tipoDocumento,
        t1.correo,
        t1.nro_celular AS celular,
        t1.nro_telefono AS telefono,
        t3.id AS idRol,
        t3.nombre AS rol,
        CONCAT(t4.url_api, urlEndpoint, t1.documento, '/archivo/', t1.foto) AS foto,
        CONCAT(t4.url_api, urlEndpoint, t1.documento, '/archivo/', t1.foto) AS urlFoto,
        t4.url_api, 
        urlEndpoint, 
        t1.documento AS doc,  
        t1.foto AS foto, 
        DATE_FORMAT(t1.fecha_create, '%Y-%m-%d') as fechacreate,
        t1.estado as estado
        
        
    FROM usuarios t1
        LEFT JOIN roles t3 ON t1.id_rol = t3.id
        LEFT JOIN puestos t4 ON t4.id = (
            SELECT id FROM puestos WHERE servidor = true
            
            ORDER BY id LIMIT 1
        )
    WHERE t1.fecha_create BETWEEN COALESCE(v_fecha_desde, '1000-01-01') AND COALESCE(v_fecha_hasta, '9999-12-31')
        AND t1.estado LIKE CASE WHEN v_estado IS NOT NULL THEN v_estado ELSE '%%' END;

END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
ALTER DATABASE `enter` CHARACTER SET latin1 COLLATE latin1_swedish_ci ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_user_list_rol` */;
ALTER DATABASE `enter` CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_AUTO_VALUE_ON_ZERO' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_user_list_rol`(IN `v_idRol` INT, IN `v_estado` VARCHAR(50))
BEGIN
    DECLARE errno SMALLINT UNSIGNED DEFAULT 31001;
    DECLARE errmsg VARCHAR(100);
    DECLARE urlEndpoint VARCHAR(255) DEFAULT (SELECT 'usuarios/ver-archivo/nro/');
    DECLARE v_fecha_creacion DATE; 

    SELECT 
        t1.id AS idUsuario,
        t1.nombre,
        t1.apellido,
        t1.documento AS documento,
        t1.tipo_documento AS tipoDocumento,
        t1.correo,
        t1.nro_celular AS celular,
        t1.nro_telefono AS telefono,
        t3.id AS idRol,
        t3.nombre AS rol,
        CONCAT(t4.url_api, urlEndpoint, t1.documento, '/archivo/', t1.foto) AS foto,
        CONCAT(t4.url_api, urlEndpoint, t1.documento, '/archivo/', t1.foto) AS urlFoto,
        t4.url_api, urlEndpoint, t1.documento AS doc, t1.foto AS fot

    FROM usuarios t1
        LEFT JOIN roles t3 ON t1.id_rol = t3.id
        LEFT JOIN puestos t4 ON t4.id = (
            SELECT id FROM puestos WHERE servidor = true AND estado = 'ACTIVO' ORDER BY id LIMIT 1
        )
    WHERE 
        t1.id_rol LIKE CASE WHEN v_idRol IS NOT NULL THEN v_idRol ELSE '%%' END
        AND t1.estado LIKE CASE WHEN v_estado IS NOT NULL THEN v_estado ELSE '%%' END
        AND DATE(t1.fecha_create) = CASE WHEN v_fecha_creacion IS NOT NULL THEN v_fecha_creacion ELSE DATE(t1.fecha_create) END;

END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
ALTER DATABASE `enter` CHARACTER SET latin1 COLLATE latin1_swedish_ci ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_user_login` */;
ALTER DATABASE `enter` CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_AUTO_VALUE_ON_ZERO' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_user_login`(IN `v_user` INT)
BEGIN
    DECLARE errno SMALLINT UNSIGNED DEFAULT 31001;
    DECLARE errmsg VARCHAR(100);
    
    IF NOT EXISTS(SELECT id FROM usuarios WHERE id = v_user AND estado = 'ACTIVO') THEN
        SET errmsg = 'El usuario no está registrado o está inactivo';
        SIGNAL SQLSTATE '45000' SET MYSQL_ERRNO = errno, MESSAGE_TEXT = errmsg;
    ELSE    
        SELECT 
            t1.id,
            t1.nombre,
            t1.apellido,
            t1.correo,
            t1.documento AS documento,
            t1.tipo_documento AS tipoDocumento,
            t3.id AS idRol,
            t3.nombre AS rol,
            t1.nro_celular AS celular,
            t1.nro_telefono AS telefono,
            DATE_FORMAT(t2.entrada, '%d-%m-%Y %h:%i:%s') AS entrada,
            DATE_FORMAT(t2.salida, '%d-%m-%Y %h:%i:%s') AS salida,
            CASE 
                WHEN t2.entrada IS NOT NULL AND t2.salida IS NULL THEN 'Entrada' 
                WHEN t2.entrada IS NOT NULL AND t2.salida IS NOT NULL THEN 'Salida' 
                WHEN t2.entrada IS NULL AND t2.salida IS NULL THEN 'Sin Marcacion'
                ELSE 'Sin Entrada' 
            END AS marcacion,
            t2.id_dependencia AS idDependencia,
            t4.nombre AS dependencia,
            CASE 
                WHEN t1.id_rol = 1 THEN TRUE 
                ELSE FALSE 
            END AS visitasDia,
            CASE 
                WHEN t1.id_rol = 1 THEN TRUE 
                ELSE FALSE 
            END AS movimientos,
            CASE 
                WHEN t1.id_rol = 1 THEN TRUE 
                ELSE FALSE 
            END AS gestion,
            CASE 
                WHEN t1.id_rol = 1 THEN TRUE 
                ELSE FALSE 
            END AS sistema
        FROM 
            usuarios t1
            LEFT JOIN (SELECT MAX(id) AS id, id_usuario FROM usuarios_marcacion GROUP BY id_usuario) t5 ON t1.id = t5.id_usuario
            LEFT JOIN usuarios_marcacion t2 ON t1.id = t2.id_usuario AND t5.id = t2.id
            LEFT JOIN roles t3 ON t1.id_rol = t3.id
            LEFT JOIN dependencias t4 ON t2.id_dependencia = t4.id 
        WHERE 
            t1.id = v_user;
    END IF;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
ALTER DATABASE `enter` CHARACTER SET latin1 COLLATE latin1_swedish_ci ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_user_registro_insert` */;
ALTER DATABASE `enter` CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_AUTO_VALUE_ON_ZERO' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_user_registro_insert`(IN `v_documento` VARCHAR(100), IN `v_contrasena` VARCHAR(255), IN `v_nombre` VARCHAR(100), IN `v_apellido` VARCHAR(100), IN `v_idRol` INT, IN `v_idTipoDocumento` INT, IN `v_tipoDocumento` VARCHAR(100), IN `v_correo` VARCHAR(255), IN `v_nroCelular` VARCHAR(50), IN `v_nroTelefono` VARCHAR(50), IN `v_codNacionalidad` VARCHAR(25), IN `v_nacionalidad` VARCHAR(100), IN `v_fechaNacimiento` VARCHAR(25), IN `v_fechaExpiracion` VARCHAR(25), IN `v_fechaEmision` VARCHAR(25), IN `v_sexo` VARCHAR(3), IN `v_estadoCivil` VARCHAR(100), IN `v_user` INT)
BEGIN

	DECLARE errno SMALLINT UNSIGNED DEFAULT 31001;
	DECLARE errmsg VARCHAR(100);

	INSERT INTO usuarios 
	(
	documento,  contrasena, nombre, apellido, 
	id_rol, id_tipo_documento, tipo_documento, 
	correo, nro_celular, nro_telefono,
	cod_nacionalidad, nacionalidad, 
	fecha_nacimiento, fecha_expiracion, fecha_emision,
	cod_sexo, sexo, estado_civil
	)
	VALUES
	(
	v_documento, v_contrasena, v_nombre, v_apellido, 
	v_idRol, v_idTipoDocumento, v_tipoDocumento,
	v_correo, v_nroCelular, v_nroTelefono,
	v_codNacionalidad, v_nacionalidad,
	v_fechaNacimiento, v_fechaExpiracion, v_fechaEmision,
	v_sexo, CASE WHEN v_sexo = 'M' THEN 'MASCULINO' WHEN v_sexo = 'F' THEN 'FEMENINO' ELSE 'OTROS' END, v_estadoCivil
	);

	SELECT LAST_INSERT_ID() AS idUsuario; 

END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
ALTER DATABASE `enter` CHARACTER SET latin1 COLLATE latin1_swedish_ci ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_visitas_buscar_list` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_visitas_buscar_list`(IN `v_documento` VARCHAR(50))
BEGIN

	DECLARE errno SMALLINT UNSIGNED DEFAULT 31001;
	DECLARE errmsg VARCHAR(100);
	DECLARE urlApi VARCHAR(255) DEFAULT (SELECT 'http://localhost:7001/api/visitas/ver-archivo/nro/');
	DECLARE urlServidor VARCHAR(255) DEFAULT (SELECT 'C:/enter/documentos/');
	
	SELECT 
	t1.nombre,
	t1.apellido,
	t1.nro_documento AS documento,
	t1.tipo_documento AS tipoDocumento,
	t1.tipo_documento AS codTipoDocumento, 
	
	t1.foto,
	t1.imagen_frente AS imagenFrente,
	t1.imagen_dorso AS imagenDorso,
	
	CONCAT(urlApi,t1.nro_documento,'/archivo/',foto) AS urlFoto,
	CONCAT(urlApi,t1.nro_documento,'/archivo/',t1.imagen_frente) AS urlImagenFrente,
	CONCAT(urlApi,t1.nro_documento,'/archivo/',t1.imagen_frente) AS urlImagenDorso,
	t1.cod_nacionalidad AS codNacionalidad, 
	t1.nacionalidad,
	t1.fecha_nacimiento AS fechaNacimiento,
	t1.fecha_expiracion AS fechaExpiracionDocumento,
	t1.fecha_emision AS fechaEmision,
	t1.sexo,
	t1.estado_civil AS estadoCivil,
	CONCAT(urlServidor,t1.nro_documento,'/',t1.id,'/') AS url
	FROM visitas t1
	WHERE t1.nro_documento like CASE WHEN v_documento IS NOT NULL THEN v_documento ELSE '%%' END
	ORDER BY t1.id DESC LIMIT 1;
	
end ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_visitas_dashboard` */;
ALTER DATABASE `enter` CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_AUTO_VALUE_ON_ZERO' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_visitas_dashboard`()
BEGIN

	DECLARE errno SMALLINT UNSIGNED DEFAULT 31001;
	DECLARE errmsg VARCHAR(100);

	SELECT
	'10' AS entradasHoy,
	'5' AS salidasHoy,
	'15' AS totalPersonas;
	
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
ALTER DATABASE `enter` CHARACTER SET latin1 COLLATE latin1_swedish_ci ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_visitas_documentos_update` */;
ALTER DATABASE `enter` CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_AUTO_VALUE_ON_ZERO' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_visitas_documentos_update`(IN `v_id` INT, IN `v_foto` VARCHAR(255), IN `v_frente` VARCHAR(255), IN `v_dorso` VARCHAR(255))
BEGIN
			
	DECLARE errno SMALLINT UNSIGNED DEFAULT 31001;
	DECLARE errmsg VARCHAR(100);	

	IF NOT EXISTS (SELECT id FROM visitas WHERE id = v_id) THEN 
	SET errmsg = 'LA visita no existe';
	SIGNAL SQLSTATE '45000' SET MYSQL_ERRNO = errno, MESSAGE_TEXT = errmsg;
	
		ELSE
		UPDATE visitas 
		SET
		foto = v_foto,
		imagen_frente = v_frente,
		imagen_dorso  = v_dorso
		WHERE id = v_id;
	
	END IF;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
ALTER DATABASE `enter` CHARACTER SET latin1 COLLATE latin1_swedish_ci ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_visitas_entrada` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_visitas_entrada`(IN `v_nombre` VARCHAR(100), IN `v_apellido` VARCHAR(100), IN `v_nroDocumento` VARCHAR(100), IN `v_idTipoDocumento` INT, IN `v_tipoDocumento` VARCHAR(100), IN `v_codNacionalidad` VARCHAR(25), IN `v_nacionalidad` VARCHAR(100), IN `v_fechaNacimiento` VARCHAR(25), IN `v_fechaExpiracion` VARCHAR(25), IN `v_fechaEmision` VARCHAR(25), IN `v_sexo` VARCHAR(3), IN `v_estadoCivil` VARCHAR(100), IN `v_identityCardNumber` VARCHAR(255), IN `v_idDependencia` INT, IN `v_idPuesto` INT, IN `v_codigoTarjeta` VARCHAR(100), IN `v_user` INT, IN `TransactionID` VARCHAR(100), IN `ComputerName` VARCHAR(100), IN `UserName` VARCHAR(100), IN `SDKVersion` VARCHAR(100), IN `FileVersion` VARCHAR(100), IN `DeviceType` VARCHAR(100), IN `DeviceNumber` VARCHAR(100), IN `DeviceAbelNumber` VARCHAR(100), IN `v_descripcion` VARCHAR(255))
BEGIN

    DECLARE errno SMALLINT UNSIGNED DEFAULT 31001;
    DECLARE errmsg VARCHAR(100);
    DECLARE p_idVisita INT;

    INSERT INTO visitas  
    (nombre, apellido, nro_documento, id_tipo_documento, tipo_documento,
    cod_nacionalidad, nacionalidad, 
    fecha_nacimiento, fecha_expiracion, fecha_emision,
    cod_sexo, sexo, 
    estado_civil, identity_card_number,
    id_dependencia, id_puesto, codigo_tarjeta, id_usuario, entrada, descripcion)  
    SELECT
    v_nombre, v_apellido, v_nroDocumento, v_idTipoDocumento, v_tipoDocumento,
    v_codNacionalidad, v_nacionalidad,
    v_fechaNacimiento, v_fechaExpiracion, v_fechaEmision,
    v_sexo, CASE WHEN v_sexo = 'M' THEN 'MASCULINO' WHEN v_sexo = 'F' THEN 'FEMENINO' ELSE 'OTROS' END, 
    v_estadoCivil, v_identityCardNumber,
    v_idDependencia, v_idPuesto, v_codigoTarjeta, v_user, now(), v_descripcion;

    SET p_idVisita = (SELECT LAST_INSERT_ID());

    INSERT INTO visitas_datos_puesto
    (id_visita, transaction_id, computer_name, user_name, sdk_version, file_version, device_type, device_number, device_abel_number)  
    VALUES
    (p_idVisita, TransactionID, ComputerName, UserName, SDKVersion, FileVersion, DeviceType, DeviceNumber, DeviceAbelNumber);  
    
    SELECT p_idVisita AS idVisita;
   
  

END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_visitas_list` */;
ALTER DATABASE `enter` CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_AUTO_VALUE_ON_ZERO' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_visitas_list`(IN `v_idPuesto` INT, IN `v_idVisita` INT, IN `v_desde` DATE, IN `v_hasta` DATE, IN `v_marcacion` VARCHAR(50), IN `v_documento` VARCHAR(50), IN `v_idDpendencia` INT, IN `v_user` INT)
BEGIN

	DECLARE errno SMALLINT UNSIGNED DEFAULT 31001;
	DECLARE errmsg VARCHAR(100);
	DECLARE urlEndpoint VARCHAR(255) DEFAULT (SELECT 'visitas/ver-archivo/nro/');
	
	SELECT 
	t1.id AS idVisita,
	t1.nombre,
	t1.apellido,
	DATE_FORMAT(t1.entrada, '%d-%m-%Y %H:%i:%s') AS entrada,
	DATE_FORMAT(t1.salida, '%d-%m-%Y %H:%i:%s') AS salida,
	CASE WHEN t1.entrada IS NOT NULL AND t1.salida IS NULL THEN 'Entrada' 
		WHEN t1.entrada IS NOT NULL AND t1.salida IS NOT NULL THEN 'Salida' 
		WHEN t1.entrada IS NULL AND t1.salida IS NULL THEN 'Sin Marcacion'
		ELSE 'Sin Entrada' END AS marcacion,
	t1.nro_documento AS documento,
	t1.tipo_documento AS tipoDocumento,
	t1.tipo_documento AS codTipoDocumento, 
	
	t1.foto,
	t1.imagen_frente AS imagenFrente,
	t1.imagen_dorso AS imagenDorso,
	
	CONCAT(t4.url_api,urlEndpoint,t1.nro_documento,'/archivo/',t1.foto) AS urlFoto,
	CONCAT(t4.url_api,urlEndpoint,t1.nro_documento,'/archivo/',t1.imagen_frente) AS urlImagenFrente,
	CONCAT(t4.url_api,urlEndpoint,t1.nro_documento,'/archivo/',t1.imagen_dorso) AS urlImagenDorso,
	
	
	
	
	
	
	t1.cod_nacionalidad AS codNacionalidad,
	t1.nacionalidad,
	t1.fecha_nacimiento AS fechaNacimiento,
	t1.fecha_expiracion AS fechaExpiracionDocumento,
	t1.fecha_emision AS fechaEmision,
	t1.sexo,
	t1.estado_civil AS esstadoCivil,
	t1.id_dependencia AS idDependencia,
	t2.nombre AS dependencia,
	t1.id_puesto AS idPuesto,
	t3.descripcion AS puesto,
    t1.codigo_tarjeta  AS codigoTarjeta
	FROM visitas t1
		JOIN dependencias t2 ON t1.id_dependencia = t2.id
		LEFT JOIN puestos t3 ON t1.id_puesto = t3.id
		LEFT JOIN puestos t4 ON t4.id =(select id from puestos where id like CASE WHEN v_idPuesto IS NULL THEN '%%'  ELSE v_idPuesto end
										and estado like case when v_idPuesto is null then 'ACTIVO' else '%%' end 
										order by t1.id limit 1)
	WHERE t1.id like CASE WHEN v_idVisita IS NOT NULL THEN v_idVisita ELSE '%%' END 
		 AND CAST(t1.entrada AS DATE) BETWEEN (CASE WHEN v_desde IS NOT NULL THEN v_desde ELSE CURDATE() END) 
		 						AND (CASE WHEN v_hasta IS NOT NULL THEN v_hasta ELSE CURDATE() END) 
		AND t1.nro_documento like CASE WHEN v_documento IS NOT NULL THEN v_documento ELSE '%%' END 
		AND t1.id_dependencia  like CASE WHEN v_idDpendencia IS NOT NULL THEN v_idDpendencia ELSE '%%' END
		AND IFNULL(v_marcacion,'ALL') like 
			CASE WHEN v_marcacion = 'Entrada' THEN 'Entrada'
			WHEN v_marcacion = 'Salida' AND t1.entrada IS NOT NULL AND t1.salida IS NOT NULL THEN 'Salida'
			WHEN v_marcacion = 'Permanecen' AND t1.entrada IS NOT NULL AND t1.salida IS NULL THEN 'Permanecen'
			ELSE 'ALL' END
			
	ORDER BY  t1.entrada DESC;
	
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
ALTER DATABASE `enter` CHARACTER SET latin1 COLLATE latin1_swedish_ci ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_visitas_list_group` */;
ALTER DATABASE `enter` CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_AUTO_VALUE_ON_ZERO' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_visitas_list_group`(IN `v_idVisita` INT, IN `v_desde` DATE, IN `v_hasta` DATE, IN `v_marcacion` VARCHAR(50), IN `v_documento` VARCHAR(50), IN `v_idDependencia` INT, IN `v_user` INT)
BEGIN
    DECLARE errno SMALLINT UNSIGNED DEFAULT 31001;
    DECLARE errmsg VARCHAR(100);
    DECLARE urlEndpoint VARCHAR(255) DEFAULT 'visitas/ver-archivo/nro/';
    
    SELECT t2.idVisita AS idVisita,
           t1.nombre, t1.apellido, 
           t1.nro_documento AS documento,
           t1.tipo_documento AS tipoDocumento,
           t1.foto, t1.imagen_frente AS fotoCedulaFrente, t1.imagen_dorso AS fotoCedulaDorso,
           t1.nacionalidad,
           DATE_FORMAT(t1.entrada, '%d-%m-%Y %h:%i:%s') AS ultimaVisita, t2.cantidad,
           CONCAT(t4.url_api,urlEndpoint,t1.nro_documento,'/archivo/',t1.foto) AS foto,
           CONCAT(t4.url_api,urlEndpoint,t1.nro_documento,'/archivo/',t1.foto) AS urlFoto,
           IF(t5.device_abel_number IS NULL, 'NO', 'SI') AS escaner
    FROM (
        SELECT MAX(id) AS idVisita, COUNT(id) AS cantidad, nro_documento 
        FROM visitas 
        WHERE (v_desde IS NULL OR CAST(entrada AS DATE) >= v_desde) 
              AND (v_hasta IS NULL OR CAST(entrada AS DATE) <= v_hasta)
        GROUP BY nro_documento
    ) t2

    JOIN visitas t1 ON t2.idVisita = t1.id
    LEFT JOIN puestos t4 ON t4.id = (
        SELECT id 
        FROM puestos 
        WHERE servidor = true
        AND estado = 'ACTIVO'
        ORDER BY id 
        LIMIT 1
    )
    LEFT JOIN visitas_datos_puesto t5 ON t5.id_visita = t1.id
    WHERE t1.id LIKE CASE WHEN v_idVisita IS NOT NULL THEN v_idVisita ELSE '%%' END 
    AND t1.nro_documento LIKE CASE WHEN v_documento IS NOT NULL THEN v_documento ELSE '%%' END 
    AND t1.id_dependencia LIKE CASE WHEN v_idDependencia IS NOT NULL THEN v_idDependencia ELSE '%%' END
    AND IFNULL(v_marcacion,'ALL') LIKE 
        CASE WHEN v_marcacion = 'Entrada' THEN 'Entrada'
             WHEN v_marcacion = 'Salida' AND t1.entrada IS NOT NULL AND t1.salida IS NOT NULL THEN 'Salida'
             WHEN v_marcacion = 'Permanecen' AND t1.entrada IS NOT NULL AND t1.salida IS NULL THEN 'Permanecen'
             ELSE 'ALL' 
        END
    ORDER BY t1.entrada DESC;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
ALTER DATABASE `enter` CHARACTER SET latin1 COLLATE latin1_swedish_ci ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_visitas_obtener_detalle` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_visitas_obtener_detalle`(IN `idVisita` INT)
BEGIN
   SELECT 
       v.id, 
       v.nombre, 
       v.apellido, 
       v.nro_documento, 
       d.nombre AS dependencia
   FROM visitas v
   LEFT JOIN dependencias d ON v.id_dependencia = d.id
   WHERE v.id = idVisita;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_visitas_puestos_list` */;
ALTER DATABASE `enter` CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_AUTO_VALUE_ON_ZERO' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_visitas_puestos_list`(IN `v_id` INT)
BEGIN 
	
	SELECT 
	t1.id AS idPuesto,
	t1.descripcion,
	t1.nombre,
	t1.ip AS ipPuesto,
	t1.puerto,
	t1.ubicacion AS ubicacionCarpeta,
	t1.servidor,
	t1.tipo,
	t1.ubicacion_servidor AS ubicacionServidor,
	
	t1.sistema_operativo,
	t2.id AS idImpresora,
	t2.archivo_principal AS archivoPrincipal,
	t2.archivo_secundario AS archivoSecundario,
	t2.foto,
	t2.imagen_frente AS imagenFrente,
	t2.imagen_dorso AS imagenDorso,
	t2.subcarpeta AS subcarpetaImpresora,
	t1.ubicacion_servidor AS urlServidor
	
	FROM puestos t1
		LEFT JOIN impresoras t2 ON t1.id_impresora = t2.id
	WHERE t1.id like CASE WHEN v_id IS NULL THEN '%%'  ELSE v_id end
	and t1.estado like case when v_id is null then 'ACTIVO' else '%%' end 
	order by t1.id limit 1; 
	
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
ALTER DATABASE `enter` CHARACTER SET latin1 COLLATE latin1_swedish_ci ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_visitas_salida` */;
ALTER DATABASE `enter` CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_AUTO_VALUE_ON_ZERO' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_visitas_salida`(IN `v_idVisita` INT)
BEGIN

	DECLARE errno SMALLINT UNSIGNED DEFAULT 31001;
	DECLARE errmsg VARCHAR(100);
	
	IF NOT EXISTS(SELECT id FROM visitas WHERE id = v_idVisita) THEN
	SET errmsg = 'La visita no esta registrado';
	SIGNAL SQLSTATE '45000' SET MYSQL_ERRNO = errno, MESSAGE_TEXT = errmsg;

	ELSEIF NOT EXISTS(SELECT id FROM visitas WHERE id = v_idVisita AND salida IS NULL) THEN
	SET errmsg = 'La visita ya realizo la salida';
	SIGNAL SQLSTATE '45000' SET MYSQL_ERRNO = errno, MESSAGE_TEXT = errmsg;

	ELSE
	UPDATE visitas
	SET 
	salida = now()
	WHERE id = v_idVisita
		AND salida IS NULL;
	
	END IF;

END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
ALTER DATABASE `enter` CHARACTER SET latin1 COLLATE latin1_swedish_ci ;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-03-25 13:31:23
