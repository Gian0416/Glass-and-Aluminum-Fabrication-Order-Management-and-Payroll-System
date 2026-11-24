-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Nov 24, 2026 at 06:16 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `asdeleon`
--
CREATE DATABASE IF NOT EXISTS `asdeleon` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `asdeleon`;

-- --------------------------------------------------------

--
-- Table structure for table `attendance`
--

CREATE TABLE `attendance` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `work_date` date NOT NULL,
  `time_in` datetime NOT NULL,
  `time_out` datetime DEFAULT NULL,
  `status` enum('on_time','late') NOT NULL,
  `late_minutes` int(11) NOT NULL DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `project_errors`
--

CREATE TABLE `project_errors` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `error_date` date NOT NULL,
  `description` varchar(255) NOT NULL,
  `amount` decimal(10,2) NOT NULL DEFAULT 0.00,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `settings`
--

CREATE TABLE `settings` (
  `setting_key` varchar(50) NOT NULL,
  `setting_value` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `settings`
--

INSERT INTO `settings` (`setting_key`, `setting_value`) VALUES
('absent_rate_per_day', '430.00'),
('break_minutes', '60'),
('late_rate_per_hour', '50.00'),
('work_start', '08:00:00');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `role` enum('owner','employee','customer') NOT NULL,
  `full_name` varchar(50) NOT NULL,
  `username` varchar(30) DEFAULT NULL,
  `employee_code` varchar(20) DEFAULT NULL,
  `position` varchar(50) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `password_hash` varchar(255) NOT NULL,
  `pin_hash` varchar(255) DEFAULT NULL,
  `status` enum('active','suspended') NOT NULL DEFAULT 'active',
  `email_verified_at` datetime DEFAULT NULL,
  `verify_token_hash` char(64) DEFAULT NULL,
  `verify_expires_at` datetime DEFAULT NULL,
  `failed_attempts` int(11) NOT NULL DEFAULT 0,
  `locked_until` datetime DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `role`, `full_name`, `username`, `employee_code`, `position`, `email`, `password_hash`, `pin_hash`, `status`, `email_verified_at`, `verify_token_hash`, `verify_expires_at`, `failed_attempts`, `locked_until`, `created_at`) VALUES
(1, 'employee', 'Jane Doe', 'jane.doe', 'ADL-0001', 'Fabricator', NULL, '$2y$10$6AeWoFL8qEj51L1rBAXLKe9WgrldAoWn1nlu2AGfjJ1Mi1n/gZHwO', '$2b$12$fXTbyjwltUdmvu7UyAcrcOXzuOekEcYm4EYZtWgX24O.nl3Vzdi16', 'active', NULL, NULL, NULL, 0, NULL, '2026-11-16 13:31:10'),
(2, 'employee', 'Juan Dela Cruz', 'juan.delacruz', 'ADL-0002', 'Fabricator', NULL, '$2b$10$9haqxBQaziv7AdxIEw3jDuetYJZyfEBseQQfvPQPO4gyUhSUPrc9K', NULL, 'active', NULL, NULL, NULL, 0, NULL, '2026-11-16 13:31:27'),
(3, 'owner', 'Ian De Leon', 'owner', NULL, NULL, NULL, '$2b$12$ZbLhCuYGScqeCuWQSQbPY.lpK8ZaGKiu3ce9L8mYL2kZGqbrkL9oK', NULL, 'active', NULL, NULL, NULL, 1, NULL, '2026-11-17 01:26:13'),
(9, 'customer', 'Sophia Garcia', NULL, NULL, NULL, 'sophiapola.avelinogarcia@gmail.com', '$2b$12$uaNVa27gs1GyUDJkuJvHhOgAUDkikg5pyX.ivFRtYflQScC23BTgm', NULL, 'active', NULL, NULL, NULL, 1, NULL, '2026-11-21 23:45:55');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `attendance`
--
ALTER TABLE `attendance`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `one_row_per_day` (`user_id`,`work_date`);

--
-- Indexes for table `project_errors`
--
ALTER TABLE `project_errors`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `settings`
--
ALTER TABLE `settings`
  ADD PRIMARY KEY (`setting_key`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `employee_code` (`employee_code`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `attendance`
--
ALTER TABLE `attendance`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `project_errors`
--
ALTER TABLE `project_errors`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `attendance`
--
ALTER TABLE `attendance`
  ADD CONSTRAINT `attendance_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `project_errors`
--
ALTER TABLE `project_errors`
  ADD CONSTRAINT `project_errors_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
