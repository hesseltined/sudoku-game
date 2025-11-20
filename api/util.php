<?php
/**
 * Sudoku Game - Utility Functions
 * Version: 1.0.0
 * Date: 2025-11-20
 * Author: Doug Hesseltine
 * Copyright: Technologist.Services 2025
 */

require_once __DIR__ . '/config.php';

/**
 * Set CORS headers
 */
function setCORSHeaders() {
    header('Access-Control-Allow-Origin: ' . ALLOWED_ORIGIN);
    header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type');
    
    // Handle preflight requests
    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        http_response_code(200);
        exit();
    }
}

/**
 * Send JSON response
 */
function jsonResponse($data, $statusCode = 200) {
    http_response_code($statusCode);
    header('Content-Type: application/json');
    echo json_encode($data);
    exit();
}

/**
 * Send error response
 */
function errorResponse($message, $statusCode = 400) {
    jsonResponse(['error' => $message], $statusCode);
}

/**
 * Validate board size
 */
function isValidBoardSize($size) {
    return in_array((int)$size, [4, 6, 9], true);
}

/**
 * Validate difficulty level
 */
function isValidDifficultyLevel($level) {
    $level = (int)$level;
    return $level >= 1 && $level <= 5;
}

/**
 * Sanitize player name
 */
function sanitizePlayerName($name) {
    $name = trim($name);
    if (empty($name)) {
        return 'Anonymous';
    }
    return substr($name, 0, 64);
}

/**
 * Validate game result data
 */
function validateGameResult($data) {
    $required = ['player_name', 'board_size', 'difficulty_level', 'completion_time_seconds', 'hints_used'];
    
    foreach ($required as $field) {
        if (!isset($data[$field])) {
            return "Missing required field: $field";
        }
    }
    
    if (!isValidBoardSize($data['board_size'])) {
        return 'Invalid board size. Must be 4, 6, or 9';
    }
    
    if (!isValidDifficultyLevel($data['difficulty_level'])) {
        return 'Invalid difficulty level. Must be 1-5';
    }
    
    if (!is_numeric($data['completion_time_seconds']) || $data['completion_time_seconds'] < 0) {
        return 'Invalid completion time';
    }
    
    if (!is_numeric($data['hints_used']) || $data['hints_used'] < 0 || $data['hints_used'] > 3) {
        return 'Invalid hints used count';
    }
    
    return null; // No errors
}
