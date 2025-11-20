/**
 * Sudoku Game - Puzzle Generator
 * Version: 1.0.0
 * Date: 2025-11-20
 * Author: Doug Hesseltine
 * Copyright: Technologist.Services 2025
 */

const SudokuGenerator = (function() {
    'use strict';
    
    /**
     * Get box dimensions for board size
     */
    function getBoxDimensions(size) {
        if (size === 4) return { rows: 2, cols: 2 };
        if (size === 6) return { rows: 2, cols: 3 };
        if (size === 9) return { rows: 3, cols: 3 };
        throw new Error('Invalid board size');
    }
    
    /**
     * Get clue count based on size and difficulty
     */
    function getClueCount(size, difficulty) {
        const clues = {
            4: [12, 10, 8, 7, 6],
            6: [22, 19, 17, 15, 14],
            9: [50, 42, 35, 30, 26]
        };
        return clues[size][difficulty - 1];
    }
    
    /**
     * Create empty board
     */
    function createEmptyBoard(size) {
        return Array(size * size).fill(0);
    }
    
    /**
     * Get row from index
     */
    function getRow(index, size) {
        return Math.floor(index / size);
    }
    
    /**
     * Get column from index
     */
    function getCol(index, size) {
        return index % size;
    }
    
    /**
     * Get box index from row and column
     */
    function getBoxIndex(row, col, size) {
        const box = getBoxDimensions(size);
        return Math.floor(row / box.rows) * (size / box.rows) + Math.floor(col / box.cols);
    }
    
    /**
     * Check if number is valid in position
     */
    function isValid(board, index, num, size) {
        const row = getRow(index, size);
        const col = getCol(index, size);
        const boxIndex = getBoxIndex(row, col, size);
        const box = getBoxDimensions(size);
        
        // Check row
        for (let c = 0; c < size; c++) {
            if (board[row * size + c] === num) return false;
        }
        
        // Check column
        for (let r = 0; r < size; r++) {
            if (board[r * size + col] === num) return false;
        }
        
        // Check box
        const boxRow = Math.floor(boxIndex / (size / box.rows)) * box.rows;
        const boxCol = (boxIndex % (size / box.rows)) * box.cols;
        
        for (let r = boxRow; r < boxRow + box.rows; r++) {
            for (let c = boxCol; c < boxCol + box.cols; c++) {
                if (board[r * size + c] === num) return false;
            }
        }
        
        return true;
    }
    
    /**
     * Solve sudoku using backtracking
     */
    function solve(board, size) {
        const emptyIndex = board.indexOf(0);
        
        if (emptyIndex === -1) {
            return true; // Solved
        }
        
        // Try numbers 1 to size
        const numbers = Array.from({ length: size }, (_, i) => i + 1);
        
        // Shuffle for randomness
        for (let i = numbers.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [numbers[i], numbers[j]] = [numbers[j], numbers[i]];
        }
        
        for (const num of numbers) {
            if (isValid(board, emptyIndex, num, size)) {
                board[emptyIndex] = num;
                
                if (solve(board, size)) {
                    return true;
                }
                
                board[emptyIndex] = 0;
            }
        }
        
        return false;
    }
    
    /**
     * Generate complete valid solution
     */
    function generateSolution(size) {
        const board = createEmptyBoard(size);
        solve(board, size);
        return board;
    }
    
    /**
     * Count solutions (limit to 2 for efficiency)
     */
    function countSolutions(board, size, limit = 2) {
        let count = 0;
        
        function countHelper(tempBoard) {
            if (count >= limit) return;
            
            const emptyIndex = tempBoard.indexOf(0);
            
            if (emptyIndex === -1) {
                count++;
                return;
            }
            
            for (let num = 1; num <= size; num++) {
                if (isValid(tempBoard, emptyIndex, num, size)) {
                    tempBoard[emptyIndex] = num;
                    countHelper(tempBoard);
                    tempBoard[emptyIndex] = 0;
                    
                    if (count >= limit) return;
                }
            }
        }
        
        countHelper([...board]);
        return count;
    }
    
    /**
     * Remove clues to create puzzle
     */
    function removeCells(solution, clueCount, size) {
        const board = [...solution];
        const totalCells = size * size;
        const cellsToRemove = totalCells - clueCount;
        
        // Create list of all indices
        let indices = Array.from({ length: totalCells }, (_, i) => i);
        
        // Shuffle indices
        for (let i = indices.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [indices[i], indices[j]] = [indices[j], indices[i]];
        }
        
        let removed = 0;
        let attempts = 0;
        const maxAttempts = totalCells * 2;
        
        while (removed < cellsToRemove && attempts < maxAttempts) {
            if (indices.length === 0) break;
            
            const index = indices.pop();
            attempts++;
            
            if (board[index] === 0) continue;
            
            const backup = board[index];
            board[index] = 0;
            
            // Check if puzzle still has unique solution
            const solutions = countSolutions(board, size, 2);
            
            if (solutions === 1) {
                removed++;
            } else {
                // Restore cell if multiple solutions
                board[index] = backup;
            }
        }
        
        return board;
    }
    
    /**
     * Generate puzzle with difficulty
     */
    function generatePuzzle(size, difficulty) {
        // Generate complete solution
        const solution = generateSolution(size);
        
        // Get target clue count
        const clueCount = getClueCount(size, difficulty);
        
        // Remove cells to create puzzle
        const puzzle = removeCells(solution, clueCount, size);
        
        return {
            board: puzzle,
            solution: solution,
            size: size,
            difficulty: difficulty
        };
    }
    
    /**
     * Quick validation check (doesn't verify uniqueness)
     */
    function quickValidate(board, size) {
        const box = getBoxDimensions(size);
        
        // Check rows
        for (let r = 0; r < size; r++) {
            const seen = new Set();
            for (let c = 0; c < size; c++) {
                const num = board[r * size + c];
                if (num !== 0) {
                    if (seen.has(num)) return false;
                    seen.add(num);
                }
            }
        }
        
        // Check columns
        for (let c = 0; c < size; c++) {
            const seen = new Set();
            for (let r = 0; r < size; r++) {
                const num = board[r * size + c];
                if (num !== 0) {
                    if (seen.has(num)) return false;
                    seen.add(num);
                }
            }
        }
        
        // Check boxes
        const boxesPerRow = size / box.rows;
        for (let boxIdx = 0; boxIdx < size; boxIdx++) {
            const seen = new Set();
            const boxRow = Math.floor(boxIdx / boxesPerRow) * box.rows;
            const boxCol = (boxIdx % boxesPerRow) * box.cols;
            
            for (let r = boxRow; r < boxRow + box.rows; r++) {
                for (let c = boxCol; c < boxCol + box.cols; c++) {
                    const num = board[r * size + c];
                    if (num !== 0) {
                        if (seen.has(num)) return false;
                        seen.add(num);
                    }
                }
            }
        }
        
        return true;
    }
    
    // Public API
    return {
        generate: generatePuzzle,
        isValid: isValid,
        quickValidate: quickValidate,
        getBoxDimensions: getBoxDimensions,
        getRow: getRow,
        getCol: getCol,
        getBoxIndex: getBoxIndex
    };
})();
