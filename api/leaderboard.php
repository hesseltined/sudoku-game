<?php
/**
 * Sudoku Game - Leaderboard API
 * Version: 1.0.0
 * Date: 2025-11-20
 * Author: Doug Hesseltine
 * Copyright: Technologist.Services 2025
 */

require_once __DIR__ . '/db.php';
require_once __DIR__ . '/util.php';

setCORSHeaders();

try {
    // Validate request method
    if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
        errorResponse('Method not allowed', 405);
    }
    
    // Get database connection
    $pdo = getDBConnection();
    
    // Check if filtering by board size and/or difficulty
    $boardSize = isset($_GET['board_size']) ? intval($_GET['board_size']) : null;
    $difficulty = isset($_GET['difficulty']) ? intval($_GET['difficulty']) : null;
    
    // Build query based on filters
    if ($boardSize !== null && $difficulty !== null) {
        // Specific board size and difficulty
        if (!isValidBoardSize($boardSize) || !isValidDifficultyLevel($difficulty)) {
            errorResponse('Invalid board size or difficulty level.');
        }
        
        $stmt = $pdo->prepare('
            SELECT 
                player_name, 
                board_size,
                difficulty_level,
                completion_time_seconds, 
                hints_used, 
                game_date
            FROM games
            WHERE board_size = :board_size AND difficulty_level = :difficulty
            ORDER BY completion_time_seconds ASC, game_date ASC
            LIMIT 50
        ');
        $stmt->execute(['board_size' => $boardSize, 'difficulty' => $difficulty]);
    } else {
        // All results
        $stmt = $pdo->prepare('
            SELECT 
                player_name, 
                board_size,
                difficulty_level,
                completion_time_seconds, 
                hints_used, 
                game_date
            FROM games
            ORDER BY board_size ASC, difficulty_level ASC, completion_time_seconds ASC, game_date ASC
            LIMIT 100
        ');
        $stmt->execute();
    }
    
    $results = $stmt->fetchAll();
    
    // Format response
    jsonResponse([
        'board_size' => $boardSize,
        'difficulty' => $difficulty,
        'items' => $results
    ]);
    
} catch (Exception $e) {
    error_log('Leaderboard error: ' . $e->getMessage());
    errorResponse('Failed to retrieve leaderboard', 500);
}
