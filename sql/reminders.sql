-- phpMyAdmin SQL Dump
-- version 4.5.5.1
-- http://www.phpmyadmin.net
--
-- Host: 127.0.0.1
-- Generation Time: 2016-07-26 08:56:39
-- 服务器版本： 5.7.11
-- PHP Version: 5.6.19

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `xremind`
--

-- --------------------------------------------------------

--
-- 表的结构 `reminders`
--

CREATE TABLE `reminders` (
  `id` int(10) UNSIGNED NOT NULL COMMENT '提醒项目索引',
  `uId` int(10) UNSIGNED ZEROFILL NOT NULL COMMENT '该提醒项目拥有者编号',
  `status` varchar(15) CHARACTER SET latin1 NOT NULL DEFAULT 'wait' COMMENT '提醒项目状态，默认wait',
  `target` bigint(20) UNSIGNED ZEROFILL NOT NULL DEFAULT '00000000000000000000' COMMENT '下次提醒的时间戳',
  `interval` int(10) UNSIGNED NOT NULL DEFAULT '60000' COMMENT '下次提醒的时间间隔(ms)',
  `data` text CHARACTER SET latin1 NOT NULL COMMENT '提醒项目参数配置'
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COMMENT='提醒项目表';

--
-- Indexes for dumped tables
--

--
-- Indexes for table `reminders`
--
ALTER TABLE `reminders`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `id_UNIQUE` (`id`);

--
-- 在导出的表使用AUTO_INCREMENT
--

--
-- 使用表AUTO_INCREMENT `reminders`
--
ALTER TABLE `reminders`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '提醒项目索引';
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
