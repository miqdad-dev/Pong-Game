# Simple Pong (HTML5 Canvas)

A minimal **Pong** game built with vanilla **HTML, CSS, and JavaScript**. Move your paddle with the mouse and try to send the ball past the AI!

## 🎮 Demo
After publishing with GitHub Pages, your game will be live at:
```
https://YOUR_USERNAME.github.io/pong-game/
```

## ✨ Features
- Smooth 60 FPS game loop with `requestAnimationFrame`
- Basic AI that tracks the ball
- Paddle spin: bounce angle depends on where the ball hits
- Simple, readable code in a single `script.js`

## 📁 Project Structure
```
.
├─ index.html     # Canvas + script include
├─ style.css      # Page and canvas styling
├─ script.js      # Game logic (paddles, ball, collisions, AI)
├─ README.md
├─ .gitignore
└─ LICENSE
```

## ▶️ Run Locally
Just open `index.html` in your browser — no build step needed.

> Tip: For live reload, use a local server (e.g., VS Code "Live Server" extension) and open the folder.

## ⌨️ Controls
- **Mouse move** → controls the player paddle (left side).

## 🚀 Deploy (GitHub Pages)
1. **Create a repo** on GitHub, e.g. `pong-game`.
2. Initialize and push:
   ```bash
   git init
   git add .
   git commit -m "Add simple Pong game"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/pong-game.git
   git push -u origin main
   ```
3. On GitHub: **Settings → Pages → Build and deployment**  
   - Source: **Deploy from a branch**  
   - Branch: **main / (root)**  
4. Your site will be published at:
   ```
   https://YOUR_USERNAME.github.io/pong-game/
   ```

## 🧠 How it works (quick peek)
- **Game loop**: `update()` physics → `draw()` → `requestAnimationFrame(gameLoop)`
- **Collisions**: ball vs. top/bottom/paddles, with basic spin
- **AI**: follows the ball's Y position with a capped speed

## 📝 Credits
- Code scaffolded with Copilot.
- Organized and documented with ChatGPT (README + repo setup).

## 📜 License
MIT — see `LICENSE`.
