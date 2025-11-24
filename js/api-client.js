/**
 * Sudoku Game - API Client
 * Version: 1.0.0
 * Date: 2025-11-20
 * Author: Doug Hesseltine
 * Copyright: Technologist.Services 2025
 */

const API = (function() {
    'use strict';
    
    const BASE_URL = 'api';
    const PENDING_SAVES_KEY = 'sudoku_pending_saves';
    
    /**
     * Make API request
     */
    async function request(endpoint, options = {}) {
        const url = `${BASE_URL}/${endpoint}`;
        const response = await fetch(url, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            }
        });
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        return await response.json();
    }
    
    /**
     * Get leaderboard for board size and difficulty
     */
    async function getLeaderboard(boardSize, difficulty) {
        try {
            let url = 'leaderboard.php';
            const params = [];
            
            if (boardSize !== null) {
                params.push(`board_size=${boardSize}`);
            }
            if (difficulty !== null) {
                params.push(`difficulty=${difficulty}`);
            }
            
            if (params.length > 0) {
                url += '?' + params.join('&');
            }
            
            const data = await request(url);
            return data;
        } catch (err) {
            console.error('Failed to get leaderboard:', err);
            return { board_size: boardSize, difficulty, items: [] };
        }
    }
    
    /**
     * Save game result
     */
    async function saveGame(result) {
        try {
            const data = await request('save-game.php', {
                method: 'POST',
                body: JSON.stringify(result)
            });
            
            // If successful and there are pending saves, try to flush them
            if (data.ok) {
                flushPendingSaves();
            }
            
            return data;
        } catch (err) {
            console.error('Failed to save game:', err);
            
            // Queue for later if offline
            queuePendingSave(result);
            
            throw err;
        }
    }
    
    /**
     * Get player history
     */
    async function getHistory(playerName) {
        try {
            const data = await request(`history.php?player_name=${encodeURIComponent(playerName)}`);
            return data;
        } catch (err) {
            console.error('Failed to get history:', err);
            return { player_name: playerName, items: [] };
        }
    }
    
    /**
     * Queue a failed save for later retry
     */
    function queuePendingSave(result) {
        try {
            const pending = JSON.parse(localStorage.getItem(PENDING_SAVES_KEY) || '[]');
            pending.push({
                result,
                timestamp: Date.now()
            });
            localStorage.setItem(PENDING_SAVES_KEY, JSON.stringify(pending));
            console.log('Queued game save for later retry');
        } catch (err) {
            console.error('Failed to queue pending save:', err);
        }
    }
    
    /**
     * Attempt to flush pending saves
     */
    async function flushPendingSaves() {
        try {
            const pending = JSON.parse(localStorage.getItem(PENDING_SAVES_KEY) || '[]');
            if (pending.length === 0) return;
            
            const failed = [];
            
            for (const item of pending) {
                try {
                    await request('save-game.php', {
                        method: 'POST',
                        body: JSON.stringify(item.result)
                    });
                    console.log('Successfully flushed pending save');
                } catch (err) {
                    failed.push(item);
                }
            }
            
            // Update pending list with only failed items
            localStorage.setItem(PENDING_SAVES_KEY, JSON.stringify(failed));
        } catch (err) {
            console.error('Failed to flush pending saves:', err);
        }
    }
    
    /**
     * Listen for online event to flush pending saves
     */
    window.addEventListener('online', () => {
        console.log('Back online, flushing pending saves...');
        flushPendingSaves();
    });
    
    // Public API
    return {
        getLeaderboard,
        saveGame,
        getHistory
    };
})();
