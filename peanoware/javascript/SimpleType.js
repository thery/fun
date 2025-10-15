/**
 * SimpleType.js
 * 
 * Translated from Java - Created on November 18, 2004, 11:10 PM
 * @author thery
 */

// If Type base class doesn't exist, you can use this minimal version:
class Type {
    // Base class for type hierarchy
}

class SimpleType extends Type {
    static PROP = "Prop";
    static TERM = "Term";
    
    constructor(type) {
        super();
        this.type = type;
    }
    
    isProp() {
        return SimpleType.PROP === this.type;
    }
    
    static makeProp() {
        return new SimpleType(SimpleType.PROP);
    }
    
    isTerm() {
        return SimpleType.TERM === this.type;
    }
    
    static makeTerm() {
        return new SimpleType(SimpleType.TERM);
    }
    
    equals(o) {
        return o instanceof SimpleType && this.type === o.type;
    }
}


// Export for use in modules (if needed)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SimpleType;
}

export default SimpleType;
