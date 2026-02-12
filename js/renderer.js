import { CONFIG } from './config.js';

export class Renderer {
    constructor(ctx, canvas) {
        this.ctx = ctx;
        this.canvas = canvas;
    }
    
    clear() {
        this.ctx.fillStyle = CONFIG.BACKGROUND_COLOR;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }
    
    drawCenterLine() {
        this.ctx.strokeStyle = CONFIG.ELEMENT_COLOR;
        this.ctx.lineWidth = 2;
        this.ctx.setLineDash([10, 10]);
        
        this.ctx.beginPath();
        this.ctx.moveTo(this.canvas.width / 2, 0);
        this.ctx.lineTo(this.canvas.width / 2, this.canvas.height);
        this.ctx.stroke();
        
        this.ctx.setLineDash([]);
    }
    
    drawBall(ball) {
        this.ctx.fillStyle = CONFIG.ELEMENT_COLOR;
        this.ctx.beginPath();
        this.ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
        this.ctx.fill();
    }
    
    drawPaddle(paddle) {
        this.ctx.fillStyle = CONFIG.ELEMENT_COLOR;
        this.ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);
    }
    
    drawScore(scores) {
        this.ctx.fillStyle = CONFIG.ELEMENT_COLOR;
        this.ctx.font = '48px "Courier New", monospace';
        this.ctx.textAlign = 'center';
        
        // Player 1 score (left)
        this.ctx.fillText(scores.player1.toString(), this.canvas.width / 4, 60);
        
        // Player 2 score (right)
        this.ctx.fillText(scores.player2.toString(), (this.canvas.width * 3) / 4, 60);
    }
    
    drawInstructions() {
        this.ctx.fillStyle = CONFIG.ELEMENT_COLOR;
        this.ctx.font = '16px "Courier New", monospace';
        this.ctx.textAlign = 'center';
        
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;
        
        this.ctx.fillText('PONG', centerX, centerY - 80);
        this.ctx.fillText('───────────────────', centerX, centerY - 60);
        this.ctx.fillText('Player 1: W / S', centerX, centerY - 30);
        this.ctx.fillText('Player 2: ↑ / ↓', centerX, centerY);
        this.ctx.fillText('───────────────────', centerX, centerY + 20);
        this.ctx.fillText('Press SPACE to Start', centerX, centerY + 50);
        this.ctx.fillText('Press R to Restart', centerX, centerY + 75);
    }
    
    drawPaused() {
        this.ctx.fillStyle = CONFIG.ELEMENT_COLOR;
        this.ctx.font = '32px "Courier New", monospace';
        this.ctx.textAlign = 'center';
        
        this.ctx.fillText('PAUSED', this.canvas.width / 2, this.canvas.height / 2);
        
        this.ctx.font = '16px "Courier New", monospace';
        this.ctx.fillText('Press SPACE to Resume', this.canvas.width / 2, this.canvas.height / 2 + 30);
    }
    
    drawWinner(playerNum) {
        this.ctx.fillStyle = CONFIG.ACCENT_COLOR;
        this.ctx.font = '48px "Courier New", monospace';
        this.ctx.textAlign = 'center';
        
        this.ctx.fillText(`PLAYER ${playerNum} WINS!`, this.canvas.width / 2, this.canvas.height / 2);
        
        this.ctx.fillStyle = CONFIG.ELEMENT_COLOR;
        this.ctx.font = '16px "Courier New", monospace';
        this.ctx.fillText('Press R to Play Again', this.canvas.width / 2, this.canvas.height / 2 + 40);
    }
}
