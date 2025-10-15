package peanoware.nd;

import peanoware.Resources;
import peanoware.formula.Formula;
import peanoware.build.Box;
import peanoware.geometry.Visible;
import java.util.Vector;
import java.util.Enumeration;
import java.util.Random;
import java.awt.Graphics2D;
import java.awt.Point;


public class Pair {
    Tree main;
    Vector hyp;
    boolean modifHyp;
    boolean modifMain;
    public Pair() {
        init();
    }
    static private String x = Resources.BUILD_PROP_VAR[0];
    static private String y = Resources.BUILD_PROP_VAR[1];
    static private String z = Resources.BUILD_PROP_VAR[2];
    static private String t = Resources.BUILD_PROP_VAR[3];
    static Random rand = new Random();

    static Formula[] examples = new Formula[] {
        // ((x -> y) /\ (y -> z)) -> (x => z)
        Formula.makeImp(
            Formula.makeAnd(
                Formula.makeImp(Formula.makePropVar(x), Formula.makePropVar(y)),
                Formula.makeImp(Formula.makePropVar(y), Formula.makePropVar(z))), 
            Formula.makeImp(Formula.makePropVar(x), Formula.makePropVar(z))), 
       // ((x \/ y) /\ (~y \/ z)) -> (x \/ z)
        Formula.makeImp(
            Formula.makeAnd(
                Formula.makeOr(Formula.makePropVar(x), Formula.makePropVar(y)),
                Formula.makeOr(
                    Formula.makeNeg(Formula.makePropVar(y)),
                    Formula.makePropVar(z))),
            Formula.makeOr(Formula.makePropVar(x), Formula.makePropVar(z))), 
        // ((x \/ y) /\ (~x\/ y)) -> y
        Formula.makeImp(
            Formula.makeAnd(
                Formula.makeOr(Formula.makePropVar(x), Formula.makePropVar(y)),
                Formula.makeOr(
                    Formula.makeNeg(Formula.makePropVar(x)),
                    Formula.makePropVar(y))),
            Formula.makePropVar(y)), 
       // ((x \/ y) /\ ~y) -> x
        Formula.makeImp(
            Formula.makeAnd(
                Formula.makeOr(Formula.makePropVar(x), Formula.makePropVar(y)),
                Formula.makeNeg(Formula.makePropVar(y))), 
            Formula.makePropVar(x)), 
        // (~x \/ ~y) -> ~(x /\ y)
        Formula.makeImp(
            Formula.makeOr(
                Formula.makeNeg(Formula.makePropVar(x)),
                Formula.makeNeg(Formula.makePropVar(y))), 
            Formula.makeNeg(
                Formula.makeAnd(Formula.makePropVar(x), Formula.makePropVar(y)))), 
        // (~x /\ ~y) -> ~(x \/ y)
        Formula.makeImp(
            Formula.makeAnd(
                Formula.makeNeg(Formula.makePropVar(x)),
                Formula.makeNeg(Formula.makePropVar(y))), 
            Formula.makeNeg(
                Formula.makeOr(Formula.makePropVar(x), Formula.makePropVar(y)))),                   
        // x -> ~~x
        Formula.makeImp(
            Formula.makePropVar(x), 
            Formula.makeNeg(Formula.makeNeg(Formula.makePropVar(x)))),          
        // ~~~x -> ~x
        Formula.makeImp(
            Formula.makeNeg(
                Formula.makeNeg(Formula.makeNeg(Formula.makePropVar(x)))),           
            Formula.makeNeg(Formula.makePropVar(x))),
        // (x -> y) -> ~y -> ~x
        Formula.makeImp(
            Formula.makeImp(Formula.makePropVar(x), Formula.makePropVar(y)), 
            Formula.makeImp(
                Formula.makeNeg(Formula.makePropVar(y)),
                Formula.makeNeg(Formula.makePropVar(x)))),     
        // (x -> y) -> ~y -> ~x
        Formula.makeImp(
            Formula.makeImp(Formula.makePropVar(x), Formula.makePropVar(y)), 
            Formula.makeImp(
                Formula.makeNeg(Formula.makePropVar(y)),
                Formula.makeNeg(Formula.makePropVar(x)))),     
        // (x -> y) -> ~y -> ~x
        Formula.makeImp(
            Formula.makeImp(Formula.makePropVar(x), Formula.makePropVar(y)), 
            Formula.makeImp(
                Formula.makeNeg(Formula.makePropVar(y)),
                Formula.makeNeg(Formula.makePropVar(x)))),     
        // ~~(x \/ x)
        Formula.makeNeg(
            Formula.makeNeg(
                Formula.makeOr(Formula.makePropVar(x),
                Formula.makeNeg(Formula.makePropVar(x))))),
        // (x /\ y) /\ z -> x /\ y /\ z
        Formula.makeImp(
            Formula.makeImp(
                Formula.makeAnd(Formula.makePropVar(x), Formula.makePropVar(y)),
                Formula.makePropVar(z)), 
            Formula.makeImp(
                Formula.makePropVar(x),
                Formula.makeImp(Formula.makePropVar(y), Formula.makePropVar(z)))),
        // (x -> y -> z) -> ((x /\ y) -> z)
        Formula.makeImp(
            Formula.makeImp(Formula.makePropVar(x),
                Formula.makeImp(Formula.makePropVar(y), Formula.makePropVar(z))),
            Formula.makeImp(
                Formula.makeAnd(Formula.makePropVar(x), Formula.makePropVar(y)),
                Formula.makePropVar(z))), 
         // ((x -> y) -> z) -> (x -> z)
        Formula.makeImp(
            Formula.makeImp(
                Formula.makeImp(Formula.makePropVar(x), Formula.makePropVar(y)),
                Formula.makePropVar(z)),         
            Formula.makeImp(Formula.makePropVar(y), Formula.makePropVar(z))),                
         // (x -> y -> z) -> ((x /\ y) -> z)
        Formula.makeImp(
            Formula.makeImp(
                Formula.makeAnd(Formula.makePropVar(x), Formula.makePropVar(y)),
                Formula.makePropVar(z)),         
            Formula.makeImp(Formula.makePropVar(x),
                Formula.makeImp(Formula.makePropVar(y), Formula.makePropVar(z)))), 
        // (x /\ y /\ z) -> ((z /\ y) /\ z
        Formula.makeImp(
            Formula.makeAnd(Formula.makePropVar(x),
                Formula.makeAnd(Formula.makePropVar(y),Formula.makePropVar(z))),
            Formula.makeAnd(
                Formula.makeAnd(Formula.makePropVar(z), Formula.makePropVar(y)),
                Formula.makePropVar(x))),
        // ((x -> y) /\ (z -> t)) -> (x /\ z) -> (y /\ t)
        Formula.makeImp(
            Formula.makeAnd(
                Formula.makeImp(Formula.makePropVar(x), Formula.makePropVar(y)), 
                Formula.makeImp(Formula.makePropVar(z), Formula.makePropVar(t))), 
            Formula.makeImp(
                Formula.makeAnd(Formula.makePropVar(x), Formula.makePropVar(z)),
                Formula.makeAnd(Formula.makePropVar(y), Formula.makePropVar(t)))),
        // (x /\ y) -> (y /\ x)
        Formula.makeImp(
            Formula.makeAnd(Formula.makePropVar(x), Formula.makePropVar(y)),
            Formula.makeAnd(Formula.makePropVar(y), Formula.makePropVar(x))),
        // (x \/ y) -> (y \/ x)                    
        Formula.makeImp(
            Formula.makeOr(Formula.makePropVar(x), Formula.makePropVar(y)),
            Formula.makeOr(Formula.makePropVar(y), Formula.makePropVar(x))),
        // (x \/ y \/ z) -> (x \/ y) \/ z
        Formula.makeImp(
            Formula.makeOr(Formula.makePropVar(x),
                Formula.makeOr(Formula.makePropVar(y), Formula.makePropVar(z))),
             Formula.makeOr(
                Formula.makeOr(Formula.makePropVar(x), Formula.makePropVar(y)),
                Formula.makePropVar(z))),
        // (x \/ y \/ z) -> (z \/ y) \/ x
        Formula.makeImp(
            Formula.makeOr(Formula.makePropVar(x),
                Formula.makeOr(Formula.makePropVar(y), Formula.makePropVar(z))),
            Formula.makeOr(
                Formula.makeOr(Formula.makePropVar(z), Formula.makePropVar(y)),
                Formula.makePropVar(x))), 
    };
        
    public void init() {
        hyp = new Vector();
/*        Formula f = Box.genFormula(Resources.BUILD_OP,
                                   Resources.BUILD_VAR,
                                   4,
                                   10,
                                   200);
 **/

        Formula f = examples[rand.nextInt(examples.length)];
        main = new Tree(f, false);
        modifMain = true;
        modifHyp = false;
    }
    
    public void draw(Graphics2D g, Tree currentTree, Vector v) {
        main.draw(g, currentTree == main, v);
        Enumeration en = hyp.elements();
        Tree tmp;
        while (en.hasMoreElements()) {
            tmp = (Tree) en.nextElement();
            tmp.draw(g, currentTree == tmp, v);
        }
    }
    
    public void setMain(Tree tree) {
        main = tree;
        tree.father = null;
    }
    public Tree getMain() {
        return main;
    }
    public void addHyp(Tree tree) {
        hyp.add(tree);
        tree.father = null;
    }
    public void addHyp(Tree tree, int i) {
        hyp.add(i,tree);
        tree.father = null;
    }
    public void removeHyp(Tree tree) {
        hyp.remove(tree);
    }    
    public final boolean hasHyp() {
        return hyp.size() != 0;
    }
    public Tree inside(int x, int y, ModPoint p) {
        Tree t = main.inside(x, y, p);
        if (t != null) {
            return t;
        }
        Enumeration en = hyp.elements();
        Tree tmp;
        while (en.hasMoreElements()) {
            tmp = (Tree) en.nextElement();
            t = tmp.inside(x, y, p);
            if (t != null) {
                return t;
            }
        }
        return null;
    }
    public Tree findRoot(int x, int y) {
        if (main.getRectangle().contains(x, y)) {
            return main;
        }

        Enumeration en = hyp.elements();
        Tree tmp;
        boolean t;
        while (en.hasMoreElements()) {
            tmp = (Tree) en.nextElement();
            if (tmp.getRectangle().contains(x, y)) {
                return tmp;
            }
        }
        return null;
    }
    public Tree findHyp(Formula f) {
        Enumeration en = hyp.elements();
        Tree tmp;
        while (en.hasMoreElements()) {
            tmp = (Tree) en.nextElement();
            if (tmp.getConclusion().equals(f)) {
                return tmp;
            }
        }
        return null;
    }
    public boolean hasWon() {
        return (nHyps() == 0 && main.closed());
   }
    public int nHyps() {
        return hyp.size();
    }
    public Enumeration getHyps() {
        return hyp.elements();
    }
    public int getIndex(Tree tree) {
        return hyp.indexOf(tree);
    }
   
}
