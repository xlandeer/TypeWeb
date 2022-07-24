-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Jul 24, 2022 at 05:25 PM
-- Server version: 10.4.24-MariaDB
-- PHP Version: 8.1.6

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `Cocktail`
--

-- --------------------------------------------------------

--
-- Table structure for table `cocktail`
--

CREATE TABLE `cocktail` (
  `id` int(11) NOT NULL,
  `cocktail_name` varchar(50) DEFAULT NULL,
  `image_url` varchar(200) DEFAULT NULL,
  `description` varchar(500) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `cocktail`
--

INSERT INTO `cocktail` (`id`, `cocktail_name`, `image_url`, `description`) VALUES
(30, 'Gin Tonic', 'https://www.kuriose-feiertage.de/wp-content/uploads/2020/04/Gin-Tonic-Tag-National-und-International-Gin-and-Tonic-Day-Kuriose-Feiertage-2020-Sven-Giese-2.jpg', ''),
(31, 'Mojito', 'https://www.liquor.com/thmb/0MKX9NxhPDzuVQLoNoMWfGQoSww=/720x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/mojito-720x720-primary-6a57f80e200c412e9a77a1687f312ff7.jpg', ''),
(36, 'Mai Tai', 'https://image.essen-und-trinken.de/11952818/t/5L/v8/w960/r1/-/maitai-colourbox-jpg--65333-.jpg', ''),
(38, 'Daiquiri', 'https://spirituosenworld.de/images/cocktails/daiquiri-shortdrink.jpg.pagespeed.ce.J292uqz5P9.jpg', '');

-- --------------------------------------------------------

--
-- Table structure for table `ingredients`
--

CREATE TABLE `ingredients` (
  `cocktail_id` int(11) NOT NULL,
  `ingr_name` varchar(50) NOT NULL,
  `ingr_amt` int(11) DEFAULT NULL,
  `ingr_measure` varchar(10) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `ingredients`
--

INSERT INTO `ingredients` (`cocktail_id`, `ingr_name`, `ingr_amt`, `ingr_measure`) VALUES
(30, 'Gin', 2, 'oz'),
(30, 'Lime', 2, 'slices'),
(30, 'Tonic Water', 4, 'oz'),
(31, 'Ginger Ale to top', 1, 'times'),
(31, 'Lime', 1, 'slices'),
(31, 'Lime Juice', 20, 'ml'),
(31, 'Mint leaves', 3, 'times'),
(31, 'Simple Syrup', 15, 'ml'),
(31, 'White Rum', 2, 'oz'),
(36, 'Almond Syrup', 20, 'ml'),
(36, 'Brown Rum', 1, 'oz'),
(36, 'Lemon Juice', 10, 'ml'),
(36, 'Lime Juice', 20, 'ml'),
(36, 'Orange Juice', 80, 'ml'),
(38, 'Lime or Lemon Juice', 1, 'oz'),
(38, 'Simple Syrup', 20, 'ml'),
(38, 'White Rum', 2, 'oz');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `cocktail`
--
ALTER TABLE `cocktail`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `ingredients`
--
ALTER TABLE `ingredients`
  ADD PRIMARY KEY (`cocktail_id`,`ingr_name`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `cocktail`
--
ALTER TABLE `cocktail`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=112;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `ingredients`
--
ALTER TABLE `ingredients`
  ADD CONSTRAINT `FK_COCKTAIL_ID` FOREIGN KEY (`cocktail_id`) REFERENCES `cocktail` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
