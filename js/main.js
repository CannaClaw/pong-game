import { Game } from './game.js';

// Initialize game when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('gameCanvas');
    
    if (!canvas) {
        console.error('Canvas element not found!');
        return;
    }
    
    // Create and start game
    const game = new Game(canvas);
    
    console.log('Pong game initialized!');
});
