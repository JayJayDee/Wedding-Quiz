-- phpMyAdmin SQL Dump
-- version 4.2.12deb2
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: 18-07-31 05:40
-- 서버 버전: 5.5.42-1
-- PHP 버전: 5.6.5-2

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- 데이터베이스: `weddquiz`
--

-- --------------------------------------------------------

--
-- 테이블 구조 `wedd_member`
--

CREATE TABLE IF NOT EXISTS `wedd_member` (
`no` int(11) NOT NULL,
  `name` varchar(20) NOT NULL,
  `phone` varchar(20) NOT NULL,
  `reg_date` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00'
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- 테이블 구조 `wedd_quiz_choice`
--

CREATE TABLE IF NOT EXISTS `wedd_quiz_choice` (
`no` int(11) NOT NULL,
  `quiz_no` int(11) NOT NULL,
  `seq` int(11) NOT NULL DEFAULT '0',
  `content` varchar(40) NOT NULL,
  `is_answer` int(11) NOT NULL DEFAULT '0'
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- 테이블 구조 `wedd_quiz_play`
--

CREATE TABLE IF NOT EXISTS `wedd_quiz_play` (
`no` int(11) NOT NULL,
  `quiz_no` int(11) NOT NULL,
  `member_no` int(11) NOT NULL,
  `seq` int(11) NOT NULL DEFAULT '0',
  `is_played` int(11) NOT NULL DEFAULT '0',
  `is_win` int(11) NOT NULL DEFAULT '0'
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- 테이블 구조 `wedd_quiz_pool`
--

CREATE TABLE IF NOT EXISTS `wedd_quiz_pool` (
`no` int(11) NOT NULL,
  `difficulty` int(11) NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- 테이블 구조 `wedd_quiz_question`
--

CREATE TABLE IF NOT EXISTS `wedd_quiz_question` (
`no` int(11) NOT NULL,
  `quiz_no` int(11) NOT NULL,
  `seq` int(11) NOT NULL,
  `question_type` enum('TEXT','IMAGE') NOT NULL,
  `content` varchar(40) NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8;

--
-- 덤프된 테이블의 인덱스
--

--
-- 테이블의 인덱스 `wedd_member`
--
ALTER TABLE `wedd_member`
 ADD PRIMARY KEY (`no`);

--
-- 테이블의 인덱스 `wedd_quiz_choice`
--
ALTER TABLE `wedd_quiz_choice`
 ADD PRIMARY KEY (`no`);

--
-- 테이블의 인덱스 `wedd_quiz_play`
--
ALTER TABLE `wedd_quiz_play`
 ADD PRIMARY KEY (`no`);

--
-- 테이블의 인덱스 `wedd_quiz_pool`
--
ALTER TABLE `wedd_quiz_pool`
 ADD PRIMARY KEY (`no`);

--
-- 테이블의 인덱스 `wedd_quiz_question`
--
ALTER TABLE `wedd_quiz_question`
 ADD PRIMARY KEY (`no`);

--
-- 덤프된 테이블의 AUTO_INCREMENT
--

--
-- 테이블의 AUTO_INCREMENT `wedd_member`
--
ALTER TABLE `wedd_member`
MODIFY `no` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=23;
--
-- 테이블의 AUTO_INCREMENT `wedd_quiz_choice`
--
ALTER TABLE `wedd_quiz_choice`
MODIFY `no` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=13;
--
-- 테이블의 AUTO_INCREMENT `wedd_quiz_play`
--
ALTER TABLE `wedd_quiz_play`
MODIFY `no` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=3;
--
-- 테이블의 AUTO_INCREMENT `wedd_quiz_pool`
--
ALTER TABLE `wedd_quiz_pool`
MODIFY `no` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=4;
--
-- 테이블의 AUTO_INCREMENT `wedd_quiz_question`
--
ALTER TABLE `wedd_quiz_question`
MODIFY `no` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=5;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
