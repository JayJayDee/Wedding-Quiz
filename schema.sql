SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;


CREATE TABLE `wedd_member` (
  `no` int(11) NOT NULL,
  `name` varchar(20) NOT NULL,
  `phone` varchar(20) NOT NULL,
  `reg_date` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `wedd_quiz_choice` (
  `no` int(11) NOT NULL,
  `quiz_no` int(11) NOT NULL,
  `seq` int(11) NOT NULL DEFAULT '0',
  `content` varchar(40) NOT NULL,
  `is_answer` int(11) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `wedd_quiz_play` (
  `no` int(11) NOT NULL,
  `quiz_no` int(11) NOT NULL,
  `member_no` int(11) NOT NULL,
  `seq` int(11) NOT NULL DEFAULT '0',
  `selected_choice_no` int(11) DEFAULT NULL,
  `is_played` int(11) NOT NULL DEFAULT '0',
  `is_win` int(11) NOT NULL DEFAULT '0',
  `played_date` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `wedd_quiz_pool` (
  `no` int(11) NOT NULL,
  `difficulty` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `wedd_quiz_question` (
  `no` int(11) NOT NULL,
  `quiz_no` int(11) NOT NULL,
  `seq` int(11) NOT NULL,
  `question_type` enum('TEXT','IMAGE') NOT NULL,
  `content` varchar(40) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


ALTER TABLE `wedd_member`
  ADD PRIMARY KEY (`no`);

ALTER TABLE `wedd_quiz_choice`
  ADD PRIMARY KEY (`no`);

ALTER TABLE `wedd_quiz_play`
  ADD PRIMARY KEY (`no`);

ALTER TABLE `wedd_quiz_pool`
  ADD PRIMARY KEY (`no`);

ALTER TABLE `wedd_quiz_question`
  ADD PRIMARY KEY (`no`);


ALTER TABLE `wedd_member`
  MODIFY `no` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;
ALTER TABLE `wedd_quiz_choice`
  MODIFY `no` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;
ALTER TABLE `wedd_quiz_play`
  MODIFY `no` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;
ALTER TABLE `wedd_quiz_pool`
  MODIFY `no` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;
ALTER TABLE `wedd_quiz_question`
  MODIFY `no` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
