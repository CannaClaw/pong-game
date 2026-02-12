import { CONFIG } from './config.js';
import { Ball } from './ball.js';
import { Paddle } from './paddle.js';
import { InputHandler } from './inputHandler.js';
import { CollisionDetector } from './collision.js';
import { ScoreManager } from './scoreManager.js';
import { Renderer } from './renderer.js';

export class Game {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        
        // Game state
        this.state = 'idle'; // idle, playing, paused, ended
        this.winner = null;
        
        // Initialize components
        this.init();
    }
    
    init() {
        // Create game objects
        this.ball = new Ball(this.canvas.width, this.canvas.height);
        
        this.paddle1 = new Paddle(
            CONFIG.PADDLE_MARGIN,
            (this.canvas.height - CONFIG.PADDLE_HEIGHT) / 2,
            CONFIG.PLAYER1_UP,
            CONFIG.PLAYER1_DOWN
        );
        
        this.paddle2 = new Paddle(
            this.canvas.width - CONFIG.PADDLE_MARGIN - CONFIG.PADDLE_WIDTH,
            (this.canvas.height - CONFIG.PADDLE_HEIGHT) / 2,
            CONFIG.PLAYER2_UP,
            CONFIG.PLAYER2_DOWN
        );
        
        this.inputHandler = new InputHandler();
        this.scoreManager = new ScoreManager();
        this.renderer = new Renderer(this.ctx, this.canvas);
        
        // Setup controls
        this.setupControls();
        
        // Start game loop
        this.lastTime = 0;
        this.gameLoop = this.gameLoop.bind(this);
        requestAnimationFrame(this.gameLoop);
    }
    
    setupControls() {
        this.inputHandler.onKeyDown((code) => {
            if (code === CONFIG.PAUSE_KEY) {
                if (this.state === 'idle') {
                    this.state = 'playing';
                } else if (this.state === 'playing') {
                    this.state = 'paused';
                } else if (this.state === 'paused') {
                    this.state = 'playing';
                }
            }
            
            if (code === CONFIG.RESTART_KEY) {
                this.restart();
            }
        });
    }
    
    restart() {
        this.state = 'idle';
        this.winner = null;
        this.scoreManager.reset();
        this.ball.reset();
        this.paddle1.y = (this.canvas.height - CONFIG.PADDLE_HEIGHT) / 2;
        this.paddle2.y = (this.canvas.height - CONFIG.PADDLE_HEIGHT) / 2;
    }
    
    update(deltaTime) {
        if (this.state !== 'playing') return;
        
        // Update paddles
        this.paddle1.update(deltaTime, this.inputHandler, this.canvas.height);
        this.paddle2.update(deltaTime, this.inputHandler, this.canvas.height);
        
        // Update ball
        this.ball.update(deltaTime);
        
        // Check wall collisions
        if (CollisionDetector.checkBallTopWall(this.ball) || 
            CollisionDetector.checkBallBottomWall(this.ball, this.canvas.height)) {
            this.ball.bounceY();
            // Clamp ball position
            if (this.ball.getTop() < 0) {
                this.ball.y = this.ball.radius;
            }
            if (this.ball.getBottom() > this.canvas.height) {
                this.ball.y = this.canvas.height - this.ball.radius;
            }
        }
        
        // Check paddle collisions
        if (CollisionDetector.checkBallPaddle(this.ball, this.paddle1)) {
            this.ball.bounceX(this.paddle1.getCenter());
            this.ball.x = this.paddle1.getRight() + this.ball.radius;
        }
        
        if (CollisionDetector.checkBallPaddle(this.ball, this.paddle2)) {
            this.ball.bounceX(this.paddle2.getCenter());
            this.ball.x = this.paddle2.getLeft() - this.ball.radius;
        }
        
        // Check scoring
        if (CollisionDetector.checkBallLeftBoundary(this.ball)) {
            this.scoreManager.incrementPlayer2();
            this.checkWinCondition();
            if (this.state === 'playing') {
                this.ball.reset();
            }
        }
        
        if (CollisionDetector.checkBallRightBoundary(this.ball, this.canvas.width)) {
            this.scoreManager.incrementPlayer1();
            this.checkWinCondition();
            if (this.state === 'playing') {
                this.ball.reset();
            }
        }
    }
    
    checkWinCondition() {
        const winner = this.scoreManager.checkWinner();
        if (winner) {
            this.state = 'ended';
            this.winner = winner;
        }
    }
    
    render() {
        this.renderer.clear();
        this.renderer.drawCenterLine();
        this.renderer.drawScore(this.scoreManager.getScores());
        
        if (this.state === 'idle') {
            this.renderer.drawInstructions();
        } else {
            this.renderer.drawBall(this.ball);
        }
        
        this.renderer.drawPaddle(this.paddle1);
        this.renderer.drawPaddle(this.paddle2);
        
        if (this.state === 'paused') {
            this.renderer.drawPaused();
        }
        
        if (this.state === 'ended' && this.winner) {
            this.renderer.drawWinner(this.winner);
        }
    }
    
    gameLoop(timestamp) {
        const deltaTime = timestamp - this.lastTime;
        this.lastTime = timestamp;
        
        this.update(deltaTime);
        this.render();
        
        requestAnimationFrame(this.gameLoop);
    }
}
