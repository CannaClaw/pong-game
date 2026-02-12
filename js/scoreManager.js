import { CONFIG } from './config.js';

export class ScoreManager {
    constructor() {
        this.player1Score = 0;
        this.player2Score = 0;
        this.winningScore = CONFIG.WINNING_SCORE;
    }
    
    incrementPlayer1() {
        this.player1Score++;
    }
    
    incrementPlayer2() {
        this.player2Score++;
    }
    
    checkWinner() {
        if (this.player1Score >= this.winningScore) {
            return 1;
        }
        if (this.player2Score >= this.winningScore) {
            return 2;
        }
        return null;
    }
    
    reset() {
        this.player1Score = 0;
        this.player2Score = 0;
    }
    
    getScores() {
        return {
            player1: this.player1Score,
            player2: this.player2Score
        };
    }
}
