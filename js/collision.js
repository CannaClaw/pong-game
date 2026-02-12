export class CollisionDetector {
    static checkBallPaddle(ball, paddle) {
        return (
            ball.getRight() >= paddle.getLeft() &&
            ball.getLeft() <= paddle.getRight() &&
            ball.getBottom() >= paddle.getTop() &&
            ball.getTop() <= paddle.getBottom()
        );
    }
    
    static checkBallTopWall(ball) {
        return ball.getTop() <= 0;
    }
    
    static checkBallBottomWall(ball, canvasHeight) {
        return ball.getBottom() >= canvasHeight;
    }
    
    static checkBallLeftBoundary(ball) {
        return ball.getLeft() <= 0;
    }
    
    static checkBallRightBoundary(ball, canvasWidth) {
        return ball.getRight() >= canvasWidth;
    }
}
