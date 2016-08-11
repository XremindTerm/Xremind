-- phpMyAdmin SQL Dump
-- version 4.5.5.1
-- http://www.phpmyadmin.net
--
-- Host: 127.0.0.1
-- Generation Time: 2016-08-01 14:37:55
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
-- 表的结构 `reports`
--

CREATE TABLE `reports` (
  `id` int(11) NOT NULL,
  `rid` int(11) NOT NULL COMMENT '对应reminders的id',
  `uid` int(11) NOT NULL COMMENT '对应users的id',
  `state` varchar(20) NOT NULL DEFAULT 'undone' COMMENT '执行情况',
  `fulfill` varchar(15) NOT NULL COMMENT '任务生效/完成时间'
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COMMENT='用户完成记忆任务的报告';

--
-- Indexes for dumped tables
--

--
-- Indexes for table `reports`
--
ALTER TABLE `reports`
  ADD PRIMARY KEY (`id`);

--
-- 在导出的表使用AUTO_INCREMENT
--

--
-- 使用表AUTO_INCREMENT `reports`
--
ALTER TABLE `reports`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
