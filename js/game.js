/**
 * Sudoku Game - Core Game Logic
 * Version: 1.0.0
 * Date: 2025-11-20
 * Author: Doug Hesseltine
 * Copyright: Technologist.Services 2025
 */

const SudokuGame = (function() {
    'use strict';
    
    let gameState = {
        currentBoard: [],
        solution: [],
        initialBoard: [],
        size: 9,
        difficulty: 3,
        selectedCell: null,
        moveHistory: [],
        hintsRemaining: 3,
        hintsUsed: 0,
        timerSeconds: 0,
        timerInterval: null,
        timerStarted: false,
        isPaused: false,
        gameStarted: false,
        gameCompleted: false,
        instantErrors: false,
        playerName: ''
    };
    
    /**
     * Initialize new game
     */
    function newGame(size, difficulty, instantErrors) {
        // Stop existing timer
        if (gameState.timerInterval) {
            clearInterval(gameState.timerInterval);
        }
        
        // Get puzzle from library or generator
        const puzzle = PuzzleLibrary.getOrGenerate(size, difficulty);
        
        // Reset state
        gameState = {
            currentBoard: [...puzzle.board],
            solution: [...puzzle.solution],
            initialBoard: [...puzzle.board],
            size: size,
            difficulty: difficulty,
            selectedCell: null,
            moveHistory: [],
            hintsRemaining: 3,
            hintsUsed: 0,
            timerSeconds: 0,
            timerInterval: null,
            timerStarted: false,
            isPaused: false,
            gameStarted: true,
            gameCompleted: false,
            instantErrors: instantErrors,
            playerName: gameState.playerName || ''
        };
        
        return gameState;
    }
    
    /**
     * Start timer on first move
     */
    function startTimer() {
        if (gameState.timerStarted || gameState.isPaused) return;
        
        gameState.timerStarted = true;
        gameState.timerInterval = setInterval(() => {
            if (!gameState.isPaused && !gameState.gameCompleted) {
                gameState.timerSeconds++;
            }
        }, 1000);
    }
    
    /**
     * Pause/Resume game
     */
    function togglePause() {
        gameState.isPaused = !gameState.isPaused;
        return gameState.isPaused;
    }
    
    /**
     * Select cell
     */
    function selectCell(index) {
        if (gameState.gameCompleted) return false;
        if (gameState.isPaused) return false;
        if (gameState.initialBoard[index] !== 0) return false; // Can't select given cells
        
        gameState.selectedCell = index;
        return true;
    }
    
    /**
     * Set cell value
     */
    function setCellValue(index, value) {
        if (gameState.gameCompleted) return false;
        if (gameState.isPaused) return false;
        if (gameState.initialBoard[index] !== 0) return false;
        
        // Start timer on first move
        if (!gameState.timerStarted) {
            startTimer();
        }
        
        // Save to history
        gameState.moveHistory.push({
            index: index,
            oldValue: gameState.currentBoard[index],
            newValue: value
        });
        
        // Update board
        gameState.currentBoard[index] = value;
        
        // Check if game is complete
        if (isComplete()) {
            gameState.gameCompleted = true;
            if (gameState.timerInterval) {
                clearInterval(gameState.timerInterval);
            }
        }
        
        return true;
    }
    
    /**
     * Undo last move
     */
    function undo() {
        if (gameState.moveHistory.length === 0) return false;
        if (gameState.gameCompleted) return false;
        
        const lastMove = gameState.moveHistory.pop();
        gameState.currentBoard[lastMove.index] = lastMove.oldValue;
        
        return true;
    }
    
    /**
     * Get hint for selected cell
     */
    function getHint() {
        if (gameState.hintsRemaining <= 0) return null;
        if (gameState.selectedCell === null) return null;
        if (gameState.gameCompleted) return null;
        if (gameState.isPaused) return null;
        
        const index = gameState.selectedCell;
        
        // Can't hint on given cells or already correct cells
        if (gameState.initialBoard[index] !== 0) return null;
        if (gameState.currentBoard[index] === gameState.solution[index]) return null;
        
        // Start timer on first hint
        if (!gameState.timerStarted) {
            startTimer();
        }
        
        // Use hint
        gameState.hintsRemaining--;
        gameState.hintsUsed++;
        
        const correctValue = gameState.solution[index];
        
        // Save to history
        gameState.moveHistory.push({
            index: index,
            oldValue: gameState.currentBoard[index],
            newValue: correctValue
        });
        
        // Set correct value
        gameState.currentBoard[index] = correctValue;
        
        // Check if game is complete
        if (isComplete()) {
            gameState.gameCompleted = true;
            if (gameState.timerInterval) {
                clearInterval(gameState.timerInterval);
            }
        }
        
        return correctValue;
    }
    
    /**
     * Check if board is complete and correct
     */
    function isComplete() {
        // Check if all cells are filled
        if (gameState.currentBoard.includes(0)) return false;
        
        // Check if matches solution
        for (let i = 0; i < gameState.currentBoard.length; i++) {
            if (gameState.currentBoard[i] !== gameState.solution[i]) {
                return false;
            }
        }
        
        return true;
    }
    
    /**
     * Check if cell has error (for instant error highlighting)
     */
    function isCellError(index) {
        if (!gameState.instantErrors) return false;
        
        const value = gameState.currentBoard[index];
        if (value === 0) return false;
        
        const size = gameState.size;
        const row = Math.floor(index / size);
        const col = index % size;
        
        // Check for duplicates in row
        for (let c = 0; c < size; c++) {
            const cellIndex = row * size + c;
            if (cellIndex !== index && gameState.currentBoard[cellIndex] === value) {
                return true;
            }
        }
        
        // Check for duplicates in column
        for (let r = 0; r < size; r++) {
            const cellIndex = r * size + col;
            if (cellIndex !== index && gameState.currentBoard[cellIndex] === value) {
                return true;
            }
        }
        
        // Check for duplicates in box/region
        const boxDims = SudokuGenerator.getBoxDimensions(size);
        const boxRow = Math.floor(row / boxDims.rows) * boxDims.rows;
        const boxCol = Math.floor(col / boxDims.cols) * boxDims.cols;
        
        for (let r = boxRow; r < boxRow + boxDims.rows; r++) {
            for (let c = boxCol; c < boxCol + boxDims.cols; c++) {
                const cellIndex = r * size + c;
                if (cellIndex !== index && gameState.currentBoard[cellIndex] === value) {
                    return true;
                }
            }
        }
        
        return false;
    }
    
    /**
     * Validate current board state
     */
    function validateBoard() {
        return SudokuGenerator.quickValidate(gameState.currentBoard, gameState.size);
    }
    
    /**
     * Format time as MM:SS
     */
    function formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    
    /**
     * Get game result data
     */
    function getGameResult() {
        if (!gameState.gameCompleted) return null;
        
        return {
            player_name: gameState.playerName || 'Anonymous',
            board_size: gameState.size,
            difficulty_level: gameState.difficulty,
            completion_time_seconds: gameState.timerSeconds,
            hints_used: gameState.hintsUsed,
            mistakes_made: 0 // Could track this if needed
        };
    }
    
    /**
     * Set player name
     */
    function setPlayerName(name) {
        gameState.playerName = name.trim() || 'Anonymous';
    }
    
    /**
     * Get current state
     */
    function getState() {
        return {
            ...gameState,
            currentBoard: [...gameState.currentBoard],
            solution: [...gameState.solution],
            initialBoard: [...gameState.initialBoard],
            moveHistory: [...gameState.moveHistory]
        };
    }
    
    /**
     * Is cell given (part of initial puzzle)
     */
    function isCellGiven(index) {
        return gameState.initialBoard[index] !== 0;
    }
    
    /**
     * Get cell value
     */
    function getCellValue(index) {
        return gameState.currentBoard[index];
    }
    
    // Public API
    return {
        newGame,
        selectCell,
        setCellValue,
        undo,
        getHint,
        togglePause,
        isComplete,
        isCellError,
        isCellGiven,
        getCellValue,
        validateBoard,
        formatTime,
        getGameResult,
        setPlayerName,
        getState
    };
})();
