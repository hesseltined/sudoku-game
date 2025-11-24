/**
 * Sudoku Game - UI Controller
 * Version: 1.1.0
 * Date Modified: 2025-11-20
 * Author: Doug Hesseltine
 * Copyright: Technologist.Services 2025
 */

(function() {
    'use strict';
    
    // DOM elements
    const elements = {
        playerName: document.getElementById('player-name'),
        boardSize: document.getElementById('board-size'),
        difficultySlider: document.getElementById('difficulty-slider'),
        themeSelector: document.getElementById('theme-selector'),
        instantErrors: document.getElementById('instant-errors'),
        btnNewGame: document.getElementById('btn-new-game'),
        btnPause: document.getElementById('btn-pause'),
        btnUndo: document.getElementById('btn-undo'),
        btnHint: document.getElementById('btn-hint'),
        timer: document.getElementById('timer'),
        hintsDisplay: document.getElementById('hints-display'),
        hintsRemaining: document.getElementById('hints-remaining'),
        gameBoard: document.getElementById('game-board'),
        numberPad: document.getElementById('number-pad'),
        pauseOverlay: document.getElementById('pause-overlay'),
        leaderboardTable: document.getElementById('leaderboard-table').getElementsByTagName('tbody')[0],
        sizeTabs: document.querySelectorAll('.size-tab'),
        difficultyTabs: document.querySelectorAll('.difficulty-tab')
    };
    
    let currentLeaderboardSize = null; // null = show all
    let currentLeaderboardDifficulty = null; // null = show all
    
    /**
     * Initialize application
     */
    function init() {
        // Load saved theme
        const savedTheme = localStorage.getItem('sudoku-theme') || 'classic';
        applyTheme(savedTheme);
        elements.themeSelector.value = savedTheme;
        
        // Load saved player name
        const savedName = localStorage.getItem('sudoku-player-name') || '';
        elements.playerName.value = savedName;
        SudokuGame.setPlayerName(savedName);
        
        // Set default to 6x6 intermediate (difficulty 3)
        elements.boardSize.value = '6';
        elements.difficultySlider.value = '3';
        
        // Set up event listeners
        setupEventListeners();
        
        // Start a new game with default settings
        startNewGame();
        
        // Load initial leaderboard (all results)
        loadLeaderboard(null, null);
    }
    
    /**
     * Set up all event listeners
     */
    function setupEventListeners() {
        // Player name
        elements.playerName.addEventListener('change', () => {
            const name = elements.playerName.value.trim();
            SudokuGame.setPlayerName(name);
            localStorage.setItem('sudoku-player-name', name);
        });
        
        // Board size - auto start new game
        elements.boardSize.addEventListener('change', () => {
            startNewGame();
            scrollToBoard();
        });
        
        // Difficulty - auto start new game
        elements.difficultySlider.addEventListener('input', () => {
            startNewGame();
            scrollToBoard();
        });
        
        // Theme selector
        elements.themeSelector.addEventListener('change', () => {
            const theme = elements.themeSelector.value;
            applyTheme(theme);
            localStorage.setItem('sudoku-theme', theme);
        });
        
        // Instant errors checkbox - update game state and re-render
        const instantErrorsCheckbox = document.getElementById('instant-errors');
        if (instantErrorsCheckbox) {
            instantErrorsCheckbox.addEventListener('change', () => {
                SudokuGame.setInstantErrors(instantErrorsCheckbox.checked);
                renderBoard();
            });
        }
        
        // Buttons
        elements.btnNewGame.addEventListener('click', startNewGame);
        elements.btnPause.addEventListener('click', togglePause);
        elements.btnUndo.addEventListener('click', handleUndo);
        elements.btnHint.addEventListener('click', handleHint);
        
        // Toggle controls
        document.getElementById('toggle-controls').addEventListener('click', toggleControls);
        
        // Keyboard support
        document.addEventListener('keydown', handleKeyPress);
        
        // Leaderboard tabs
        elements.sizeTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const size = parseInt(tab.dataset.size);
                currentLeaderboardSize = size;
                updateActiveTab(elements.sizeTabs, tab);
                loadLeaderboard(size, currentLeaderboardDifficulty);
            });
        });
        
        elements.difficultyTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const difficulty = parseInt(tab.dataset.difficulty);
                currentLeaderboardDifficulty = difficulty;
                updateActiveTab(elements.difficultyTabs, tab);
                loadLeaderboard(currentLeaderboardSize, difficulty);
            });
        });
    }
    
    /**
     * Start new game
     */
    function startNewGame() {
        const size = parseInt(elements.boardSize.value);
        const difficulty = parseInt(elements.difficultySlider.value);
        const instantErrorsCheckbox = document.getElementById('instant-errors');
        const instantErrors = instantErrorsCheckbox ? instantErrorsCheckbox.checked : false;
        
        // Hide completion message
        document.getElementById('completion-message').style.display = 'none';
        
        SudokuGame.newGame(size, difficulty, instantErrors);
        
        renderBoard();
        renderNumberPad(size);
        updateUI();
        
        // Keep leaderboard filter unchanged when starting new game
    }
    
    /**
     * Render game board
     */
    function renderBoard() {
        const state = SudokuGame.getState();
        elements.gameBoard.innerHTML = '';
        elements.gameBoard.className = `board size-${state.size}`;
        
        for (let i = 0; i < state.size * state.size; i++) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            cell.dataset.index = i;
            
            const value = state.currentBoard[i];
            if (value !== 0) {
                cell.textContent = value;
            }
            
            if (SudokuGame.isCellGiven(i)) {
                cell.classList.add('given');
            }
            
            if (state.selectedCell === i) {
                cell.classList.add('selected');
            }
            
            if (SudokuGame.isCellError(i)) {
                cell.classList.add('error');
            }
            
            if (state.gameCompleted) {
                cell.classList.add('completed');
            }
            
            cell.addEventListener('click', () => handleCellClick(i));
            
            elements.gameBoard.appendChild(cell);
        }
    }
    
    /**
     * Render number pad
     */
    function renderNumberPad(size) {
        elements.numberPad.innerHTML = '';
        
        for (let num = 1; num <= size; num++) {
            const btn = document.createElement('button');
            btn.className = 'number-btn';
            btn.textContent = num;
            btn.addEventListener('click', () => handleNumberInput(num));
            elements.numberPad.appendChild(btn);
        }
        
        // Add clear button
        const clearBtn = document.createElement('button');
        clearBtn.className = 'number-btn';
        clearBtn.textContent = 'X';
        clearBtn.addEventListener('click', () => handleNumberInput(0));
        elements.numberPad.appendChild(clearBtn);
    }
    
    /**
     * Handle cell click
     */
    function handleCellClick(index) {
        if (SudokuGame.selectCell(index)) {
            renderBoard();
            
            // Auto-collapse controls on first interaction
            const panel = document.getElementById('controls-panel');
            const btn = document.getElementById('toggle-controls');
            if (panel && panel.style.display !== 'none') {
                panel.style.display = 'none';
                btn.innerHTML = '&#9660;'; // Down arrow
            }
        }
    }
    
    /**
     * Handle number input
     */
    function handleNumberInput(num) {
        const state = SudokuGame.getState();
        
        if (state.selectedCell !== null) {
            if (SudokuGame.setCellValue(state.selectedCell, num)) {
                renderBoard();
                updateUI();
                
                // Check if game is complete
                if (state.gameCompleted || SudokuGame.isComplete()) {
                    handleGameComplete();
                }
            }
        }
    }
    
    /**
     * Handle keyboard input
     */
    function handleKeyPress(e) {
        const state = SudokuGame.getState();
        
        if (state.isPaused || state.gameCompleted) return;
        
        // Number keys
        if (e.key >= '1' && e.key <= '9') {
            const num = parseInt(e.key);
            if (num <= state.size) {
                handleNumberInput(num);
            }
        }
        
        // Backspace/Delete for clear
        if (e.key === 'Backspace' || e.key === 'Delete') {
            handleNumberInput(0);
        }
        
        // Arrow keys for navigation
        if (state.selectedCell !== null) {
            let newIndex = state.selectedCell;
            const row = Math.floor(state.selectedCell / state.size);
            const col = state.selectedCell % state.size;
            
            switch(e.key) {
                case 'ArrowUp':
                    if (row > 0) newIndex = (row - 1) * state.size + col;
                    e.preventDefault();
                    break;
                case 'ArrowDown':
                    if (row < state.size - 1) newIndex = (row + 1) * state.size + col;
                    e.preventDefault();
                    break;
                case 'ArrowLeft':
                    if (col > 0) newIndex = row * state.size + (col - 1);
                    e.preventDefault();
                    break;
                case 'ArrowRight':
                    if (col < state.size - 1) newIndex = row * state.size + (col + 1);
                    e.preventDefault();
                    break;
            }
            
            if (newIndex !== state.selectedCell) {
                SudokuGame.selectCell(newIndex);
                renderBoard();
            }
        }
    }
    
    /**
     * Handle undo button
     */
    function handleUndo() {
        if (SudokuGame.undo()) {
            renderBoard();
            updateUI();
        }
    }
    
    /**
     * Handle hint button
     */
    function handleHint() {
        const state = SudokuGame.getState();
        
        if (state.selectedCell === null) {
            alert('Please select a cell first');
            return;
        }
        
        if (state.hintsRemaining === 0) {
            alert('No hints remaining');
            return;
        }
        
        if (SudokuGame.isCellGiven(state.selectedCell)) {
            alert('Cannot use hint on given cells');
            return;
        }
        
        const hint = SudokuGame.getHint();
        if (hint !== null) {
            renderBoard();
            updateUI();
            
            if (SudokuGame.isComplete()) {
                handleGameComplete();
            }
        }
    }
    
    /**
     * Toggle pause
     */
    function togglePause() {
        const isPaused = SudokuGame.togglePause();
        
        if (isPaused) {
            elements.pauseOverlay.style.display = 'flex';
            elements.btnPause.textContent = 'Resume';
        } else {
            elements.pauseOverlay.style.display = 'none';
            elements.btnPause.textContent = 'Pause';
        }
    }
    
    /**
     * Update UI elements (timer, hints, buttons)
     */
    function updateUI() {
        const state = SudokuGame.getState();
        
        // Timer
        elements.timer.textContent = SudokuGame.formatTime(state.timerSeconds);
        
        // Hints
        elements.hintsDisplay.textContent = `${state.hintsRemaining} / 3`;
        elements.hintsRemaining.textContent = state.hintsRemaining;
        
        // Undo button
        elements.btnUndo.disabled = state.moveHistory.length === 0 || state.gameCompleted;
        
        // Hint button
        elements.btnHint.disabled = state.hintsRemaining === 0 || state.gameCompleted;
        
        // Pause button
        elements.btnPause.disabled = state.gameCompleted;
    }
    
    /**
     * Handle game completion
     */
    async function handleGameComplete() {
        const result = SudokuGame.getGameResult();
        
        if (!result) return;
        
        const timeStr = SudokuGame.formatTime(result.completion_time_seconds);
        
        // Display completion message
        const completionDiv = document.getElementById('completion-message');
        completionDiv.innerHTML = `
            <h3>Congratulations!</h3>
            <p>You completed the puzzle in ${timeStr}</p>
            <p>Hints used: ${result.hints_used}</p>
        `;
        completionDiv.style.display = 'block';
        
        // Expand controls panel so user can start new game
        const panel = document.getElementById('controls-panel');
        const btn = document.getElementById('toggle-controls');
        if (panel && panel.style.display === 'none') {
            panel.style.display = 'block';
            btn.innerHTML = '&#9650;'; // Up arrow
        }
        
        // Save to leaderboard
        try {
            await API.saveGame(result);
            // Reload leaderboard
            loadLeaderboard(currentLeaderboardSize, currentLeaderboardDifficulty);
        } catch (err) {
            console.error('Failed to save game:', err);
        }
    }
    
    /**
     * Load leaderboard from server
     */
    async function loadLeaderboard(size, difficulty) {
        const showAll = size === null;
        const colspan = showAll ? 7 : 5;
        
        elements.leaderboardTable.innerHTML = `<tr><td colspan="${colspan}">Loading...</td></tr>`;
        
        // Update table header
        const header = document.getElementById('leaderboard-header');
        if (showAll) {
            header.innerHTML = `
                <tr>
                    <th>Rank</th>
                    <th>Player</th>
                    <th>Size</th>
                    <th>Difficulty</th>
                    <th>Time</th>
                    <th>Hints</th>
                    <th>Date</th>
                </tr>
            `;
        } else {
            header.innerHTML = `
                <tr>
                    <th>Rank</th>
                    <th>Player</th>
                    <th>Time</th>
                    <th>Hints</th>
                    <th>Date</th>
                </tr>
            `;
        }
        
        try {
            const data = await API.getLeaderboard(size, difficulty);
            renderLeaderboard(data.items, showAll);
        } catch (err) {
            console.error('Failed to load leaderboard:', err);
            elements.leaderboardTable.innerHTML = `<tr><td colspan="${colspan}">Failed to load leaderboard</td></tr>`;
        }
    }
    
    /**
     * Render leaderboard table
     */
    function renderLeaderboard(items, showAll = false) {
        elements.leaderboardTable.innerHTML = '';
        
        if (items.length === 0) {
            elements.leaderboardTable.innerHTML = `<tr><td colspan="${showAll ? 7 : 5}">No entries yet</td></tr>`;
            return;
        }
        
        items.forEach((item, index) => {
            const row = document.createElement('tr');
            
            const rank = document.createElement('td');
            rank.textContent = index + 1;
            row.appendChild(rank);
            
            const player = document.createElement('td');
            player.textContent = item.player_name;
            row.appendChild(player);
            
            // Show board size and difficulty when displaying all results
            if (showAll) {
                const size = document.createElement('td');
                size.textContent = `${item.board_size}x${item.board_size}`;
                row.appendChild(size);
                
                const diff = document.createElement('td');
                diff.textContent = `Level ${item.difficulty_level}`;
                row.appendChild(diff);
            }
            
            const time = document.createElement('td');
            time.textContent = SudokuGame.formatTime(item.completion_time_seconds);
            row.appendChild(time);
            
            const hints = document.createElement('td');
            hints.textContent = item.hints_used;
            row.appendChild(hints);
            
            const date = document.createElement('td');
            const gameDate = new Date(item.game_date);
            date.textContent = gameDate.toLocaleDateString();
            row.appendChild(date);
            
            elements.leaderboardTable.appendChild(row);
        });
    }
    
    /**
     * Apply theme
     */
    function applyTheme(theme) {
        document.body.setAttribute('data-theme', theme);
    }
    
    /**
     * Scroll to game board (for mobile)
     */
    function scrollToBoard() {
        const hud = document.querySelector('.hud');
        if (hud && window.innerWidth < 768) {
            hud.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }
    
    /**
     * Toggle controls panel
     */
    function toggleControls() {
        const panel = document.getElementById('controls-panel');
        const btn = document.getElementById('toggle-controls');
        
        if (panel.style.display === 'none') {
            panel.style.display = 'block';
            btn.innerHTML = '&#9650;'; // Up arrow
        } else {
            panel.style.display = 'none';
            btn.innerHTML = '&#9660;'; // Down arrow
        }
    }
    
    /**
     * Update active tab
     */
    function updateActiveTab(tabs, activeTab) {
        tabs.forEach(tab => tab.classList.remove('active'));
        if (activeTab) {
            activeTab.classList.add('active');
        }
    }
    
    /**
     * Update timer display (called every second)
     */
    setInterval(() => {
        const state = SudokuGame.getState();
        if (state.timerStarted && !state.isPaused && !state.gameCompleted) {
            updateUI();
        }
    }, 100);
    
    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
