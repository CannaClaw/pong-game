# Pong Game

A web-based 2-player Pong game built as part of the CPDF (Cannasol Project Development Framework) validation project.

## Play the Game

🎮 **Live Demo:** [Coming soon - Firebase Hosting]

## Features

- 2-player local multiplayer
- Smooth 60 FPS gameplay
- Classic Pong aesthetic
- Score tracking (first to 11 wins)
- Pause/resume functionality
- Responsive paddle controls

## Controls

| Player | Up | Down |
|--------|-----|------|
| Player 1 (Left) | W | S |
| Player 2 (Right) | ↑ | ↓ |

| Action | Key |
|--------|-----|
| Start / Pause | Space |
| Restart | R |

## Tech Stack

- HTML5 Canvas
- Vanilla JavaScript (ES6 Modules)
- CSS3
- Firebase Hosting

## Project Structure

```
pong-game/
├── index.html          # Main entry point
├── css/
│   └── style.css       # Styling
├── js/
│   ├── main.js         # Entry point
│   ├── game.js         # Main game class
│   ├── ball.js         # Ball physics
│   ├── paddle.js       # Paddle controls
│   ├── inputHandler.js # Keyboard input
│   ├── collision.js    # Collision detection
│   ├── scoreManager.js # Score tracking
│   ├── renderer.js     # Canvas rendering
│   └── config.js       # Game constants
├── docs/
│   ├── prd.md          # Product Requirements
│   └── architecture.md # Architecture Document
├── firebase.json       # Firebase config
└── README.md           # This file
```

## Development

No build step required! Just open `index.html` in a browser or serve with any static file server:

```bash
# Using Python
python -m http.server 8000

# Using Node.js http-server
npx http-server
```

## Deployment

Deploy to Firebase Hosting:

```bash
firebase deploy
```

## CPDF Information

This project was created to validate the Cannasol Project Development Framework (CPDF), demonstrating:

- ✅ Project Kickoff workflow
- ✅ BMAD Planning (PRD creation)
- ✅ BMAD Solutioning (Architecture)
- ✅ Epic and Story management
- ✅ Sprint execution
- ✅ Firebase deployment

**Trello Board:** [CANNACLAW-pong-game](https://trello.com/b/DcxYffkE/cannaclaw-pong-game)  
**GitHub Repo:** [CannaClaw/pong-game](https://github.com/CannaClaw/pong-game)

---

**© 2026 CannaClaw / Cannasol Technology**
