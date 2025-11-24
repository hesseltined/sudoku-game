# Sudoku Game - Project Status

**Last Updated:** 2025-11-24  
**Version:** 1.1.4  
**Status:** Production - Deployed and Working

## Deployment Information

### Live URL
https://technologist.services/games/sudoku

### Server Details
- **Server:** root@10.250.0.31
- **Path:** /var/www/html/games/sudoku
- **Database:** sudoku_game (MySQL)
- **DB User:** sudoku_user
- **DB Password:** Sudoku2025!Secure

### GitHub Repository
https://github.com/hesseltined/sudoku-game

## Recent Changes (v1.1.4)

### Bug Fixes
1. **Region Borders** - Fixed thick borders not showing in dark/ocean themes (changed from border-right-color to border-right: 4px solid)
2. **Instant Error Highlighting** - Added setInstantErrors() function and checkbox change listener to properly toggle error display
3. **Leaderboard Display** - Fixed API client to handle null parameters for "all results" view
4. **Invalid Puzzles** - Added validation retry mechanism (up to 5 retries) to prevent unsolvable puzzles
5. **Settings Toggle** - Fixed collapse/expand button with arrow icons (▲/▼)

### Features Added
1. **Auto-collapse Settings** - Settings panel automatically collapses when you click first cell
2. **Auto-expand on Completion** - Settings panel expands when game completes so you can start new game
3. **Dynamic Leaderboard** - Shows all results by default with Size and Difficulty columns, filters when tabs clicked
4. **Version Busting** - Added ?v=1.1.4 to CSS/JS files to force browser cache refresh

### Default Settings
- Board Size: 6x6
- Difficulty: 3 (Intermediate)
- Instant Errors: OFF (checkbox)

## Project Structure

```
sudoku/
├── index.html              # Main game page (with version busting)
├── css/
│   ├── styles.css          # Base styles
│   └── themes.css          # Classic, Dark, Ocean themes
├── js/
│   ├── sudoku-generator.js # Puzzle generation with validation
│   ├── puzzle-library.js   # Pre-generated puzzles (disabled)
│   ├── game.js             # Core game logic
│   ├── ui.js               # UI controller
│   └── api-client.js       # API communication
├── api/
│   ├── config.php          # Database config (NOT in git)
│   ├── db.php              # Database connection
│   ├── util.php            # Helper functions
│   ├── leaderboard.php     # GET leaderboard
│   ├── save-game.php       # POST game results
│   └── history.php         # GET player history
├── database-setup.sql      # Database schema
├── upload.ps1              # Deployment script (NOT in git)
└── README.md               # Project documentation
```

## Known Issues / Future Improvements

### Current Issues
- None reported

### Potential Enhancements
1. **Notes/Pencil Marks** - Add ability to mark possible numbers in cells
2. **Statistics** - Track player stats (games played, win rate, average time)
3. **Daily Challenge** - Add daily puzzle mode
4. **PWA Support** - Make game installable as Progressive Web App
5. **Undo Multiple Moves** - Currently only undoes last move
6. **Keyboard Shortcuts** - Add more keyboard controls
7. **Difficulty Rating** - Show puzzle difficulty based on techniques required

## Testing Checklist

When making changes, verify:
- [ ] All three themes work (Classic, Dark, Ocean)
- [ ] All three board sizes work (4x4, 6x6, 9x9)
- [ ] All five difficulty levels work
- [ ] Region borders visible in all themes
- [ ] Instant error highlighting toggles properly
- [ ] Settings panel collapse/expand works
- [ ] Leaderboard shows all results by default
- [ ] Leaderboard filters work when clicking tabs
- [ ] Game completion shows congratulations message
- [ ] Game completion expands settings panel
- [ ] New game auto-collapses settings on first click
- [ ] Games save to database properly
- [ ] Timer starts on first move
- [ ] Pause works correctly
- [ ] Undo works
- [ ] Hints work (max 3)
- [ ] Browser cache cleared (test with Ctrl+F5)

## Deployment Process

1. **Make changes locally** in C:\Users\DougHesseltine\SynologyDrive\Warp_Projects\sudoku
2. **Update version** in index.html (?v=X.X.X)
3. **Run upload script:** `powershell -ExecutionPolicy Bypass -File upload.ps1`
4. **Test on server:** https://technologist.services/games/sudoku
5. **Commit to git:**
   ```
   git add -A
   git commit -m "Description of changes"
   git push
   ```

## Database Schema

```sql
CREATE TABLE games (
    id INT AUTO_INCREMENT PRIMARY KEY,
    player_name VARCHAR(64) NOT NULL,
    board_size TINYINT NOT NULL,           -- 4, 6, or 9
    difficulty_level TINYINT NOT NULL,     -- 1-5
    completion_time_seconds INT NOT NULL,
    hints_used TINYINT DEFAULT 0,
    mistakes_made INT DEFAULT 0,
    game_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_leaderboard (board_size, difficulty_level, completion_time_seconds)
);
```

## API Endpoints

### GET /api/leaderboard.php
- **Parameters:** `board_size` (optional), `difficulty` (optional)
- **Response:** JSON with array of game results
- **Sort:** board_size ASC, difficulty_level ASC, completion_time_seconds ASC
- **Limit:** 100 for all results, 50 for filtered

### POST /api/save-game.php
- **Body:** JSON with player_name, board_size, difficulty_level, completion_time_seconds, hints_used
- **Response:** JSON with ok: true and id

### GET /api/history.php
- **Parameters:** `player_name`
- **Response:** JSON with array of player's games

## Browser Compatibility

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers with touch support

## Contact

For issues or questions, contact Doug Hesseltine.
