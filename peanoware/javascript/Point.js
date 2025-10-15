/**
 * Point.js
 * 
 * Point class for coordinate operations
 */
class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    getX() {
        return this.x;
    }

    getY() {
        return this.y;
    }

    copy(p) {
        this.x = p.getX();
        this.y = p.getY();
    }

    toString() {
        return "Point(" + this.x + ", " + this.y + ")";
    }
    
}

export default Point