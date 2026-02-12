# Architecture Document: Pong Game

**Document ID:** ARCH-PONG-001  
**Version:** 1.0  
**Created:** 2026-02-12  
**Status:** Approved  
**PRD Reference:** PRD-PONG-001

---

## 1. System Overview

### 1.1 Architecture Style
**Single-Page Application (SPA) - Static Client-Only**

The Pong game is a purely client-side application with no server-side logic. All game logic runs in the browser using JavaScript and the HTML5 Canvas API.

### 1.2 High-Level Architecture

```
┌─────────────────────────────────────────────────────────┐
│                      Browser                             │
│  ┌────────────────────────────────────────────────────┐ │
│  │                   index.html                        │ │
│  │  ┌──────────────────────────────────────────────┐  │ │
│  │  │              HTML5 Canvas                      │  │ │
│  │  │                                                │  │ │
│  │  │  ┌─────────┐    ┌─────┐    ┌─────────┐       │  │ │
│  │  │  │ Paddle1 │    │Ball │    │ Paddle2 │       │  │ │
│  │  │  └─────────┘    └─────┘    └─────────┘       │  │ │
│  │  │                                                │  │ │
│  │  └──────────────────────────────────────────────┘  │ │
│  │                                                      │ │
│  │  ┌──────────────────────────────────────────────┐  │ │
│  │  │              JavaScript                        │  │ │
│  │  │  ┌─────────┐ ┌─────────┐ ┌───────────────┐   │  │ │
│  │  │  │GameLoop │ │ Input   │ │ Collision     │   │  │ │
│  │  │  │Manager  │ │ Handler │ │ Detector      │   │  │ │
│  │  │  └─────────┘ └─────────┘ └───────────────┘   │  │ │
│  │  │  ┌─────────┐ ┌─────────┐ ┌───────────────┐   │  │ │
│  │  │  │Score    │ │ Audio   │ │ Renderer      │   │  │ │
│  │  │  │Manager  │ │ Manager │ │               │   │  │ │
│  │  │  └─────────┘ └─────────┘ └───────────────┘   │  │ │
│  │  └──────────────────────────────────────────────┘  │ │
│  └────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
         │
         ▼
┌─────────────────────┐
│  Firebase Hosting   │
│  (Static Files)     │
└─────────────────────┘
```

---

## 2. Component Design

### 2.1 Core Components

#### 2.1.1 Game Class
**Purpose:** Main game controller that orchestrates all components  
**Requirements Addressed:** All @req-FUNC-*

```javascript
class Game {
  constructor(canvas)
  init()
  start()
  pause()
  restart()
  update(deltaTime)
  render()
  gameLoop(timestamp)
}
```

#### 2.1.2 Ball Class
**Purpose:** Represents the game ball with physics  
**Requirements Addressed:** @req-FUNC-004

```javascript
class Ball {
  constructor(x, y, radius, speed)
  update(deltaTime)
  reset()
  bounceX()
  bounceY()
  increaseSpeed()
}
```

Properties:
- `x`, `y`: Position
- `vx`, `vy`: Velocity components
- `radius`: Ball radius
- `speed`: Current speed
- `maxSpeed`: Speed cap

#### 2.1.3 Paddle Class
**Purpose:** Represents a player's paddle  
**Requirements Addressed:** @req-FUNC-002, @req-FUNC-003

```javascript
class Paddle {
  constructor(x, y, width, height, upKey, downKey)
  update(deltaTime, keysPressed)
  draw(ctx)
  getBounds()
}
```

Properties:
- `x`, `y`: Position
- `width`, `height`: Dimensions
- `speed`: Movement speed
- `upKey`, `downKey`: Control keys

#### 2.1.4 ScoreManager Class
**Purpose:** Manages game scoring and win conditions  
**Requirements Addressed:** @req-FUNC-005, @req-FUNC-006

```javascript
class ScoreManager {
  constructor(winningScore)
  incrementPlayer1()
  incrementPlayer2()
  checkWinner()
  reset()
  getScores()
}
```

#### 2.1.5 InputHandler Class
**Purpose:** Manages keyboard input  
**Requirements Addressed:** @req-FUNC-002, @req-FUNC-003, @req-FUNC-007

```javascript
class InputHandler {
  constructor()
  isKeyPressed(key)
  onKeyDown(callback)
  onKeyUp(callback)
}
```

#### 2.1.6 CollisionDetector Class
**Purpose:** Handles all collision detection  
**Requirements Addressed:** @req-FUNC-004

```javascript
class CollisionDetector {
  static checkBallPaddle(ball, paddle)
  static checkBallWall(ball, canvasHeight)
  static checkBallOutOfBounds(ball, canvasWidth)
}
```

#### 2.1.7 AudioManager Class
**Purpose:** Manages game sound effects  
**Requirements Addressed:** @req-FUNC-008

```javascript
class AudioManager {
  constructor()
  playPaddleHit()
  playWallHit()
  playScore()
  toggle()
}
```

#### 2.1.8 Renderer Class
**Purpose:** Handles all canvas drawing  
**Requirements Addressed:** @req-FUNC-001, @req-UI-001

```javascript
class Renderer {
  constructor(ctx, canvas)
  clear()
  drawBall(ball)
  drawPaddle(paddle)
  drawScore(scores)
  drawCenterLine()
  drawInstructions()
  drawWinner(playerNum)
  drawPaused()
}
```

---

## 3. Data Flow

### 3.1 Game Loop Flow

```
┌─────────────┐
│   Start     │
└──────┬──────┘
       ▼
┌──────────────┐
│ Initialize   │
│  Game State  │
└──────┬───────┘
       ▼
┌──────────────────────────────────────┐
│            GAME LOOP                  │
│  ┌─────────────────────────────────┐ │
│  │  1. Process Input               │ │
│  │     - Read keyboard state       │ │
│  │     - Update paddle positions   │ │
│  └──────────────┬──────────────────┘ │
│                 ▼                     │
│  ┌─────────────────────────────────┐ │
│  │  2. Update Game State           │ │
│  │     - Move ball                 │ │
│  │     - Check collisions          │ │
│  │     - Update scores             │ │
│  │     - Check win condition       │ │
│  └──────────────┬──────────────────┘ │
│                 ▼                     │
│  ┌─────────────────────────────────┐ │
│  │  3. Render                      │ │
│  │     - Clear canvas              │ │
│  │     - Draw all elements         │ │
│  │     - Display score/status      │ │
│  └──────────────┬──────────────────┘ │
│                 ▼                     │
│  ┌─────────────────────────────────┐ │
│  │  4. Request Next Frame          │ │
│  │     - requestAnimationFrame     │ │
│  └──────────────┬──────────────────┘ │
│                 │                     │
│                 ▼                     │
│        (Loop continues)               │
└──────────────────────────────────────┘
```

### 3.2 Collision Detection Flow

```
Ball Update
    │
    ▼
┌───────────────────┐    Yes    ┌───────────────┐
│ Ball hits top/    │──────────▶│ Reverse Y     │
│ bottom wall?      │           │ velocity      │
└───────────────────┘           └───────────────┘
    │ No
    ▼
┌───────────────────┐    Yes    ┌───────────────┐
│ Ball hits         │──────────▶│ Reverse X,    │
│ paddle?           │           │ adjust angle, │
└───────────────────┘           │ increase speed│
    │ No                        └───────────────┘
    ▼
┌───────────────────┐    Yes    ┌───────────────┐
│ Ball past left    │──────────▶│ Player 2      │
│ boundary?         │           │ scores        │
└───────────────────┘           └───────────────┘
    │ No
    ▼
┌───────────────────┐    Yes    ┌───────────────┐
│ Ball past right   │──────────▶│ Player 1      │
│ boundary?         │           │ scores        │
└───────────────────┘           └───────────────┘
```

---

## 4. Technical Decisions

### 4.1 Technology Stack

| Layer | Technology | Rationale |
|-------|------------|-----------|
| Rendering | HTML5 Canvas | Native browser API, performant for 2D games |
| Logic | Vanilla JavaScript (ES6+) | No dependencies, fast load, maintainable |
| Styling | Inline CSS / Minimal | Simple project, no need for CSS framework |
| Deployment | Firebase Hosting | Free tier, CDN, HTTPS, easy setup |
| Build | None | Single file or minimal files, no bundling needed |

### 4.2 File Structure

```
pong-game/
├── index.html          # Main entry point
├── css/
│   └── style.css       # Minimal styling
├── js/
│   ├── game.js         # Main Game class
│   ├── ball.js         # Ball class
│   ├── paddle.js       # Paddle class
│   ├── scoreManager.js # Score tracking
│   ├── inputHandler.js # Keyboard input
│   ├── collision.js    # Collision detection
│   ├── audio.js        # Sound effects
│   └── renderer.js     # Canvas drawing
├── audio/
│   ├── paddle.wav      # Paddle hit sound
│   ├── wall.wav        # Wall hit sound
│   └── score.wav       # Score sound
├── docs/
│   ├── prd.md          # Product Requirements
│   └── architecture.md # This document
├── firebase.json       # Firebase config
└── README.md           # Project documentation
```

### 4.3 Game Constants

```javascript
const CONFIG = {
  // Canvas
  CANVAS_WIDTH: 800,
  CANVAS_HEIGHT: 500,
  
  // Ball
  BALL_RADIUS: 10,
  BALL_INITIAL_SPEED: 5,
  BALL_SPEED_INCREMENT: 0.5,
  BALL_MAX_SPEED: 12,
  
  // Paddle
  PADDLE_WIDTH: 10,
  PADDLE_HEIGHT: 80,
  PADDLE_SPEED: 8,
  PADDLE_MARGIN: 20,
  
  // Game
  WINNING_SCORE: 11,
  
  // Colors
  BACKGROUND_COLOR: '#000000',
  ELEMENT_COLOR: '#FFFFFF',
  
  // Controls
  PLAYER1_UP: 'KeyW',
  PLAYER1_DOWN: 'KeyS',
  PLAYER2_UP: 'ArrowUp',
  PLAYER2_DOWN: 'ArrowDown',
  PAUSE_KEY: 'Space',
  RESTART_KEY: 'KeyR'
};
```

---

## 5. Performance Considerations

### 5.1 Game Loop Optimization
- Use `requestAnimationFrame` for smooth 60 FPS
- Calculate delta time for frame-rate independent movement
- Minimize object creation during game loop

### 5.2 Rendering Optimization
- Only redraw changed elements when possible
- Use integer coordinates for crisp rendering
- Pre-calculate static elements

### 5.3 Memory Management
- Reuse objects instead of creating new ones
- No memory leaks from event listeners

---

## 6. Deployment Architecture

```
┌─────────────────┐     ┌─────────────────────┐
│  GitHub Repo    │     │  Firebase Console   │
│  CannaClaw/     │────▶│  firebase deploy    │
│  pong-game      │     └─────────┬───────────┘
└─────────────────┘               │
                                  ▼
                    ┌─────────────────────────┐
                    │   Firebase Hosting      │
                    │   *.web.app             │
                    │   *.firebaseapp.com     │
                    └─────────────────────────┘
                                  │
                                  ▼
                    ┌─────────────────────────┐
                    │   Global CDN            │
                    │   (Firebase Edge)       │
                    └─────────────────────────┘
                                  │
                                  ▼
                    ┌─────────────────────────┐
                    │   End Users             │
                    │   (Browsers)            │
                    └─────────────────────────┘
```

### 6.1 Firebase Configuration

```json
{
  "hosting": {
    "public": ".",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**",
      "docs/**"
    ],
    "headers": [
      {
        "source": "**",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "max-age=3600"
          }
        ]
      }
    ]
  }
}
```

---

## 7. Testing Strategy

### 7.1 Manual Testing
- Play through complete games
- Test all keyboard controls
- Test pause/resume/restart
- Test across browsers

### 7.2 Test Cases

| Test | Steps | Expected Result |
|------|-------|-----------------|
| Game starts | Press Space | Ball begins moving |
| P1 up | Press W | Left paddle moves up |
| P1 down | Press S | Left paddle moves down |
| P2 up | Press ArrowUp | Right paddle moves up |
| P2 down | Press ArrowDown | Right paddle moves down |
| Ball bounce wall | Ball hits top | Ball bounces down |
| Ball bounce paddle | Ball hits paddle | Ball bounces back |
| Score P1 | Ball passes right | P1 score +1 |
| Score P2 | Ball passes left | P2 score +1 |
| Win condition | Score reaches 11 | Winner displayed |
| Restart | Press R | Game resets |
| Pause | Press Space (during game) | Game pauses |

---

## 8. Requirements Traceability

| Component | Requirements Addressed |
|-----------|----------------------|
| Game | @req-FUNC-007 |
| Ball | @req-FUNC-004 |
| Paddle | @req-FUNC-002, @req-FUNC-003 |
| ScoreManager | @req-FUNC-005, @req-FUNC-006 |
| InputHandler | @req-FUNC-002, @req-FUNC-003, @req-FUNC-007 |
| CollisionDetector | @req-FUNC-004 |
| AudioManager | @req-FUNC-008 |
| Renderer | @req-FUNC-001, @req-UI-001, @req-UI-002 |
| Canvas setup | @req-NFR-001, @req-NFR-002, @req-NFR-003 |
| Firebase deployment | @req-NFR-004, @req-SEC-001 |

---

## 9. ADRs (Architecture Decision Records)

### ADR-001: Vanilla JavaScript vs Framework
**Status:** Accepted  
**Context:** Choosing between vanilla JS or a framework (React/Vue)  
**Decision:** Vanilla JavaScript  
**Rationale:** Simpler, faster load, no build step, appropriate for scope

### ADR-002: Single File vs Modules
**Status:** Accepted  
**Context:** Single HTML file vs multiple JS files  
**Decision:** Multiple JS files with ES6 modules  
**Rationale:** Better organization, maintainable, modern browsers support

### ADR-003: Canvas vs DOM Elements
**Status:** Accepted  
**Context:** Render with Canvas API vs CSS/DOM manipulation  
**Decision:** HTML5 Canvas  
**Rationale:** Better performance for real-time games, more control

---

**Document Approved By:** CPDF Validation Process  
**Next Phase:** Epic and Story Creation
