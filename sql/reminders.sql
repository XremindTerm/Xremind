-- phpMyAdmin SQL Dump
-- version 4.5.5.1
-- http://www.phpmyadmin.net
--
-- Host: 127.0.0.1
-- Generation Time: 2016-08-17 06:05:38
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
  `id` int(11) NOT NULL COMMENT '提醒项目编号',
  `shortid` varchar(15) NOT NULL COMMENT '短标识码',
  `uid` int(11) NOT NULL COMMENT '拥有者编号',
  `data` text NOT NULL COMMENT '项目参数',
  `target` varchar(15) NOT NULL DEFAULT '1469525261916' COMMENT '下次提醒的时间戳',
  `create` varchar(15) NOT NULL DEFAULT '1469525261916' COMMENT '项目创建时间',
  `interval` varchar(15) NOT NULL DEFAULT '60000' COMMENT '下次提醒的间隔',
  `state` varchar(10) NOT NULL DEFAULT 'wait' COMMENT '项目状态'
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COMMENT='提醒项目表';

--
-- Indexes for dumped tables
--

--
-- Indexes for table `reminders`
--
ALTER TABLE `reminders`
  ADD PRIMARY KEY (`id`);

--
-- 在导出的表使用AUTO_INCREMENT
--

--
-- 使用表AUTO_INCREMENT `reminders`
--
ALTER TABLE `reminders`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '提醒项目编号';
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
