-- phpMyAdmin SQL Dump
-- version 3.4.10.1
-- http://www.phpmyadmin.net
--
-- 主机: localhost
-- 生成日期: 2016 年 08 月 04 日 16:02
-- 服务器版本: 5.5.20
-- PHP 版本: 5.3.10

SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- 数据库: `xremind`
--

-- --------------------------------------------------------

--
-- 表的结构 `reminders`
--

CREATE TABLE IF NOT EXISTS `reminders` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '提醒项目编号',
  `shortid` varchar(15) NOT NULL COMMENT '短标识码',
  `uid` int(11) NOT NULL COMMENT '拥有者编号',
  `data` text NOT NULL COMMENT '项目参数',
  `target` varchar(15) NOT NULL DEFAULT '1469525261916' COMMENT '下次提醒的时间戳',
  `create` varchar(15) NOT NULL DEFAULT '1469525261916' COMMENT '项目创建时间',
  `interval` varchar(15) NOT NULL DEFAULT '60000' COMMENT '下次提醒的间隔',
  `status` varchar(10) NOT NULL DEFAULT 'wait' COMMENT '项目状态',
  PRIMARY KEY (`id`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 COMMENT='提醒项目表' AUTO_INCREMENT=25 ;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
