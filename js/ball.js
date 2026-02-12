import { CONFIG } from './config.js';

export class Ball {
    constructor(canvasWidth, canvasHeight) {
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
        this.radius = CONFIG.BALL_RADIUS;
        this.reset();
    }
    
    reset() {
        this.x = this.canvasWidth / 2;
        this.y = this.canvasHeight / 2;
        this.speed = CONFIG.BALL_INITIAL_SPEED;
        
        // Random direction
        const angle = (Math.random() * Math.PI / 2) - Math.PI / 4; // -45 to 45 degrees
        const direction = Math.random() > 0.5 ? 1 : -1;
        
        this.vx = Math.cos(angle) * this.speed * direction;
        this.vy = Math.sin(angle) * this.speed;
    }
    
    update(deltaTime) {
        const factor = deltaTime / 16.67; // Normalize to 60 FPS
        this.x += this.vx * factor;
        this.y += this.vy * factor;
    }
    
    bounceY() {
        this.vy = -this.vy;
    }
    
    bounceX(paddleCenter) {
        // Calculate relative intersection (-1 to 1)
        const relativeIntersect = (this.y - paddleCenter) / (CONFIG.PADDLE_HEIGHT / 2);
        
        // Calculate bounce angle (max 60 degrees)
        const bounceAngle = relativeIntersect * (Math.PI / 3);
        
        // Determine direction (reverse x)
        const direction = this.vx > 0 ? -1 : 1;
        
        // Increase speed
        this.increaseSpeed();
        
        // Set new velocity
        this.vx = Math.cos(bounceAngle) * this.speed * direction;
        this.vy = Math.sin(bounceAngle) * this.speed;
    }
    
    increaseSpeed() {
        if (this.speed < CONFIG.BALL_MAX_SPEED) {
            this.speed += CONFIG.BALL_SPEED_INCREMENT;
        }
    }
    
    getLeft() {
        return this.x - this.radius;
    }
    
    getRight() {
        return this.x + this.radius;
    }
    
    getTop() {
        return this.y - this.radius;
    }
    
    getBottom() {
        return this.y + this.radius;
    }
}
