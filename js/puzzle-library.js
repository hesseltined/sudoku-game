/**
 * Sudoku Game - Pre-generated Puzzle Library
 * Version: 1.0.0
 * Date: 2025-11-20
 * Author: Doug Hesseltine
 * Copyright: Technologist.Services 2025
 * 
 * NOTE: This library contains a subset of pre-generated puzzles for instant loading.
 * The game will fall back to the generator for more variety.
 */

const PuzzleLibrary = (function() {
    'use strict';
    
    const puzzles = {
        // 4x4 puzzles
        '4-1': [
            { board: [0,2,0,4, 3,0,2,0, 0,3,0,2, 2,0,3,0], solution: [1,2,3,4, 3,4,2,1, 4,3,1,2, 2,1,4,3] },
            { board: [0,0,3,0, 0,3,0,2, 3,0,2,0, 0,2,0,0], solution: [2,4,3,1, 1,3,4,2, 3,1,2,4, 4,2,1,3] }
        ],
        '4-3': [
            { board: [0,0,0,4, 0,4,0,0, 0,0,4,0, 2,0,0,0], solution: [1,2,3,4, 3,4,2,1, 4,1,2,3, 2,3,1,4] },
            { board: [0,0,0,0, 0,0,2,1, 3,2,0,0, 0,0,0,0], solution: [2,4,3,1, 4,3,2,1, 3,2,1,4, 1,4,3,2] }
        ],
        '4-5': [
            { board: [0,0,0,0, 0,4,0,1, 3,0,2,0, 0,0,0,0], solution: [1,2,3,4, 2,4,3,1, 3,1,2,4, 4,3,1,2] },
            { board: [0,0,3,0, 3,0,0,0, 0,0,0,2, 0,2,0,0], solution: [1,4,3,2, 3,2,1,4, 4,1,3,2, 2,3,4,1] }
        ],
        
        // 6x6 puzzles
        '6-1': [
            { board: [0,2,0,0,5,6, 0,0,6,0,0,2, 2,0,0,6,0,0, 0,0,2,0,0,5, 5,0,0,2,0,0, 6,3,0,0,1,0], 
              solution: [1,2,3,4,5,6, 4,5,6,1,3,2, 2,1,5,6,4,3, 3,6,4,5,2,1, 5,4,1,2,6,3, 6,3,2,3,1,4] }
        ],
        '6-3': [
            { board: [0,0,0,4,0,6, 0,0,6,0,0,0, 0,0,0,0,0,5, 5,0,0,0,0,0, 0,0,0,2,0,0, 6,0,2,0,0,0], 
              solution: [1,2,3,4,5,6, 4,5,6,1,2,3, 2,3,1,6,4,5, 5,6,4,3,1,2, 3,1,5,2,6,4, 6,4,2,5,3,1] }
        ],
        '6-5': [
            { board: [0,0,0,0,0,0, 0,5,0,0,0,2, 0,0,0,0,4,0, 0,6,0,0,0,0, 3,0,0,0,6,0, 0,0,0,0,0,0], 
              solution: [1,2,3,4,5,6, 4,5,6,1,3,2, 2,3,1,6,4,5, 5,6,4,2,1,3, 3,1,5,2,6,4, 6,4,2,5,3,1] }
        ],
        
        // 9x9 puzzles  
        '9-1': [
            { board: [5,3,0,0,7,0,0,0,0, 6,0,0,1,9,5,0,0,0, 0,9,8,0,0,0,0,6,0, 8,0,0,0,6,0,0,0,3, 4,0,0,8,0,3,0,0,1, 7,0,0,0,2,0,0,0,6, 0,6,0,0,0,0,2,8,0, 0,0,0,4,1,9,0,0,5, 0,0,0,0,8,0,0,7,9],
              solution: [5,3,4,6,7,8,9,1,2, 6,7,2,1,9,5,3,4,8, 1,9,8,3,4,2,5,6,7, 8,5,9,7,6,1,4,2,3, 4,2,6,8,5,3,7,9,1, 7,1,3,9,2,4,8,5,6, 9,6,1,5,3,7,2,8,4, 2,8,7,4,1,9,6,3,5, 3,4,5,2,8,6,1,7,9] }
        ],
        '9-3': [
            { board: [0,0,0,0,0,0,0,1,2, 0,0,0,0,3,5,0,0,0, 0,0,0,6,0,0,7,0,0, 7,0,0,0,0,0,3,0,0, 0,0,0,4,0,0,8,0,0, 1,0,0,0,0,0,0,0,0, 0,0,0,1,2,0,0,0,0, 0,8,0,0,0,0,0,4,0, 0,5,0,0,0,0,6,0,0],
              solution: [6,7,3,8,9,4,5,1,2, 9,1,2,7,3,5,4,8,6, 8,4,5,6,1,2,7,3,9, 7,9,8,2,6,1,3,5,4, 3,2,6,4,5,9,8,7,1, 1,5,4,3,8,7,2,9,6, 4,3,9,1,2,8,5,6,7, 2,8,7,5,4,6,9,1,3, 5,6,1,9,7,3,8,2,4] }
        ],
        '9-5': [
            { board: [0,0,0,0,0,0,0,0,0, 0,0,0,0,0,3,0,8,5, 0,0,1,0,2,0,0,0,0, 0,0,0,5,0,7,0,0,0, 0,0,4,0,0,0,1,0,0, 0,9,0,0,0,0,0,0,0, 5,0,0,0,0,0,0,7,3, 0,0,2,0,1,0,0,0,0, 0,0,0,0,4,0,0,0,9],
              solution: [9,8,7,6,5,4,3,2,1, 2,4,6,1,7,3,9,8,5, 3,5,1,9,2,8,7,4,6, 1,2,8,5,3,7,6,9,4, 6,3,4,8,9,2,1,5,7, 7,9,5,4,6,1,8,3,2, 5,1,9,2,8,6,4,7,3, 4,7,2,3,1,9,5,6,8, 8,6,3,7,4,5,2,1,9] }
        ]
    };
    
    /**
     * Get a random pre-generated puzzle
     */
    function getPuzzle(size, difficulty) {
        const key = `${size}-${difficulty}`;
        const collection = puzzles[key];
        
        if (!collection || collection.length === 0) {
            return null; // Fall back to generator
        }
        
        const randomIndex = Math.floor(Math.random() * collection.length);
        const puzzle = collection[randomIndex];
        
        return {
            board: [...puzzle.board],
            solution: [...puzzle.solution],
            size: size,
            difficulty: difficulty,
            preGenerated: true
        };
    }
    
    /**
     * Get puzzle - tries library first, then falls back to generator
     */
    function getOrGenerate(size, difficulty) {
        // DISABLED: Pre-generated puzzles have bugs, use generator only
        // const preGen = getPuzzle(size, difficulty);
        // if (preGen) {
        //     return preGen;
        // }
        
        // Use generator directly
        if (typeof SudokuGenerator !== 'undefined') {
            return SudokuGenerator.generate(size, difficulty);
        }
        
        throw new Error('No puzzles available and generator not loaded');
    }
    
    // Public API
    return {
        get: getPuzzle,
        getOrGenerate: getOrGenerate
    };
})();
