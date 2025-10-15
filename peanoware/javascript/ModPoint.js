// ModPoint.js - Translation from Java
// Created on 10 ottobre 2004, 0.50
// @author monica

/**
 * A point with x, y coordinates and a modification value
 */
class ModPoint {
    constructor(x = 0, y = 0, mod = 0) {
        this.x = x;
        this.y = y;
        this.mod = mod;
    }

    /**
     * Set this point from another ModPoint or from individual values
     * @param {ModPoint|number} p - Either a ModPoint to copy or x coordinate
     * @param {number} [y] - Y coordinate (if first param is a number)
     * @param {number} [mod] - Modification value (if first param is a number)
     */
    setM(m) {
        this.set(m.x, m.y, m.mod);
    }
    set(x, y , mod) {
        this.x = x;
        this.y = y;
        this.mod = mod;
    }

    setX(x) {
        this.x = x;
    }

    getX() {
        return this.x;
    }

    setY(y) {
        this.y = y;
    }

    getY() {
        return this.y;
    }

    setMod(mod) {
        this.mod = mod;
    }

    getMod() {
        return this.mod;
    }

    translate(dx, dy) {
        this.x += dx;
        this.y += dy;
    }

    /**
     * Create a copy of this ModPoint
     * @returns {ModPoint} A new ModPoint with the same values
     */
    clone() {
        return new ModPoint(this.x, this.y, this.mod);
    }

    /**
     * Check if this point equals another ModPoint
     * @param {ModPoint} other - The point to compare with
     * @returns {boolean} True if all coordinates and mod are equal
     */
    equals(other) {
        if (!(other instanceof ModPoint)) return false;
        return this.x === other.x && this.y === other.y && this.mod === other.mod;
    }

    /**
     * String representation of this point
     * @returns {string} String in format "(x, y, mod)"
     */
    toString() {
        return `(ModPoint ${this.x}, ${this.y}, ${this.mod})`;
    }
}

/*
// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ModPoint;
}
*/

export default ModPoint;
