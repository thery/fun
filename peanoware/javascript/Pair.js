// Pair.js - Translation from Java
import Formula from './Formula.js';
import Tree from './Tree.js';

class Pair {
    constructor(ctx) {
        this.main = null;
        this.hyp = [];
        this.modifHyp = false;
        this.modifMain = false;
        this.init(ctx);
    }

    static x = 'x'; // Resources.BUILD_PROP_VAR[0]
    static y = 'y'; // Resources.BUILD_PROP_VAR[1]
    static z = 'z'; // Resources.BUILD_PROP_VAR[2]
    static t = 't'; // Resources.BUILD_PROP_VAR[3]

    static examples = [
        // ((x -> y) /\ (y -> z)) -> (x => z)
        Formula.makeImp(
            Formula.makeAnd(
                Formula.makeImp(Formula.makePropVar(Pair.x), Formula.makePropVar(Pair.y)),
                Formula.makeImp(Formula.makePropVar(Pair.y), Formula.makePropVar(Pair.z))), 
            Formula.makeImp(Formula.makePropVar(Pair.x), Formula.makePropVar(Pair.z))), 
       // ((x \/ y) /\ (~y \/ z)) -> (x \/ z)
        Formula.makeImp(
            Formula.makeAnd(
                Formula.makeOr(Formula.makePropVar(Pair.x), Formula.makePropVar(Pair.y)),
                Formula.makeOr(
                    Formula.makeNeg(Formula.makePropVar(Pair.y)),
                    Formula.makePropVar(Pair.z))),
            Formula.makeOr(Formula.makePropVar(Pair.x), Formula.makePropVar(Pair.z))), 
        // ((x \/ y) /\ (~x\/ y)) -> y
        Formula.makeImp(
            Formula.makeAnd(
                Formula.makeOr(Formula.makePropVar(Pair.x), Formula.makePropVar(Pair.y)),
                Formula.makeOr(
                    Formula.makeNeg(Formula.makePropVar(Pair.x)),
                    Formula.makePropVar(Pair.y))),
            Formula.makePropVar(Pair.y)), 
       // ((x \/ y) /\ ~y) -> x
        Formula.makeImp(
            Formula.makeAnd(
                Formula.makeOr(Formula.makePropVar(Pair.x), Formula.makePropVar(Pair.y)),
                Formula.makeNeg(Formula.makePropVar(Pair.y))), 
            Formula.makePropVar(Pair.x)), 
        // (~x \/ ~y) -> ~(x /\ y)
        Formula.makeImp(
            Formula.makeOr(
                Formula.makeNeg(Formula.makePropVar(Pair.x)),
                Formula.makeNeg(Formula.makePropVar(Pair.y))), 
            Formula.makeNeg(
                Formula.makeAnd(Formula.makePropVar(Pair.x), Formula.makePropVar(Pair.y)))), 
        // (~x /\ ~y) -> ~(x \/ y)
        Formula.makeImp(
            Formula.makeAnd(
                Formula.makeNeg(Formula.makePropVar(Pair.x)),
                Formula.makeNeg(Formula.makePropVar(Pair.y))), 
            Formula.makeNeg(
                Formula.makeOr(Formula.makePropVar(Pair.x), Formula.makePropVar(Pair.y)))),                   
        // x -> ~~x
        Formula.makeImp(
            Formula.makePropVar(Pair.x), 
            Formula.makeNeg(Formula.makeNeg(Formula.makePropVar(Pair.x)))),          
        // ~~~x -> ~x
        Formula.makeImp(
            Formula.makeNeg(
                Formula.makeNeg(Formula.makeNeg(Formula.makePropVar(Pair.x)))),           
            Formula.makeNeg(Formula.makePropVar(Pair.x))),
        // (x -> y) -> ~y -> ~x
        Formula.makeImp(
            Formula.makeImp(Formula.makePropVar(Pair.x), Formula.makePropVar(Pair.y)), 
            Formula.makeImp(
                Formula.makeNeg(Formula.makePropVar(Pair.y)),
                Formula.makeNeg(Formula.makePropVar(Pair.x)))),     
        // (x -> y) -> ~y -> ~x
        Formula.makeImp(
            Formula.makeImp(Formula.makePropVar(Pair.x), Formula.makePropVar(Pair.y)), 
            Formula.makeImp(
                Formula.makeNeg(Formula.makePropVar(Pair.y)),
                Formula.makeNeg(Formula.makePropVar(Pair.x)))),     
        // (x -> y) -> ~y -> ~x
        Formula.makeImp(
            Formula.makeImp(Formula.makePropVar(Pair.x), Formula.makePropVar(Pair.y)), 
            Formula.makeImp(
                Formula.makeNeg(Formula.makePropVar(Pair.y)),
                Formula.makeNeg(Formula.makePropVar(Pair.x)))),     
        // ~~(x \/ x)
        Formula.makeNeg(
            Formula.makeNeg(
                Formula.makeOr(Formula.makePropVar(Pair.x),
                Formula.makeNeg(Formula.makePropVar(Pair.x))))),
        // (x /\ y) /\ z -> x /\ y /\ z
        Formula.makeImp(
            Formula.makeImp(
                Formula.makeAnd(Formula.makePropVar(Pair.x), Formula.makePropVar(Pair.y)),
                Formula.makePropVar(Pair.z)), 
            Formula.makeImp(
                Formula.makePropVar(Pair.x),
                Formula.makeImp(Formula.makePropVar(Pair.y), Formula.makePropVar(Pair.z)))),
        // (x -> y -> z) -> ((x /\ y) -> z)
        Formula.makeImp(
            Formula.makeImp(Formula.makePropVar(Pair.x),
                Formula.makeImp(Formula.makePropVar(Pair.y), Formula.makePropVar(Pair.z))),
            Formula.makeImp(
                Formula.makeAnd(Formula.makePropVar(Pair.x), Formula.makePropVar(Pair.y)),
                Formula.makePropVar(Pair.z))), 
         // ((x -> y) -> z) -> (x -> z)
        Formula.makeImp(
            Formula.makeImp(
                Formula.makeImp(Formula.makePropVar(Pair.x), Formula.makePropVar(Pair.y)),
                Formula.makePropVar(Pair.z)),         
            Formula.makeImp(Formula.makePropVar(Pair.y), Formula.makePropVar(Pair.z))),                
         // (x -> y -> z) -> ((x /\ y) -> z)
        Formula.makeImp(
            Formula.makeImp(
                Formula.makeAnd(Formula.makePropVar(Pair.x), Formula.makePropVar(Pair.y)),
                Formula.makePropVar(Pair.z)),         
            Formula.makeImp(Formula.makePropVar(Pair.x),
                Formula.makeImp(Formula.makePropVar(Pair.y), Formula.makePropVar(Pair.z)))), 
        // (x /\ y /\ z) -> ((z /\ y) /\ z
        Formula.makeImp(
            Formula.makeAnd(Formula.makePropVar(Pair.x),
                Formula.makeAnd(Formula.makePropVar(Pair.y), Formula.makePropVar(Pair.z))),
            Formula.makeAnd(
                Formula.makeAnd(Formula.makePropVar(Pair.z), Formula.makePropVar(Pair.y)),
                Formula.makePropVar(Pair.x))),
        // ((x -> y) /\ (z -> t)) -> (x /\ z) -> (y /\ t)
        Formula.makeImp(
            Formula.makeAnd(
                Formula.makeImp(Formula.makePropVar(Pair.x), Formula.makePropVar(Pair.y)), 
                Formula.makeImp(Formula.makePropVar(Pair.z), Formula.makePropVar(Pair.t))), 
            Formula.makeImp(
                Formula.makeAnd(Formula.makePropVar(Pair.x), Formula.makePropVar(Pair.z)),
                Formula.makeAnd(Formula.makePropVar(Pair.y), Formula.makePropVar(Pair.t)))),
        // (x /\ y) -> (y /\ x)
        Formula.makeImp(
            Formula.makeAnd(Formula.makePropVar(Pair.x), Formula.makePropVar(Pair.y)),
            Formula.makeAnd(Formula.makePropVar(Pair.y), Formula.makePropVar(Pair.x))),
        // (x \/ y) -> (y \/ x)                    
        Formula.makeImp(
            Formula.makeOr(Formula.makePropVar(Pair.x), Formula.makePropVar(Pair.y)),
            Formula.makeOr(Formula.makePropVar(Pair.y), Formula.makePropVar(Pair.x))),
        // (x \/ y \/ z) -> (x \/ y) \/ z
        Formula.makeImp(
            Formula.makeOr(Formula.makePropVar(Pair.x),
                Formula.makeOr(Formula.makePropVar(Pair.y), Formula.makePropVar(Pair.z))),
             Formula.makeOr(
                Formula.makeOr(Formula.makePropVar(Pair.x), Formula.makePropVar(Pair.y)),
                Formula.makePropVar(Pair.z))),
        // (x \/ y \/ z) -> (z \/ y) \/ x
        Formula.makeImp(
            Formula.makeOr(Formula.makePropVar(Pair.x),
                Formula.makeOr(Formula.makePropVar(Pair.y), Formula.makePropVar(Pair.z))),
            Formula.makeOr(
                Formula.makeOr(Formula.makePropVar(Pair.z), Formula.makePropVar(Pair.y)),
                Formula.makePropVar(Pair.x)))
    ];

    init(ctx) {
        this.ctx = ctx;
        this.hyp = [];
        // Alternative: generate random formula
        // const f = Box.genFormula(Resources.BUILD_OP, Resources.BUILD_VAR, 4, 10, 200);
        
        const f = Pair.examples[Math.floor(Math.random() * Pair.examples.length)];
        this.main = new Tree(f, false, ctx);
        this.modifMain = true;
        this.modifHyp = false;
    }

    draw(g, currentTree, v) {
        this.main.draw(g, currentTree === this.main, v);
        for (const tmp of this.hyp) {
            tmp.draw(g, currentTree === tmp, v);
        }
    }

    setMain(tree) {
        this.main = tree;
        tree.father = null;
    }

    getMain() {
        return this.main;
    }

    addHyp(tree, i = null) {
        if (i !== null) {
            this.hyp.splice(i, 0, tree);
        } else {
            this.hyp.push(tree);
        }
        tree.father = null;
    }

    removeHyp(tree) {
        const index = this.hyp.indexOf(tree);
        if (index > -1) {
            this.hyp.splice(index, 1);
        }
    }

    hasHyp() {
        return this.hyp.length !== 0;
    }

    inside(x, y, p) {
        let t = this.main.inside(x, y, p);
        if (t !== null) {
            return t;
        }
        for (const tmp of this.hyp) {
            t = tmp.inside(x, y, p);
            if (t !== null) {
                return t;
            }
        }
        return null;
    }

    findRoot(x, y) {
        if (this.main.getRectangle().contains(x, y)) {
            return this.main;
        }

        for (const tmp of this.hyp) {
            if (tmp.getRectangle().contains(x, y)) {
                return tmp;
            }
        }
        return null;
    }

    findHyp(f) {
        for (const tmp of this.hyp) {
            if (tmp.getConclusion().equals(f)) {
                return tmp;
            }
        }
        return null;
    }

    hasWon() {
        return this.nHyps() === 0 && this.main.closed();
    }

    nHyps() {
        return this.hyp.length;
    }

    getHyps() {
        return this.hyp;
    }

    getIndex(tree) {
        return this.hyp.indexOf(tree);
    }
}

/*
// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Pair;
}
*/

export default Pair;
