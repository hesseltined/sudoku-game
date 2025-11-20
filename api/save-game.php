<?php
/**
 * Sudoku Game - Save Game API
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
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        errorResponse('Method not allowed', 405);
    }
    
    // Get POST data
    $json = file_get_contents('php://input');
    $data = json_decode($json, true);
    
    if ($data === null) {
        errorResponse('Invalid JSON data');
    }
    
    // Validate game result
    $error = validateGameResult($data);
    if ($error !== null) {
        errorResponse($error);
    }
    
    // Sanitize player name
    $playerName = sanitizePlayerName($data['player_name']);
    
    // Get database connection
    $pdo = getDBConnection();
    
    // Insert game result
    $stmt = $pdo->prepare('
        INSERT INTO games (
            player_name,
            board_size,
            difficulty_level,
            completion_time_seconds,
            hints_used,
            mistakes_made
        ) VALUES (
            :player_name,
            :board_size,
            :difficulty_level,
            :completion_time_seconds,
            :hints_used,
            :mistakes_made
        )
    ');
    
    $stmt->execute([
        'player_name' => $playerName,
        'board_size' => (int)$data['board_size'],
        'difficulty_level' => (int)$data['difficulty_level'],
        'completion_time_seconds' => (int)$data['completion_time_seconds'],
        'hints_used' => (int)$data['hints_used'],
        'mistakes_made' => isset($data['mistakes_made']) ? (int)$data['mistakes_made'] : 0
    ]);
    
    // Return success response
    jsonResponse([
        'ok' => true,
        'message' => 'Game saved successfully',
        'id' => $pdo->lastInsertId()
    ]);
    
} catch (Exception $e) {
    error_log('Save game error: ' . $e->getMessage());
    errorResponse('Failed to save game', 500);
}
