-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema fintech_db
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema fintech_db
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `fintech_db` DEFAULT CHARACTER SET utf8 ;
USE `fintech_db` ;

-- -----------------------------------------------------
-- Table `fintech_db`.`tbl_user`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `fintech_db`.`tbl_user` (
  `no` INT NOT NULL AUTO_INCREMENT,
  `email_address` VARCHAR(45) NOT NULL,
  `name` VARCHAR(45) NULL,
  `passwd` VARCHAR(45) NULL,
  `address` VARCHAR(45) NULL,
  `current_point` INT NULL,
  `qr_data` VARCHAR(45) NULL,
  PRIMARY KEY (`no`, `email_address`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `fintech_db`.`tbl_store`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `fintech_db`.`tbl_store` (
  `No` INT NOT NULL,
  `store_id` VARCHAR(45) NOT NULL,
  `name` VARCHAR(45) NULL,
  `store_sort` INT NULL,
  `telno` VARCHAR(45) NULL,
  `country` VARCHAR(45) NULL,
  `address` VARCHAR(45) NULL,
  `latitude` VARCHAR(45) NULL,
  `longtitude` VARCHAR(45) NULL,
  PRIMARY KEY (`No`, `store_id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `fintech_db`.`tbl_transaction`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `fintech_db`.`tbl_transaction` (
  `no` INT NOT NULL AUTO_INCREMENT,
  `user_num` VARCHAR(45) NULL,
  `date` DATE NULL,
  `time` DATE NULL,
  `sort` INT NULL COMMENT '0: 적립\n1: 사용\n',
  `change_amount` INT NULL COMMENT '적립 동전량',
  `change_unit` VARCHAR(45) NULL COMMENT '동전 화폐단위',
  `USdollar_standard` VARCHAR(45) NULL COMMENT '거래시점 달러 환율시세',
  `USdollar_amount` VARCHAR(45) NULL COMMENT '시점 달러 환산 가격\n',
  `point_amount` VARCHAR(45) NULL,
  `point_exchange_rate` VARCHAR(45) NULL COMMENT '달러 대비 포인트 적립율',
  `store_id` INT NULL COMMENT '가맹점 ㅑㅇ\n',
  PRIMARY KEY (`no`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `fintech_db`.`tbl_store_sort`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `fintech_db`.`tbl_store_sort` (
  `no` INT NOT NULL AUTO_INCREMENT,
  `sort_sort` INT NOT NULL,
  `sort_name` VARCHAR(45) NULL,
  PRIMARY KEY (`no`, `sort_sort`))
ENGINE = InnoDB;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
