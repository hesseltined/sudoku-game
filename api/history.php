<?php
/**
 * Sudoku Game - Player History API
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
    
    // Get and validate player name parameter
    $playerName = isset($_GET['player_name']) ? trim($_GET['player_name']) : '';
    
    if (empty($playerName)) {
        errorResponse('Player name is required');
    }
    
    // Get database connection
    $pdo = getDBConnection();
    
    // Query player's game history
    $stmt = $pdo->prepare('
        SELECT 
            board_size,
            difficulty_level,
            completion_time_seconds,
            hints_used,
            mistakes_made,
            game_date
        FROM games
        WHERE player_name = :player_name
        ORDER BY game_date DESC
        LIMIT 50
    ');
    
    $stmt->execute(['player_name' => $playerName]);
    $results = $stmt->fetchAll();
    
    // Format response
    jsonResponse([
        'player_name' => $playerName,
        'items' => $results
    ]);
    
} catch (Exception $e) {
    error_log('History error: ' . $e->getMessage());
    errorResponse('Failed to retrieve history', 500);
}
