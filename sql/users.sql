-- phpMyAdmin SQL Dump
-- version 4.5.5.1
-- http://www.phpmyadmin.net
--
-- Host: 127.0.0.1
-- Generation Time: 2016-07-29 14:30:02
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
-- 表的结构 `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL COMMENT '用户编号',
  `usermail` varchar(30) NOT NULL COMMENT '用户邮箱',
  `nickname` varchar(20) NOT NULL COMMENT '用户昵称',
  `password` varchar(35) NOT NULL COMMENT '用户密码',
  `img` varchar(30) NOT NULL DEFAULT '/img/default.png' COMMENT '用户头像图片'
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COMMENT='用户表';

--
-- Indexes for dumped tables
--

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `usermail` (`usermail`),
  ADD UNIQUE KEY `nickname` (`nickname`);

--
-- 在导出的表使用AUTO_INCREMENT
--

--
-- 使用表AUTO_INCREMENT `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '用户编号';
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
