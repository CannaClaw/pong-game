import { CONFIG } from './config.js';

export class Paddle {
    constructor(x, y, upKey, downKey) {
        this.x = x;
        this.y = y;
        this.width = CONFIG.PADDLE_WIDTH;
        this.height = CONFIG.PADDLE_HEIGHT;
        this.speed = CONFIG.PADDLE_SPEED;
        this.upKey = upKey;
        this.downKey = downKey;
    }
    
    update(deltaTime, inputHandler, canvasHeight) {
        const factor = deltaTime / 16.67; // Normalize to 60 FPS
        
        if (inputHandler.isKeyPressed(this.upKey)) {
            this.y -= this.speed * factor;
        }
        if (inputHandler.isKeyPressed(this.downKey)) {
            this.y += this.speed * factor;
        }
        
        // Keep paddle within bounds
        if (this.y < 0) {
            this.y = 0;
        }
        if (this.y + this.height > canvasHeight) {
            this.y = canvasHeight - this.height;
        }
    }
    
    getCenter() {
        return this.y + this.height / 2;
    }
    
    getLeft() {
        return this.x;
    }
    
    getRight() {
        return this.x + this.width;
    }
    
    getTop() {
        return this.y;
    }
    
    getBottom() {
        return this.y + this.height;
    }
}
