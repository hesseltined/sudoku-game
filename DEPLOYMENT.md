# Sudoku Game - Deployment Instructions

**Version:** 1.0.0  
**Date:** 2025-11-20  
**Author:** Doug Hesseltine  
**Copyright:** Technologist.Services 2025

## Server Information
- **Server:** root@10.250.0.31
- **Deployment Path:** /var/www/html/games/sudoku
- **URL:** https://technologist.services/games/sudoku

## Prerequisites
- SSH access to server (root@10.250.0.31)
- MySQL/MariaDB database server
- PHP 7.4+ with PDO MySQL extension
- Web server (Apache/Nginx)

## Deployment Steps

### 1. Database Setup

Connect to MySQL on the server:
```bash
ssh root@10.250.0.31
mysql -u root -p
```

Run the database setup script:
```sql
SOURCE /path/to/database-setup.sql;
```

Or manually:
```sql
CREATE DATABASE IF NOT EXISTS sudoku_game CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE sudoku_game;

CREATE TABLE IF NOT EXISTS games (
    id INT AUTO_INCREMENT PRIMARY KEY,
    player_name VARCHAR(64) NOT NULL,
    board_size TINYINT NOT NULL,
    difficulty_level TINYINT NOT NULL,
    completion_time_seconds INT NOT NULL,
    hints_used TINYINT DEFAULT 0,
    mistakes_made INT DEFAULT 0,
    game_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_leaderboard (board_size, difficulty_level, completion_time_seconds),
    INDEX idx_player (player_name, game_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

Create database user (replace password):
```sql
CREATE USER 'sudoku_user'@'localhost' IDENTIFIED BY 'STRONG_PASSWORD_HERE';
GRANT SELECT, INSERT ON sudoku_game.* TO 'sudoku_user'@'localhost';
FLUSH PRIVILEGES;
```

### 2. Update Configuration

Edit `api/config.php` and update:
```php
define('DB_HOST', 'localhost');
define('DB_NAME', 'sudoku_game');
define('DB_USER', 'sudoku_user');
define('DB_PASS', 'STRONG_PASSWORD_HERE');  // Use the password from step 1
define('ALLOWED_ORIGIN', 'https://technologist.services');  // Update for production
define('DEBUG_MODE', false);  // Disable debug mode in production
```

### 3. Upload Files to Server

From your local machine, upload the project files:
```bash
# Create target directory
ssh root@10.250.0.31 'mkdir -p /var/www/html/games/sudoku'

# Upload files (from project directory)
scp -r * root@10.250.0.31:/var/www/html/games/sudoku/

# Or use rsync for better control
rsync -avz --exclude='.git' --exclude='DEPLOYMENT.md' \
    ./ root@10.250.0.31:/var/www/html/games/sudoku/
```

### 4. Set Permissions

```bash
ssh root@10.250.0.31

# Set ownership
chown -R www-data:www-data /var/www/html/games/sudoku

# Set directory permissions
find /var/www/html/games/sudoku -type d -exec chmod 755 {} \;

# Set file permissions
find /var/www/html/games/sudoku -type f -exec chmod 644 {} \;

# Make sure API files are readable
chmod 644 /var/www/html/games/sudoku/api/*.php
```

### 5. Test Deployment

Test each component:

1. **Test main page:**
   ```
   https://technologist.services/games/sudoku
   ```

2. **Test API endpoints:**
   ```bash
   # Test leaderboard
   curl "https://technologist.services/games/sudoku/api/leaderboard.php?board_size=9&difficulty=3"
   
   # Test save game (should fail without data, but confirms endpoint works)
   curl -X POST "https://technologist.services/games/sudoku/api/save-game.php"
   ```

3. **Play a test game:**
   - Open the game in browser
   - Select a board size and difficulty
   - Click "New Game"
   - Complete a puzzle
   - Verify leaderboard updates

### 6. Verify Database Connection

Fix typo in `api/db.php` line 27:
```php
// Change from:
$pdo = new PDO($dsn, DB_USER, DB_PASS, options);

// To:
$pdo = new PDO($dsn, DB_USER, DB_PASS, $options);
```

### 7. Update Tools Index

Add entry to `https://technologist.services/tools/index.html`:
```html
<div class="card">
    <h3><span class="tool-badge">[GAME]</span> Sudoku</h3>
    <p>Classic Sudoku game with multiple board sizes (4x4, 6x6, 9x9), five difficulty levels, and online leaderboards.</p>
    <ul>
        <li>Three board sizes for all skill levels</li>
        <li>Difficulty slider (1-5)</li>
        <li>Three color themes</li>
        <li>Hint system and undo functionality</li>
        <li>Online leaderboards per size/difficulty</li>
    </ul>
    <div class="tech-stack">
        <span class="tech-tag">JavaScript</span>
        <span class="tech-tag">PHP</span>
        <span class="tech-tag">MySQL</span>
    </div>
    <a href="../games/sudoku/" class="tool-link">Play Sudoku</a>
</div>
```

## Troubleshooting

### Database Connection Issues
- Verify credentials in `api/config.php`
- Check MySQL user permissions: `SHOW GRANTS FOR 'sudoku_user'@'localhost';`
- Check PHP error log: `tail -f /var/log/apache2/error.log` or `/var/log/php/error.log`

### CORS Errors
- Update `ALLOWED_ORIGIN` in `api/config.php`
- Verify Apache/Nginx CORS headers are not conflicting

### Leaderboard Not Loading
- Check browser console for errors
- Test API endpoint directly with curl
- Verify database has games table: `SHOW TABLES IN sudoku_game;`

### File Permission Errors
- Ensure www-data owns all files
- Check directory permissions (755) and file permissions (644)

## Maintenance

### Backup Database
```bash
mysqldump -u root -p sudoku_game > sudoku_game_backup_$(date +%Y%m%d).sql
```

### Clear Old Games (optional)
```sql
DELETE FROM games WHERE game_date < DATE_SUB(NOW(), INTERVAL 1 YEAR);
```

### Monitor Performance
```sql
-- Check game count
SELECT COUNT(*) FROM games;

-- Check leaderboard query performance
EXPLAIN SELECT * FROM games WHERE board_size = 9 AND difficulty_level = 3 
ORDER BY completion_time_seconds ASC LIMIT 10;
```

## Post-Deployment Checklist

- [ ] Database created and user configured
- [ ] Configuration file updated with correct credentials
- [ ] Files uploaded to server
- [ ] Permissions set correctly
- [ ] Game loads in browser
- [ ] Can complete a game
- [ ] Leaderboard updates after game completion
- [ ] All three themes work
- [ ] All board sizes (4x4, 6x6, 9x9) work
- [ ] All difficulty levels work
- [ ] Back button links to tools/index.html correctly
- [ ] Entry added to tools/index.html
- [ ] Footer displays correct information

## Support

For issues or questions, contact Doug Hesseltine or refer to project documentation.
