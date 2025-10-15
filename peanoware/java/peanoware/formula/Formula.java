package peanoware.formula;

import peanoware.Resources;
import java.util.Vector;
import java.awt.Point;

public class Formula {
     
    public static boolean LEFT = false;
    public static final Formula FALSE = new Formula(Resources.FALSE,
                                                    Resources.FALSE);
    private Formula[] sons;
    private String op;
    private String sep;
    private String init;
    private String end;
    private boolean select;
    private Type type;
    public final int prec () {
        return Resources.getPrec(op);
    }
    
    public final int leftPrec () {
        return Resources.getLeftPrec(op);
    }
    
    public final int rightPrec () {
        return Resources.getRightPrec(op);
    }
    public Type getType() {
        return type;
    }

    public void setType(Type type) {
        this.type = type;
    }
    public void setProp() {
        type = SimpleType.makeProp();
    }
    public void setTerm() {
        type = SimpleType.makeTerm();
    }
    public boolean isProp() {
        return type.isProp();
    }
    public boolean isTerm() {
        return type.isTerm();
    }    
    public Formula(String op, String value) {
        this.op = op;
	sons = new Formula[0];
	init = value;
	end = "";
	sep = "";
    }
    public Formula(String op, String value, Formula f) {
        this.op = op;
        sons = new Formula[]{f};
	init = value;
	end = "";
	sep = "";
    }
    public Formula(String op, String value, Formula left, Formula right) {
        this.op = op;        
	sons = new Formula[]{left, right};
	init = "";
	end = "";
	sep = value;
    }

    public String getVarValue() {
        return op;
    }
    public String getOp() {
        return op;
    }
    public Formula get(int i) {
        return sons[i];
    }
    public Formula get(boolean b) {
        return sons[b == LEFT ? 0 : 1];
    }
    public boolean isSelected() {
	return select;
    }
    public void select() {
	select = !select;
    }
    public void select(boolean t) {
	select = t;
    }
    // A split with not box;
    public Formula[] cleanSplit() {
        int count = 0;
        for (int i = 0; i < sons.length; i++) {
            if (sons[i].isBox()) {
                count++;
            }
        }
        if (count == 0) {
            return sons;
        }
        Formula[] res = new Formula[sons.length - count];
        count = 0;
        for (int i = 0; i < sons.length; i++) {
            if (!sons[i].isBox()) {
                res[count++] = sons[i];
            }
        }
	return res;
    }
    public Formula[] split() {
	return sons;
    }
    public String toStringApply() {
        if (Resources.APPLY.equals(getOp())) {
            return sons[0].toStringApply()  + 
                    (Resources.APPLY.equals(sons[0].getOp()) ? "," : "(")
                    + sons[1];
        }
        return toString();
    }
    public String toString() {
        if (Resources.APPLY.equals(getOp())) {
            return toStringApply() + ")";
        }
        System.err.println(op + " " + prec());
        int prec = prec();
        int sonprec;
	String res = init;
	for (int i = 0; i < sons.length - 1; i++) {
            if (i == 0) {
                sonprec = sons[i].leftPrec();
            } else {
                sonprec = sons[i].rightPrec();
            }
            if (sonprec < prec) {
                res += "(" + sons[i].toString() + ")" + sep;
            } else {
                res += sons[i].toString() + sep;
            }
	}
	if (sons.length != 0) {
            int i = sons.length - 1;
            if (sons.length == 1) {
                sonprec = sons[i].leftPrec();
            } else {
                sonprec = sons[i].rightPrec();
            }
            if (sonprec < prec) {
                res += "(" + sons[i].toString() + ")";
            } else {
                res += sons[i].toString();
            }
	}
	res += end;
	return res;
    }
    public Point maxPoint(int index, Point[] ref) {
        int length = toString().length();
        Point res = null;
        for (int i = 0; i < ref.length; i++) {
            if (ref[i].x == 0 && ref[i].y == length) {
                continue;
            }
            if (ref[i].x <= index && index <= ref[i].y) {
                if (res == null || (ref[i].x <= res.x && res.y <= ref[i].y)) {
                    res = ref[i];
                } 
            }
        }
        return res;
    }
    public int putIndex(int index, Point[] ref, boolean par) {
        Point p = new Point(index, index);
        int prec = prec();
        int sonprec;
        if (par) {
            ref[index++] = p;
        }
        for (int i = 0; i < init.length(); i++) {
            ref[index++] = p;
        }
	for (int i = 0; i < sons.length - 1; i++) {
            if (i == 0) {
                sonprec = sons[i].leftPrec();
            } else {
                sonprec = sons[i].rightPrec();
            }
            if (sonprec < prec) {
                index = sons[i].putIndex(index, ref, true);
                for (int j = 0; j < sep.length(); j++) {
                    ref[index++] = p;
                }               
            } else {
                index = sons[i].putIndex(index, ref, false);
                for (int j = 0; j < sep.length(); j++) {
                    ref[index++] = p;
                }
            }
	}
	if (sons.length != 0) {
            int i = sons.length - 1;
            if (sons.length == 1) {
                sonprec = sons[i].leftPrec();
            } else {
                sonprec = sons[i].rightPrec();
            }
            if (sonprec < prec) {
                index = sons[i].putIndex(index, ref, true);
             } else {
                index = sons[i].putIndex(index, ref, false);
            }
	}
        for (int j = 0; j < end.length(); j++) {
            ref[index++] = p;
        }
        if (par) {
            ref[index++] = p;
        }
        p.y = index;
	return index;
    }
    public void collectVars(Vector v) {
        if (sons.length == 0) {
            if (!v.contains(this)) {
                v.add(this);
            }
            return;
        }
        for (int i = 0; i < sons.length; i++) {
            sons[i].collectVars(v);
        }
    }
    public boolean containVar(String val) {
        if (sons.length == 0) {
            return getVarValue().equals(val);
        }
        for (int i = 0; i < sons.length; i++) {
            if (sons[i].containVar(val)) {
                return true;
            }          
        }
        return false;
    }
    public boolean equals(Object o) {
        if (o instanceof Formula) {
            Formula f = (Formula) o;
            
            return this.toString().equals(f.toString());
        }
        return false;
    }
    public static Formula makeFalse() {
        return FALSE;
    }
    public boolean isFalse() {
        return FALSE == this;
    }    
    public static Formula makeAnd(Formula left, Formula right) {
        if (!(left.isProp() && right.isProp())) {
            return null;
        }
        Formula res =
            new Formula(Resources.AND,
                        Resources.getString(Resources.AND), left, right);
        res.setProp();
        return res;
    }
    public boolean isAnd() {
        return Resources.AND.equals(getOp());
    }
    public static Formula makeOr(Formula left, Formula right) {
        if (!(left.isProp() && right.isProp())) {
            return null;
        }
        Formula res =
            new Formula(Resources.OR,
                        Resources.getString(Resources.OR), left, right);
        res.setProp();
        return res;
    }
    public boolean isOr() {
        return Resources.OR.equals(getOp());
    }
    public static Formula makeImp(Formula left, Formula right) {
                if (!(left.isProp() && right.isProp())) {
            return null;
        }
        Formula res =
            new Formula(Resources.IMP,
                        Resources.getString(Resources.IMP), left, right);
        res.setProp();
        return res;
    }
    public boolean isImp() {
        return Resources.IMP.equals(getOp());
    }
    public static Formula makeNeg(Formula body) {
        if (!(body.isProp())) {
            return null;
        }
        Formula res = 
            new Formula(Resources.NEG,
                        Resources.getString(Resources.NEG), body);
        res.setProp();
        return res;
    }
    public boolean isNeg() {
        return Resources.NEG.equals(getOp());
    }
    public static Formula makeForall(Formula left, Formula right) {
        if (!(left.isTermVar() && right.isProp())) {
            return null;
        }
        Formula res =
            new Formula(Resources.FORALL, Resources.QUANT_SEP, left, right);
        res.init = Resources.getString(Resources.FORALL);
        res.setProp();
        return res;
    }
    public boolean isForall() {
        return Resources.FORALL.equals(getOp());
    }
    public static Formula makeExist(Formula left, Formula right) {
        if (!(left.isTermVar() && right.isProp())) {
            return null;
        }
        Formula res =
            new Formula(Resources.EXISTS, Resources.QUANT_SEP, left, right);
        res.init = Resources.getString(Resources.EXISTS);
        res.setProp();
        return res;
    }
    public boolean isExists() {
        return Resources.EXISTS.equals(getOp());
    }
    public static Formula makeApply(Formula left, Formula right) {
        if (!((left.isVar() ||  left.isApply()) & right.isTerm())) {
            return null;
        }
        Formula res =
            new Formula(Resources.APPLY, " ", left, right);
        res.init = Resources.getString(Resources.APPLY);
        res.setProp();
        res.setType(left.getType());
        return res;
    }
    public boolean isApply() {
        return Resources.APPLY.equals(getOp());
    }
    
    public static Formula makePropVar(String name) {
        Formula res = new Formula(name, name.toUpperCase());
        res.setProp();
        return res;
    }
    
    public static Formula makeTermVar(String name) {
        Formula res = new Formula(name, name.toLowerCase());
        res.setTerm();
        return res;
    }    
    public boolean isPropVar() {
        return isProp() && isVar();
   }
    public boolean isTermVar() {
        return isTerm() && isVar();
    }
    public boolean isVar() {
        if (isFalse()) {
            return false;
        }
        return sons.length == 0;
    }    
    public static Formula makePropBox() {
        Formula res =  new Formula(Resources.BOX, Resources.BOX);
        res.setProp();
        return res;
    }
    public static Formula makeTermBox() {
        Formula res =  new Formula(Resources.BOX, Resources.BOX);
        res.setTerm();
        return res;
    }
    public boolean isBox() {
        return Resources.BOX.equals(getVarValue());
    }
    public static Formula makeBox(String value) {
        if (Resources.IMP.equals(value)) {
            return makeImp(makePropBox(), makePropBox());
        }
        if (Resources.AND.equals(value)) {
            return makeAnd(makePropBox(), makePropBox());
        }        
        if (Resources.OR.equals(value)) {
            return makeOr(makePropBox(), makePropBox());
        }        
        if (Resources.NEG.equals(value)) {
            return makeNeg(makePropBox());
        } 
        if (Resources.FORALL.equals(value)) {
            return makeForall(makeTermBox(), makePropBox());
        }
        if (Resources.EXISTS.equals(value)) {
            return makeForall(makeTermBox(), makePropBox());
        }
        if (Resources.APPLY.equals(value)) {
            return makeApply(makeTermBox(), makePropBox());
        }        
        return null;
    } 
    public static Formula make(Formula f1, Formula f2, String value) {
        if (Resources.IMP.equals(value)) {
            return makeImp(f1, f2);
        }
        if (Resources.AND.equals(value)) {
            return makeAnd(f1, f2);
        }        
        if (Resources.OR.equals(value)) {
            return makeOr(f1, f2);
        }        
        if (Resources.FORALL.equals(value)) {
            return makeForall(f1, f2);
        }
        if (Resources.EXISTS.equals(value)) {
            return makeForall(f1, f2);
        }
        if (Resources.APPLY.equals(value)) {
            return makeApply(f1, f2);
        }           
        return null;
    }    
    public static Formula make(Formula f, String value) {
        if (Resources.NEG.equals(value)) {
            return makeNeg(f);
        } 
        return null;
    }    
    public Formula substBox(Integer i, Formula f) {
        if (isBox()) {
            if (i.isNull()) {
                i.decr();
                return f;
            }
            i.decr();
            return this;
        }
        Formula[] nsons = new Formula[sons.length];
        for (int j = 0; j < sons.length; j++) {
            nsons[j] = sons[j].substBox(i, f);
        }
        Formula res = new Formula("", "");
        res.sons = nsons;
        res.sep = sep;
        res.init = init;
        res.end = end;
        res.select = select;  
        return res;
    }
}