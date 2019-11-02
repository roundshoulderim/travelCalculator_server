-- MySQL dump 10.13  Distrib 5.7.27, for Linux (x86_64)
--
-- Host: localhost    Database: travelcalculator
-- ------------------------------------------------------
-- Server version	5.7.27-0ubuntu0.18.04.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `apikeys`
--

DROP TABLE IF EXISTS `apikeys`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `apikeys` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `api` varchar(100) NOT NULL,
  `key` varchar(100) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `apikeys`
--

LOCK TABLES `apikeys` WRITE;
/*!40000 ALTER TABLE `apikeys` DISABLE KEYS */;
INSERT INTO `apikeys` VALUES (1,'amadeusid','YgxTJ1tGQDlG3aGH94nAoqCRPqpthHd4\r'),(2,'amadeuskey','DT9M56POOrU3cl7E\r'),(3,'zomatokey','b8cc3b8b0a85afed047f030fb52dc15f');
/*!40000 ALTER TABLE `apikeys` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `carriers`
--

DROP TABLE IF EXISTS `carriers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `carriers` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `airline` varchar(20) NOT NULL,
  `nation` varchar(20) NOT NULL,
  `iataCode` varchar(20) NOT NULL,
  `logo` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=86 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `carriers`
--

LOCK TABLES `carriers` WRITE;
/*!40000 ALTER TABLE `carriers` DISABLE KEYS */;
INSERT INTO `carriers` VALUES (1,'FedEX항공','미국','FX','https://www.airport.kr/fileroot/aac/FDX_logo.png\r'),(2,'S7항공','러시아','S7','https://www.airport.kr/fileroot/aac/20190523171507782_0.png\r'),(3,'가루다인도네시아','인도네시아','GA','https://www.airport.kr/fileroot/aac/GIA_logo.png\r'),(4,'대한항공','한국','KE','https://www.airport.kr/fileroot/aac/KAL_logo.png\r'),(5,'델타항공','미국','DL','https://www.airport.kr/fileroot/aac/DAL_logo.png\r'),(6,'라오항공','라오스','QV','https://www.airport.kr/fileroot/aac/LAO_logo.png\r'),(7,'로얄브루나이항공','브루나이','BI','https://www.airport.kr/fileroot/aac/2018072410373275_0.png\r'),(8,'루프트한자 독일항공','독일','LH','https://www.airport.kr/fileroot/aac/20181113144932967_0.png\r'),(9,'말레이시아 에어라인스','말레이시아','MH','https://www.airport.kr/fileroot/aac/MAS_logo.png\r'),(10,'몽골항공','몽골','OM','https://www.airport.kr/fileroot/aac/MGL_logo.png\r'),(11,'미국남부화물항공','미국','9S','https://www.airport.kr/fileroot/aac/20190531180441297_0.png\r'),(12,'베트남항공','베트남','VN','https://www.airport.kr/fileroot/aac/HVN_logo.png\r'),(13,'비엣젯항공','베트남','VJ','https://www.airport.kr/fileroot/aac/VJC_logo.png\r'),(14,'사천항공','중국','3U','https://www.airport.kr/fileroot/aac/CSC_logo.png\r'),(15,'산동항공','중국','SC','https://www.airport.kr/fileroot/aac/CDG_logo.png\r'),(16,'상하이항공','중국','FM','https://www.airport.kr/fileroot/aac/CSH_logo.png\r'),(17,'샤먼항공','중국','MF','https://www.airport.kr/fileroot/aac/CXA_logo.png\r'),(18,'세부퍼시픽항공','필리핀','5J','https://www.airport.kr/fileroot/aac/CEB_logo.png\r'),(19,'스카이 앙코르 항공','캄보디아','ZA','https://www.airport.kr/fileroot/aac/SWM_logo.png\r'),(20,'스쿠트타이거항공','싱가포르','TR','https://www.airport.kr/fileroot/aac/20180917161356573_0.PNG\r'),(21,'실크웨이웨스트항공','아제르바이잔','7L','https://www.airport.kr/fileroot/aac/AZQ_logo.png\r'),(22,'심천항공','중국','ZH','https://www.airport.kr/fileroot/aac/CSZ_logo.png\r'),(23,'싱가포르항공','싱가포르','SQ','https://www.airport.kr/fileroot/aac/SIA_logo.png\r'),(24,'아메리칸항공','미국','AA','https://www.airport.kr/fileroot/aac/AAL_logo.png\r'),(25,'아시아나항공','한국','OZ','https://www.airport.kr/fileroot/aac/20180904113100184_0.png\r'),(26,'아에로멕시코','멕시코','AM','https://www.airport.kr/fileroot/aac/AMX_logo.png\r'),(27,'아에로플로트 러시아항공','러시아','SU','https://www.airport.kr/fileroot/aac/AFL_logo.png\r'),(28,'아틀라스항공','미국','5Y','https://www.airport.kr/fileroot/aac/GTI_logo.png\r'),(29,'알리탈리아','이탈리아','AZ','https://www.airport.kr/fileroot/aac/AZA_logo.png\r'),(30,'에미레이트항공','아랍에미리트','EK','https://www.airport.kr/fileroot/aac/20190513135203281_0.png\r'),(31,'에바항공','대만','BR','https://www.airport.kr/fileroot/aac/20180123142834738_0.png\r'),(32,'에어 아스타나','카자흐스탄','KC','https://www.airport.kr/fileroot/aac/KZR_logo.png\r'),(33,'에어 재팬 주식회사','일본','NQ','https://www.airport.kr/fileroot/aac/AJX_logo.png\r'),(34,'에어 프랑스','프랑스','AF','https://www.airport.kr/fileroot/aac/AFR_logo.png\r'),(35,'에어로로직','독일','3S','https://www.airport.kr/fileroot/aac/3SX_logo.png\r'),(36,'에어마카우','중국','NX','https://www.airport.kr/fileroot/aac/AMU_logo.png\r'),(37,'에어브릿지 화물항공','러시아','RU','https://www.airport.kr/fileroot/aac/ABW_logo.png\r'),(38,'에어서울','한국','RS','https://www.airport.kr/fileroot/aac/ASV_logo.png\r'),(39,'에어아시아엑스','말레이시아','D7','https://www.airport.kr/fileroot/aac/XAX_logo.png\r'),(40,'에어인디아 리미티드','인도','AI','https://www.airport.kr/fileroot/aac/AIC_logo.png\r'),(41,'에어인천','한국','KJ','https://www.airport.kr/fileroot/aac/AIH_logo.png\r'),(42,'에어홍콩','중국','LD','https://www.airport.kr/fileroot/aac/20180525112519463_0.png\r'),(43,'에티오피아항공','에티오피아','ET','https://www.airport.kr/fileroot/aac/ETH_logo.png\r'),(44,'에티하드 항공','아랍에미리트','EY','https://www.airport.kr/fileroot/aac/ETD_logo.png\r'),(45,'영국항공','영국','BA','https://www.airport.kr/fileroot/aac/BAW_logo.png\r'),(46,'오로라항공','러시아','HZ','https://www.airport.kr/fileroot/aac/SHU_logo.png\r'),(47,'우즈베키스탄항공','우즈베키스탄','HY','https://www.airport.kr/fileroot/aac/UZB_logo.png\r'),(48,'유나이티드항공','미국','UA','https://www.airport.kr/fileroot/aac/UAL_logo.png\r'),(49,'유니항공','대만','B7','https://www.airport.kr/fileroot/aac/20180123142735244_0.png\r'),(50,'유피에스항공','미국','5X','https://www.airport.kr/fileroot/aac/UPS_logo.png\r'),(51,'이스타항공','한국','ZE','https://www.airport.kr/fileroot/aac/ESR_logo.png\r'),(52,'제주항공','한국','7C','https://www.airport.kr/fileroot/aac/JJA_logo.png\r'),(53,'중국국제항공','중국','CA','https://www.airport.kr/fileroot/aac/CCA_logo.png\r'),(54,'중국남방항공','중국','CZ','https://www.airport.kr/fileroot/aac/CSN_logo.png\r'),(55,'중국동방항공','중국','MU','https://www.airport.kr/fileroot/aac/20180117174729340_0.png\r'),(56,'중국우정항공','중국','CF','https://www.airport.kr/fileroot/aac/20180111035821643_0.png\r'),(57,'중국화물항공','중국','CK','https://www.airport.kr/fileroot/aac/20180111035929810_0.png\r'),(58,'중화항공','대만','CI','https://www.airport.kr/fileroot/aac/CAL_logo.png\r'),(59,'진에어','한국','LJ','https://www.airport.kr/fileroot/aac/20180221144147723_0.png\r'),(60,'천진항공','중국','GS','https://www.airport.kr/fileroot/aac/GCR_logo.png\r'),(61,'청도항공','중국','QW','https://www.airport.kr/fileroot/aac/20181113135028508_0.png\r'),(62,'체코항공','체코','OK','https://www.airport.kr/fileroot/aac/CSA_logo.png\r'),(63,'춘추항공','중국','9C','https://www.airport.kr/fileroot/aac/CQH_logo.png\r'),(64,'카고룩스 이탈리아 항공','이탈리아','C8','https://www.airport.kr/fileroot/aac/20190716163402155_0.png\r'),(65,'카고룩스항공','룩셈부르크','CV','https://www.airport.kr/fileroot/aac/CLX_logo.png\r'),(66,'카타르항공','카타르','QR','https://www.airport.kr/fileroot/aac/QTR_logo.png\r'),(67,'칼리타항공','미국','K4','https://www.airport.kr/fileroot/aac/20180724103822338_0.jpg\r'),(68,'캐나다항공','캐나다','AC','https://www.airport.kr/fileroot/aac/ACA_logo.png\r'),(69,'캐세이패시픽항공','중국','CX','https://www.airport.kr/fileroot/aac/CPA_logo.png\r'),(70,'케에엘엠네덜란드항공','네덜란드','KL','https://www.airport.kr/fileroot/aac/KLM_logo.png\r'),(71,'타이에어아시아엑스','태국','XJ','https://www.airport.kr/fileroot/aac/TAX_logo.png\r'),(72,'타이항공','태국','TG','https://www.airport.kr/fileroot/aac/THA_logo.png\r'),(73,'터키항공','터키','TK','https://www.airport.kr/fileroot/aac/THY_logo.png\r'),(74,'티웨이항공','한국','TW','https://www.airport.kr/fileroot/aac/20180111165727950_0.png\r'),(75,'팔익스프레스 항공','필리핀','2P','https://www.airport.kr/fileroot/aac/20170703120410586_0.gif\r'),(76,'팬퍼시픽항공','필리핀','8Y','https://www.airport.kr/fileroot/aac/20180119213225636_0.png\r'),(77,'폴라에어카고','미국','PO','https://www.airport.kr/fileroot/aac/PAC_logo.png\r'),(78,'폴란드항공','폴란드','LO','https://www.airport.kr/fileroot/aac/LOT_logo.png\r'),(79,'피치항공','일본','MM','https://www.airport.kr/fileroot/aac/APJ_logo.png\r'),(80,'핀에어','핀란드','AY','https://www.airport.kr/fileroot/aac/FIN_logo.png\r'),(81,'필리핀에어아시아','필리핀','Z2','https://www.airport.kr/fileroot/aac/20180118132418635_0.png\r'),(82,'필리핀항공','필리핀','PR','https://www.airport.kr/fileroot/aac/PAL_logo.png\r'),(83,'하와이안 항공','미국','HA','https://www.airport.kr/fileroot/aac/HAL_logo.png\r'),(84,'홍콩익스프레스','중국','UO','https://www.airport.kr/fileroot/aac/HKE_logo.png\r'),(85,'홍콩항공','중국','HX','https://www.airport.kr/fileroot/aac/CRK_logo.png');
/*!40000 ALTER TABLE `carriers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `currencies`
--

DROP TABLE IF EXISTS `currencies`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `currencies` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `iataCode` varchar(20) NOT NULL,
  `iso` varchar(20) NOT NULL,
  `krw` float NOT NULL,
  `usd` float NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `currencies`
--

LOCK TABLES `currencies` WRITE;
/*!40000 ALTER TABLE `currencies` DISABLE KEYS */;
/*!40000 ALTER TABLE `currencies` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `meals`
--

DROP TABLE IF EXISTS `meals`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `meals` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `iataCode` varchar(20) NOT NULL,
  `onemeal` int(11) NOT NULL,
  `onedaymeal` int(11) NOT NULL,
  `iso` varchar(20) NOT NULL,
  `krw` float NOT NULL,
  `usd` float NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `meals`
--

LOCK TABLES `meals` WRITE;
/*!40000 ALTER TABLE `meals` DISABLE KEYS */;
INSERT INTO `meals` VALUES (1,'LHR',21031,52579,'GBP',1512,1.3),(2,'FCO',17881,44702,'EUR',1303,1.12),(3,'DUB',19607,49017,'EUR',1303,1.12),(4,'BTS',9650,24126,'EUR',1303,1.12),(5,'OPO',10330,25825,'EUR',1303,1.12),(6,'WMI',9220,23051,'PLN',305,0.26),(7,'MXP',18724,46810,'EUR',1303,1.12),(8,'ESB',6252,15630,'TRY',204,0.18),(9,'SIN',13672,34180,'SGD',859,0.74),(10,'DXB',16731,41829,'AED',317,0.27),(11,'KUL',6506,16267,'MYR',279,0.24),(12,'IAD',20732,51831,'USD',1167,1),(13,'MIA',19240,48100,'USD',1167,1),(14,'ORD',18348,45870,'USD',1167,1),(15,'SYD',16925,42314,'AUD',806,0.69);
/*!40000 ALTER TABLE `meals` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2019-11-02 18:00:16
