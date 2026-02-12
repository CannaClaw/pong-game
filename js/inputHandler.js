export class InputHandler {
    constructor() {
        this.keys = {};
        this.callbacks = {
            keyDown: [],
            keyUp: []
        };
        
        this.setupListeners();
    }
    
    setupListeners() {
        window.addEventListener('keydown', (e) => {
            // Prevent scrolling with arrow keys
            if (['ArrowUp', 'ArrowDown', 'Space'].includes(e.code)) {
                e.preventDefault();
            }
            
            this.keys[e.code] = true;
            
            this.callbacks.keyDown.forEach(callback => callback(e.code));
        });
        
        window.addEventListener('keyup', (e) => {
            this.keys[e.code] = false;
            
            this.callbacks.keyUp.forEach(callback => callback(e.code));
        });
    }
    
    isKeyPressed(keyCode) {
        return this.keys[keyCode] === true;
    }
    
    onKeyDown(callback) {
        this.callbacks.keyDown.push(callback);
    }
    
    onKeyUp(callback) {
        this.callbacks.keyUp.push(callback);
    }
}
