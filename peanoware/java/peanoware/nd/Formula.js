// Assuming Resources is imported from another module
// import Resources from './Resources.js';

class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

class Formula {
    static LEFT = false;
    static FALSE = null; // Will be initialized after class definition

    constructor(op, value, left = null, right = null) {
        this.op = op;
        this.select = false;
        this.type = null;
        
        if (left === null && right === null) {
            // Constructor: Formula(op, value)
            this.sons = [];
            this.init = value;
            this.end = "";
            this.sep = "";
        } else if (right === null) {
            // Constructor: Formula(op, value, f)
            this.sons = [left];
            this.init = value;
            this.end = "";
            this.sep = "";
        } else {
            // Constructor: Formula(op, value, left, right)
            this.sons = [left, right];
            this.init = "";
            this.end = "";
            this.sep = value;
        }
    }

    prec() {
        return Resources.getPrec(this.op);
    }

    leftPrec() {
        return Resources.getLeftPrec(this.op);
    }

    rightPrec() {
        return Resources.getRightPrec(this.op);
    }

    getType() {
        return this.type;
    }

    setType(type) {
        this.type = type;
    }

    setProp() {
        this.type = SimpleType.makeProp();
    }

    setTerm() {
        this.type = SimpleType.makeTerm();
    }

    isProp() {
        return this.type.isProp();
    }

    isTerm() {
        return this.type.isTerm();
    }

    getVarValue() {
        return this.op;
    }

    getOp() {
        return this.op;
    }

    get(i) {
        if (typeof i === 'boolean') {
            return this.sons[i === Formula.LEFT ? 0 : 1];
        }
        return this.sons[i];
    }

    isSelected() {
        return this.select;
    }

    select(t = null) {
        if (t === null) {
            this.select = !this.select;
        } else {
            this.select = t;
        }
    }

    // A split with not box
    cleanSplit() {
        let count = 0;
        for (let i = 0; i < this.sons.length; i++) {
            if (this.sons[i].isBox()) {
                count++;
            }
        }
        if (count === 0) {
            return this.sons;
        }
        const res = [];
        for (let i = 0; i < this.sons.length; i++) {
            if (!this.sons[i].isBox()) {
                res.push(this.sons[i]);
            }
        }
        return res;
    }

    split() {
        return this.sons;
    }

    toStringApply() {
        if (Resources.APPLY === this.getOp()) {
            return this.sons[0].toStringApply() +
                (Resources.APPLY === this.sons[0].getOp() ? "," : "(") +
                this.sons[1];
        }
        return this.toString();
    }

    toString() {
        if (Resources.APPLY === this.getOp()) {
            return this.toStringApply() + ")";
        }
//        console.error(this.op + " " + this.prec());
        const prec = this.prec();
        let sonprec;
        let res = this.init;
        
        for (let i = 0; i < this.sons.length - 1; i++) {
            if (i === 0) {
                sonprec = this.sons[i].leftPrec();
            } else {
                sonprec = this.sons[i].rightPrec();
            }
            if (sonprec < prec) {
                res += "(" + this.sons[i].toString() + ")" + this.sep;
            } else {
                res += this.sons[i].toString() + this.sep;
            }
        }
        
        if (this.sons.length !== 0) {
            const i = this.sons.length - 1;
            if (this.sons.length === 1) {
                sonprec = this.sons[i].leftPrec();
            } else {
                sonprec = this.sons[i].rightPrec();
            }
            if (sonprec < prec) {
                res += "(" + this.sons[i].toString() + ")";
            } else {
                res += this.sons[i].toString();
            }
        }
        res += this.end;
        return res;
    }

    maxPoint(index, ref) {
        const length = this.toString().length;
        let res = null;
        for (let i = 0; i < ref.length; i++) {
            if (ref[i].x === 0 && ref[i].y === length) {
                continue;
            }
            if (ref[i].x <= index && index <= ref[i].y) {
                if (res === null || (ref[i].x <= res.x && res.y <= ref[i].y)) {
                    res = ref[i];
                }
            }
        }
        return res;
    }

    putIndex(index, ref, par) {
        const p = new Point(index, index);
        const prec = this.prec();
        let sonprec;
        
        if (par) {
            ref[index++] = p;
        }
        for (let i = 0; i < this.init.length; i++) {
            ref[index++] = p;
        }
        
        for (let i = 0; i < this.sons.length - 1; i++) {
            if (i === 0) {
                sonprec = this.sons[i].leftPrec();
            } else {
                sonprec = this.sons[i].rightPrec();
            }
            if (sonprec < prec) {
                index = this.sons[i].putIndex(index, ref, true);
                for (let j = 0; j < this.sep.length; j++) {
                    ref[index++] = p;
                }
            } else {
                index = this.sons[i].putIndex(index, ref, false);
                for (let j = 0; j < this.sep.length; j++) {
                    ref[index++] = p;
                }
            }
        }
        
        if (this.sons.length !== 0) {
            const i = this.sons.length - 1;
            if (this.sons.length === 1) {
                sonprec = this.sons[i].leftPrec();
            } else {
                sonprec = this.sons[i].rightPrec();
            }
            if (sonprec < prec) {
                index = this.sons[i].putIndex(index, ref, true);
            } else {
                index = this.sons[i].putIndex(index, ref, false);
            }
        }
        
        for (let j = 0; j < this.end.length; j++) {
            ref[index++] = p;
        }
        if (par) {
            ref[index++] = p;
        }
        p.y = index;
        return index;
    }

    collectVars(v) {
        if (this.sons.length === 0) {
            if (!v.includes(this)) {
                v.push(this);
            }
            return;
        }
        for (let i = 0; i < this.sons.length; i++) {
            this.sons[i].collectVars(v);
        }
    }

    containVar(val) {
        if (this.sons.length === 0) {
            return this.getVarValue() === val;
        }
        for (let i = 0; i < this.sons.length; i++) {
            if (this.sons[i].containVar(val)) {
                return true;
            }
        }
        return false;
    }

    equals(o) {
        if (o instanceof Formula) {
            return this.toString() === o.toString();
        }
        return false;
    }

    static makeFalse() {
        return Formula.FALSE;
    }

    isFalse() {
        return Formula.FALSE === this;
    }

    static makeAnd(left, right) {
        if (!(left.isProp() && right.isProp())) {
            return null;
        }
        const res = new Formula(Resources.AND, Resources.getString(Resources.AND), left, right);
        res.setProp();
        return res;
    }

    isAnd() {
        return Resources.AND === this.getOp();
    }

    static makeOr(left, right) {
        if (!(left.isProp() && right.isProp())) {
            return null;
        }
        const res = new Formula(Resources.OR, Resources.getString(Resources.OR), left, right);
        res.setProp();
        return res;
    }

    isOr() {
        return Resources.OR === this.getOp();
    }

    static makeImp(left, right) {
        if (!(left.isProp() && right.isProp())) {
            return null;
        }
        const res = new Formula(Resources.IMP, Resources.getString(Resources.IMP), left, right);
        res.setProp();
        return res;
    }

    isImp() {
        return Resources.IMP === this.getOp();
    }

    static makeNeg(body) {
        if (!body.isProp()) {
            return null;
        }
        const res = new Formula(Resources.NEG, Resources.getString(Resources.NEG), body);
        res.setProp();
        return res;
    }

    isNeg() {
        return Resources.NEG === this.getOp();
    }

    static makeForall(left, right) {
        if (!(left.isTermVar() && right.isProp())) {
            return null;
        }
        const res = new Formula(Resources.FORALL, Resources.QUANT_SEP, left, right);
        res.init = Resources.getString(Resources.FORALL);
        res.setProp();
        return res;
    }

    isForall() {
        return Resources.FORALL === this.getOp();
    }

    static makeExist(left, right) {
        if (!(left.isTermVar() && right.isProp())) {
            return null;
        }
        const res = new Formula(Resources.EXISTS, Resources.QUANT_SEP, left, right);
        res.init = Resources.getString(Resources.EXISTS);
        res.setProp();
        return res;
    }

    isExists() {
        return Resources.EXISTS === this.getOp();
    }

    static makeApply(left, right) {
        if (!((left.isVar() || left.isApply()) && right.isTerm())) {
            return null;
        }
        const res = new Formula(Resources.APPLY, " ", left, right);
        res.init = Resources.getString(Resources.APPLY);
        res.setProp();
        res.setType(left.getType());
        return res;
    }

    isApply() {
        return Resources.APPLY === this.getOp();
    }

    static makePropVar(name) {
        const res = new Formula(name, name.toUpperCase());
        res.setProp();
        return res;
    }

    static makeTermVar(name) {
        const res = new Formula(name, name.toLowerCase());
        res.setTerm();
        return res;
    }

    isPropVar() {
        return this.isProp() && this.isVar();
    }

    isTermVar() {
        return this.isTerm() && this.isVar();
    }

    isVar() {
        if (this.isFalse()) {
            return false;
        }
        return this.sons.length === 0;
    }

    static makePropBox() {
        const res = new Formula(Resources.BOX, Resources.BOX);
        res.setProp();
        return res;
    }

    static makeTermBox() {
        const res = new Formula(Resources.BOX, Resources.BOX);
        res.setTerm();
        return res;
    }

    isBox() {
        return Resources.BOX === this.getVarValue();
    }

    static makeBox(value) {
        if (Resources.IMP === value) {
            return Formula.makeImp(Formula.makePropBox(), Formula.makePropBox());
        }
        if (Resources.AND === value) {
            return Formula.makeAnd(Formula.makePropBox(), Formula.makePropBox());
        }
        if (Resources.OR === value) {
            return Formula.makeOr(Formula.makePropBox(), Formula.makePropBox());
        }
        if (Resources.NEG === value) {
            return Formula.makeNeg(Formula.makePropBox());
        }
        if (Resources.FORALL === value) {
            return Formula.makeForall(Formula.makeTermBox(), Formula.makePropBox());
        }
        if (Resources.EXISTS === value) {
            return Formula.makeForall(Formula.makeTermBox(), Formula.makePropBox());
        }
        if (Resources.APPLY === value) {
            return Formula.makeApply(Formula.makeTermBox(), Formula.makePropBox());
        }
        return null;
    }

    static make(f1, f2OrValue, value = null) {
        if (value === null) {
            // Two argument version: make(f, value)
            const f = f1;
            value = f2OrValue;
            if (Resources.NEG === value) {
                return Formula.makeNeg(f);
            }
            return null;
        }
        // Three argument version: make(f1, f2, value)
        const f2 = f2OrValue;
        if (Resources.IMP === value) {
            return Formula.makeImp(f1, f2);
        }
        if (Resources.AND === value) {
            return Formula.makeAnd(f1, f2);
        }
        if (Resources.OR === value) {
            return Formula.makeOr(f1, f2);
        }
        if (Resources.FORALL === value) {
            return Formula.makeForall(f1, f2);
        }
        if (Resources.EXISTS === value) {
            return Formula.makeForall(f1, f2);
        }
        if (Resources.APPLY === value) {
            return Formula.makeApply(f1, f2);
        }
        return null;
    }

    substBox(i, f) {
        if (this.isBox()) {
            if (i.isNull()) {
                i.decr();
                return f;
            }
            i.decr();
            return this;
        }
        const nsons = new Array(this.sons.length);
        for (let j = 0; j < this.sons.length; j++) {
            nsons[j] = this.sons[j].substBox(i, f);
        }
        const res = new Formula("", "");
        res.sons = nsons;
        res.sep = this.sep;
        res.init = this.init;
        res.end = this.end;
        res.select = this.select;
        return res;
    }
}

// Initialize static FALSE constant
Formula.FALSE = new Formula(Resources.FALSE, Resources.FALSE);

// Export for use as module
// export default Formula;