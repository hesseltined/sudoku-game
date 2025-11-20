--
-- Sudoku Game - Database Setup
-- Version: 1.0.0
-- Date: 2025-11-20
-- Author: Doug Hesseltine
-- Copyright: Technologist.Services 2025
--

-- Create database
CREATE DATABASE IF NOT EXISTS sudoku_game CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE sudoku_game;

-- Create games table
CREATE TABLE IF NOT EXISTS games (
    id INT AUTO_INCREMENT PRIMARY KEY,
    player_name VARCHAR(64) NOT NULL,
    board_size TINYINT NOT NULL,
    difficulty_level TINYINT NOT NULL,
    completion_time_seconds INT NOT NULL,
    hints_used TINYINT DEFAULT 0,
    mistakes_made INT DEFAULT 0,
    game_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_leaderboard (board_size, difficulty_level, completion_time_seconds),
    INDEX idx_player (player_name, game_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create database user (update password before running)
-- CREATE USER 'sudoku_user'@'localhost' IDENTIFIED BY 'your_secure_password_here';
-- GRANT SELECT, INSERT ON sudoku_game.* TO 'sudoku_user'@'localhost';
-- FLUSH PRIVILEGES;
