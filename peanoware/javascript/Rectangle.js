/**
 * Rectangle.js
 * 
 * Rectangle class for geometric operations
 */
class Rectangle {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    /**
     * Check if the rectangle is empty (zero or negative dimensions)
     */
    isEmpty() {
        return this.width <= 0 || this.height <= 0;
    }

    /**
     * Get the intersection of this rectangle with another
     */
    intersection(other) {
        const x = Math.max(this.x, other.x);
        const y = Math.max(this.y, other.y);
        const width = Math.min(this.x + this.width, other.x + other.width) - x;
        const height = Math.min(this.y + this.height, other.y + other.height) - y;
        
        return new Rectangle(x, y, Math.max(0, width), Math.max(0, height));
    }

    /**
     * Get the X coordinate
     */
    getX() {
        return this.x;
    }

    /**
     * Get the Y coordinate
     */
    getY() {
        return this.y;
    }

    /**
     * Get the width
     */
    getWidth() {
        return this.width;
    }

    /**
     * Get the height
     */
    getHeight() {
        return this.height;
    }
    
    grow (h, v) {
        this.x -= h;
        this.y -= v;
        this.width += 2 * h;
        this.height += 2 * v;
    }
    add (r) {
        const x1 = Math.min(this.x, r.x);
        const y1 = Math.min(this.y, r.y);
        const x2 = Math.max(this.x + this.width, r.x + r.width);
        const y2 = Math.max(this.y + this.height, r.y + r.height);
        this.x = x1;
        this.y = y1;
        this.width = x2 - x1;
        this.height = y2 - y1;
    }
    setBounds(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }
    setrBounds(r) {
        this.x = r.x;
        this.y = r.y;
        this.width = r.width;
        this.height = r.height;
    }
    translate(x, y) {
        this.x += x;
        this.y += y;
    }
    contains (x, y) {
        return ((this.x <= x) && (x <= this.x + this.width) && 
                (this.y <= y) && (y <= this.y + this.height));
    }

    toString() {
        return "Rectangle(" + this.x + ", " + this.y + ", " + this.width + ", " + this.height + ")";
    }

    getCenterX() {
        return this.width / 2;
    }
    getCenterY() {
        return this.height / 2;
    }

}

// Export for use in modules (if needed)
//if (typeof module !== 'undefined' && module.exports) {
//    module.exports = Rectangle;
//}

// For ES6 module export (if needed)
export default Rectangle;
