# Sudoku Game

**Version:** 1.1.4  
**Date Modified:** 2025-11-24  
**Author:** Doug Hesseltine  
**Copyright:** Technologist.Services 2025

A feature-rich Sudoku game with multiple board sizes, difficulty levels, color themes, and online leaderboards.

## Features

### Game Modes
- **Three Board Sizes**: 4x4 (beginner), 6x6 (intermediate), 9x9 (classic)
- **Five Difficulty Levels**: 1-5 slider with appropriate clue counts per board size
- **Hybrid Puzzle Generation**: Pre-generated puzzles for instant loading + on-demand generator

### Gameplay Features
- **Undo Functionality**: Stack-based move history
- **Hint System**: Maximum 3 hints per game with counter display
- **Timer**: Starts on first move, displays MM:SS format
- **Pause**: Blurs board and stops timer
- **Error Highlighting**: Optional instant error highlighting (toggle)
- **Keyboard Support**: Number keys, arrow navigation, backspace/delete

### Visual Themes
- **Classic**: Traditional beige/blue newspaper style
- **Dark Mode**: Dark background with neon green/cyan accents
- **Ocean**: Navy/teal gradient with aqua highlights

### Online Features
- **Leaderboard**: Server-based, organized by board size and difficulty
- **Offline Support**: Queues game saves when offline, syncs when back online
- **Player History**: Track your own game history

## Project Structure

```
sudoku/
├── index.html              # Main game page
├── css/
│   ├── styles.css          # Base styles
│   └── themes.css          # Theme styles (Classic, Dark, Ocean)
├── js/
│   ├── sudoku-generator.js # Backtracking puzzle generator
│   ├── puzzle-library.js   # Pre-generated puzzles
│   ├── game.js             # Core game logic
│   ├── ui.js               # UI controller
│   └── api-client.js       # API communication
├── api/
│   ├── config.php          # Configuration
│   ├── db.php              # Database connection
│   ├── util.php            # Helper functions
│   ├── leaderboard.php     # GET leaderboard
│   ├── save-game.php       # POST game results
│   └── history.php         # GET player history
├── database-setup.sql      # Database schema
├── DEPLOYMENT.md           # Deployment instructions
└── README.md               # This file
```

## Local Testing

### Option 1: Simple HTTP Server (No Backend)
The game will work locally without backend features (leaderboard disabled):

```bash
# Using Python 3
python -m http.server 8000

# Using PHP
php -S localhost:8000

# Using Node.js (requires http-server package)
npx http-server -p 8000
```

Then open: `http://localhost:8000`

### Option 2: Full Local Setup (With Backend)

#### Prerequisites
- PHP 7.4+ with PDO MySQL extension
- MySQL/MariaDB
- Web server (Apache/Nginx) or PHP development server

#### Setup Steps

1. **Create Database:**
```bash
mysql -u root -p
SOURCE database-setup.sql
```

2. **Update Configuration:**
Edit `api/config.php`:
```php
define('DB_PASS', 'your_password_here');
define('ALLOWED_ORIGIN', '*');  // Allow all origins for local testing
define('DEBUG_MODE', true);     // Enable debugging
```

3. **Start PHP Server:**
```bash
php -S localhost:8000
```

4. **Test:**
- Open `http://localhost:8000`
- Play a game
- Complete it
- Verify leaderboard updates

## Technology Stack

- **Frontend**: Vanilla JavaScript, HTML5, CSS3
- **Backend**: PHP with PDO
- **Database**: MySQL/MariaDB
- **Features**: LocalStorage for offline queue, Fetch API, CSS Grid/Flexbox

## Game Rules

### Standard Sudoku Rules
- Fill all cells with numbers
- Each row must contain all numbers 1-N (where N is board size) exactly once
- Each column must contain all numbers 1-N exactly once
- Each box/region must contain all numbers 1-N exactly once

### Board-Specific Rules
- **4x4**: Uses 2x2 boxes, numbers 1-4
- **6x6**: Uses 3x2 boxes, numbers 1-6
- **9x9**: Uses 3x3 boxes, numbers 1-9

## Algorithm Details

### Puzzle Generation
1. Generate complete valid solution using backtracking with shuffled numbers
2. Create copy of complete board
3. Remove cells strategically:
   - Shuffle cell indices
   - Remove cell and check if puzzle has unique solution
   - If unique, keep removed; if not, restore cell
   - Continue until target clue count reached

### Difficulty Scaling
Clue counts per board size and difficulty:
- **4x4**: Level 1: 12 clues, Level 5: 6 clues
- **6x6**: Level 1: 22 clues, Level 5: 14 clues
- **9x9**: Level 1: 50 clues, Level 5: 26 clues

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers with touch support

## Known Limitations

- Puzzle generation for 9x9 hard puzzles may take 10-20 seconds
- No notes/pencil marks mode (intentional design choice)
- Maximum 3 hints per game (by design)
- Leaderboard limited to top 10 per category

## Future Enhancements (Potential)

- PWA support for offline play
- Multiple solve techniques tracking
- Puzzle difficulty rating based on solve techniques required
- Daily challenge mode
- Statistics and progress tracking
- Social sharing

## License

Copyright © 2025 Technologist.Services  
All rights reserved.

## Support

For deployment to production server, see `DEPLOYMENT.md`.

For issues or questions, contact Doug Hesseltine.
