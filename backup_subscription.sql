CREATE DATABASE  IF NOT EXISTS `subscription_service` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `subscription_service`;
-- MySQL dump 10.13  Distrib 8.0.43, for Win64 (x86_64)
--
-- Host: localhost    Database: subscription_service
-- ------------------------------------------------------
-- Server version	8.0.43

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `paymentmethods`
--

DROP TABLE IF EXISTS `paymentmethods`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `paymentmethods` (
  `method_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `method_name` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  PRIMARY KEY (`method_id`),
  KEY `FK_Users_TO_PaymentMethods` (`user_id`),
  CONSTRAINT `FK_Users_TO_PaymentMethods` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `paymentmethods`
--

LOCK TABLES `paymentmethods` WRITE;
/*!40000 ALTER TABLE `paymentmethods` DISABLE KEYS */;
INSERT INTO `paymentmethods` VALUES (1,1,'내 현대카드'),(2,1,'카카오뱅크 통장'),(4,2,'카카오카드'),(6,3,'농협카드'),(7,3,'카카오페이'),(8,3,'토스페이'),(9,3,'나라사랑카드'),(10,2,'토스페이');
/*!40000 ALTER TABLE `paymentmethods` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `plans`
--

DROP TABLE IF EXISTS `plans`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `plans` (
  `plan_id` int NOT NULL AUTO_INCREMENT,
  `service_id` int NOT NULL,
  `plan_name` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `base_price` int NOT NULL,
  PRIMARY KEY (`plan_id`),
  KEY `FK_Services_TO_Plans` (`service_id`),
  CONSTRAINT `FK_Services_TO_Plans` FOREIGN KEY (`service_id`) REFERENCES `services` (`service_id`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `plans`
--

LOCK TABLES `plans` WRITE;
/*!40000 ALTER TABLE `plans` DISABLE KEYS */;
INSERT INTO `plans` VALUES (1,1,'광고형 스탠다드',5500),(2,1,'스탠다드',13500),(3,1,'프리미엄',17000),(4,2,'베이직',9000),(5,2,'스탠다드',12500),(6,2,'프리미엄',16000),(7,3,'와우 멤버십',4990),(8,3,'와우 멤버십(신규)',7890),(9,4,'개인 멤버십',14900),(10,5,'모바일 스트리밍',6900),(11,5,'스트리밍 클럽',7900),(12,6,'개인',10900),(13,6,'듀오',16350);
/*!40000 ALTER TABLE `plans` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `services`
--

DROP TABLE IF EXISTS `services`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `services` (
  `service_id` int NOT NULL AUTO_INCREMENT,
  `service_name` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `category` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `logo_url` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  PRIMARY KEY (`service_id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `services`
--

LOCK TABLES `services` WRITE;
/*!40000 ALTER TABLE `services` DISABLE KEYS */;
INSERT INTO `services` VALUES (1,'Netflix','OTT','https://upload.wikimedia.org/wikipedia/commons/7/75/Netflix_icon.svg'),(2,'Tving','OTT','https://upload.wikimedia.org/wikipedia/commons/6/6e/Tving_logo.svg'),(3,'Coupang Play','OTT','https://upload.wikimedia.org/wikipedia/commons/e/e1/Coupang_Play_logo.svg'),(4,'YouTube Premium','OTT','https://upload.wikimedia.org/wikipedia/commons/0/09/YouTube_full-color_icon_%282017%29.svg'),(5,'Melon','Music','https://upload.wikimedia.org/wikipedia/commons/2/25/Melon_logo.svg'),(6,'Spotify','Music','https://upload.wikimedia.org/wikipedia/commons/1/19/Spotify_logo_without_text.svg');
/*!40000 ALTER TABLE `services` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `subscriptions`
--

DROP TABLE IF EXISTS `subscriptions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `subscriptions` (
  `subscription_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `plan_id` int NOT NULL,
  `method_id` int NOT NULL,
  `billing_day` int NOT NULL,
  `real_price` int NOT NULL,
  `memo` text COLLATE utf8mb4_general_ci,
  PRIMARY KEY (`subscription_id`),
  KEY `FK_Users_TO_Subscriptions` (`user_id`),
  KEY `FK_Plans_TO_Subscriptions` (`plan_id`),
  KEY `FK_PaymentMethods_TO_Subscriptions` (`method_id`),
  CONSTRAINT `FK_PaymentMethods_TO_Subscriptions` FOREIGN KEY (`method_id`) REFERENCES `paymentmethods` (`method_id`),
  CONSTRAINT `FK_Plans_TO_Subscriptions` FOREIGN KEY (`plan_id`) REFERENCES `plans` (`plan_id`),
  CONSTRAINT `FK_Users_TO_Subscriptions` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `subscriptions`
--

LOCK TABLES `subscriptions` WRITE;
/*!40000 ALTER TABLE `subscriptions` DISABLE KEYS */;
INSERT INTO `subscriptions` VALUES (3,2,1,4,5,17000,''),(4,1,1,1,5,17000,'qq'),(5,1,9,1,11,14900,'ssss'),(6,3,10,7,5,100,'이벤트 기간 3개월'),(7,3,2,9,5,13500,''),(8,2,7,4,2,2222,'22'),(9,2,4,4,31,33333,'111'),(10,2,9,4,22,2222,'22'),(11,2,10,4,1,2222,''),(12,2,12,4,22,22222,'');
/*!40000 ALTER TABLE `subscriptions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `user_id` int NOT NULL AUTO_INCREMENT,
  `email` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `password` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `nickname` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'minsu@test.com','1234','민수'),(2,'new@user.com','1234','구독'),(3,'new@new.com','1234','호구새끼');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-11-25 23:22:45
