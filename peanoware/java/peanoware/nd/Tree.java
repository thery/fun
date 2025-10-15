package peanoware.nd;

import java.awt.font.TextLayout;
import java.awt.font.FontRenderContext;
import java.awt.Font;
import java.awt.Graphics2D;
import java.awt.geom.Rectangle2D;
import java.awt.Rectangle;
import java.awt.Color;
import java.awt.Point;
import java.awt.Rectangle;
import java.awt.Dimension;
import java.awt.Shape;

import peanoware.Resources;
import java.util.Random;
import java.util.Vector;
import peanoware.formula.Formula;
import peanoware.build.Box;

public class Tree {
    // Types of rule 
    public static final int OPEN = 0;
    public static final int CLOSE = 1;
    public static final int AND_INTRO = 2;
    public static final int OR_INTRO = 3;
    public static final int IMP_INTRO = 4;
    public static final int NEG_INTRO = 5;
    public static final int AND_ELIM = 6;
    public static final int OR_ELIM = 7;
    public static final int IMP_ELIM = 8;;
    public static final int NEG_ELIM = 9;
    
    public static final int A_NONE = 0;
    public static final int A_LEFT = 1;
    public static final int A_RIGHT = 2;
    public static final int A_LEFT_RIGHT = 3;
    public static final int DELTA_X = 15;
    public static final int DELTA_Y = 4;
    public static final int THICKNESS = 1;
    public static final boolean LEFT = false;
    public static final boolean RIGHT = true;
    public static final Rectangle empty = new Rectangle(0, 0, 0, 0);
    Rectangle[] shapes;
    int select;
    Point origin;
    Rectangle bar;
    Point conc;
    Rectangle size;
    Rectangle rec;
    boolean close;
    Tree[] trees;
    Tree father;
    TextLayout text;
    Formula f;
    Font font;
    FontRenderContext frc;
    public Tree(Formula f, boolean close, Tree[] trees) {
        rec = new Rectangle();
        shapes = new Rectangle[0];
        int select;
        origin = new Point(0, 0);
        bar = (Rectangle) empty.clone();
        conc = new Point(0, 0);
        size = (Rectangle) empty.clone();
        font = Resources.FONT_FORMULA;
        frc = new FontRenderContext(null, false, false);
        text = new TextLayout(f.toString(), font, frc);
        this.f = f;
        this.origin = origin;
        this.close = close;
        setSons(trees);
        father = null;
    }

    public void setSelect(int select) {
        this.select = select;
        if (select == A_LEFT) {
            shapes = new Rectangle[1];
            Formula f = getConclusion();
            String son = f.get(LEFT).toString();
            int i = f.toString().indexOf(son);
            Shape sh = text.getBlackBoxBounds(i, i + son.length());
            shapes[0] = sh.getBounds();
            shapes[0].grow(0, DELTA_Y - 2);
            return;
        }
        if (select == A_LEFT_RIGHT) {
            Formula f = getConclusion();
            Point[] pt = new Point[f.toString().length()];
            f.putIndex(0, pt, false);
            shapes = new Rectangle[2];
            String son = f.get(LEFT).toString();
            int i = f.maxPoint(0, pt).x;
            //System.out.println("i left= " + i);
            Shape sh = text.getBlackBoxBounds(i, i + son.length());
            shapes[0] = sh.getBounds();
            shapes[0].grow(0, DELTA_Y - 2);
            
            son = f.get(RIGHT).toString();
            i = f.maxPoint(pt.length - 1, pt).x;
            //System.out.println("i right= " + i);        

            sh = text.getBlackBoxBounds(i, i + son.length());
            shapes[1] = sh.getBounds();
            shapes[1].grow(0, DELTA_Y - 2);
            return;
        }
        shapes = new Rectangle[0];
    }
    public Tree get(int i) {
        return trees[i];
    }
    public Tree get(boolean b) {
        return trees[b == LEFT ? 0 : 1];
    }
    public int getArity() {
        return trees.length;
    }
        
    
    public int getSelect() {
        return select;
    }
    public void setFather(Tree father) {
        this.father = father;
    }
    public Tree getFather() {
        return father;
    }
    public Tree getRoot() {
        Tree res = this;
        while (res.father != null) {
            res = res.father;
        }
        return res;
    }
    public Tree(Formula f, boolean close) {
        this(f,  close, new Tree[0]);
    }
    public void setOrigin(int x, int y) {
        this.origin.x = x;
        this.origin.y = y;
    }
    public void setOrigin(Point origin) {
        this.origin.setLocation(origin);
    }
    public Point getOrigin() {
        return origin;
    }
    public int getWidth() {
        return (int) getSize().getWidth();
    }
    public int getBaseHeight() {
        update();
        return conc.y;
    }
    public int getMaxBaseHeight() {
        int res = 0;
        for (int i = 0; i < trees.length; i++) {
            res = Math.max(res, trees[i].getBaseHeight());
        }
        return res;
    }
    
    public int getWidth(boolean b) {
        if (b == LEFT) {
            return getWidth() - conc.x;
        }
        // just to be sure that modif
        update();
        return (int) (conc.x + text.getBounds().getWidth());
    }
    
    public int getHeight() {
        return (int)getSize().getHeight();
    }
    public int getBaseWidth() {
        switch (trees.length) {
            case 0:
                return 0;
            case 1:
                return (int) trees[0].getConclusionBounds().getWidth();
        }
        int res = trees[0].getWidth(LEFT)
        + trees[trees.length - 1].getWidth(RIGHT)
        + DELTA_X;
        for (int i = 1; i < trees.length - 1; i++) {
            res += trees[i].getWidth() + DELTA_X;
        }
        return res;
    }
    public void modify() {
        size.setBounds(empty);
        if (father != null) {
            father.modify();
        }
    }
    public Tree[] getSons() {
        return trees;
    }
    public void setSons(Tree[] sons) {
        trees = sons;
        for (int i = 0; i < trees.length; i++) {
            trees[i].setFather(this);
        }
        modify();
    }
    public void replace(Tree from, Tree to) {
        for (int i = 0; i < trees.length; i++) {
            if (trees[i] == from) {
                trees[i] = to;
                to.setFather(this);
            }
        }
        modify();
    }    
    public void update() {
        getSize();
    }
    
    public Rectangle getSize() {
        if (!empty.equals(size)) {
            return size;
        }
        size.setBounds(0, 0, 0, 0);
        // Take care of all width:
        // sumWidth the real width of all sons
        // baseWidth the real width minus the initial bit of the first
        //            son and the final bit of the last won
        // textWidth the width of the conclusion
        int sumWidth = 0;
        int baseWidth = getBaseWidth();
        int textWidth = (int) text.getBounds().getWidth();
        int maxWidth = Math.max(baseWidth, textWidth);
        int rx, ldelta, rb, rc;
        if (maxWidth == baseWidth) {
            rx = 0;
            ldelta = 0;
            rb = trees[0].getWidth() - trees[0].getWidth(LEFT);
            rc = rb + (baseWidth - textWidth) / 2;
        } else {
            ldelta = (textWidth - baseWidth)/ (trees.length + 1);
            int u = 0;
            if (trees.length != 0) {
                u = (trees[0].getWidth() - trees[0].getWidth(LEFT)) - ldelta;
            }
            if (u > 0) {
                rx = 0;
                rb = u;
                rc = u;
            } else {
                rx = -u;
                rb = 0;
                rc = 0;
            }
        }
        ldelta += DELTA_X;
        int maxBaseHeight = getMaxBaseHeight();
        // Now we can place all the subTrees
        Rectangle tmp = new Rectangle();
        for (int i = 0; i < trees.length; i++) {
            trees[i].setOrigin(rx, maxBaseHeight -trees[i].getBaseHeight());
            rx += trees[i].getWidth() + ldelta;
            tmp.setBounds(trees[i].getSize());
            tmp.translate(trees[i].getOrigin().x, trees[i].getOrigin().y);
            size.add(tmp);
        }
        // Now we can take care of the bar
        int ry = (int) size.getHeight() + DELTA_Y;
        bar.setBounds(rb, ry, maxWidth, THICKNESS);
        size.add(bar);
        // Finally the conclusion
        ry += THICKNESS + DELTA_Y - (int) text.getBounds().getY();
        conc.setLocation(rc, ry);
        size.add(new Rectangle(conc.x + (int) text.getBounds().getX(),
        conc.y + (int) text.getBounds().getY(),
        (int) text.getBounds().getWidth(),
        (int) text.getBounds().getHeight()));
        return size;
    }
    
    public void draw(Graphics2D g, boolean b, Vector v) {
        update();
        g.translate(origin.x, origin.y);
        if (b) {
            Color c1 = g.getColor();
            g.setColor(Resources.HYP);
            g.translate(conc.x, conc.y);
            for (int i = 0; i < shapes.length; i++) {
                g.fill3DRect(shapes[i].x, shapes[i].y,
                shapes[i].width, shapes[i].height, true);
            }
            g.translate(-conc.x, -conc.y);
            g.setColor(c1);
        }
        if (v.contains(this)) {
            Color c1 = g.getColor();
            g.setColor(Resources.TO);
            g.translate(conc.x, conc.y);
            Rectangle rec = getConclusionBounds();
            g.fill3DRect(rec.x, rec.y, rec.width, rec.height, true);
            g.translate(-conc.x, -conc.y);
            g.setColor(c1);
        }        
        text.draw(g, conc.x, conc.y);
        if (trees.length != 0 || close) {
            g.fillRect(bar.x, bar.y, bar.width, bar.height);
        }
        for (int i = 0; i < trees.length; i++) {
            trees[i].draw(g, b, v);
        }
        /*
        Color c1 = g.getColor();
        g.setColor(Color.PINK);
        g.drawRect((int) getSize().getX(),
                  (int) getSize().getY(),
                  (int) getSize().getWidth(),
                  (int) getSize().getHeight());
        g.setColor(c1);
         */
        g.translate(-origin.x, -origin.y);
    }
    public void drawConclusion(Graphics2D g, int mod) {
        update();
        g.translate(conc.x, conc.y);
        Rectangle sh;
        if (mod != 0) {
            sh = shapes[mod - 1];
        } else {
            sh = text.getBounds().getBounds();
        }
        Color c1 = g.getColor();
        //System.out.println(sh);
        g.setColor(Resources.TO);
        g.fill3DRect(sh.x, sh.y, sh.width, sh.height, true);
        g.fill(sh);
        g.setColor(c1);
        text.draw(g, 0, 0);
        g.translate(- conc.x, - conc.y);
    }
    public Tree inside(int x, int y, ModPoint p) {
        x = x - origin.x;
        y = y - origin.y;
        if (!getSize().contains(x, y)) {
            return null;
        }
        p.translate(origin.x, origin.y);
        Tree res;
        for (int i = 0; i < trees.length; i++) {
            res = trees[i].inside(x, y, p);
            if (res != null) {
                return res;
            }
        }
        boolean b;
        for (int i = 0; i < shapes.length; i++) {
            shapes[i].translate(conc.x, conc.y);
            b = shapes[i].contains(x, y);
            shapes[i].translate(-conc.x, -conc.y);
            if (b) {
                p.setMod(i + 1);
                break;
            }
        }
        if (bar.contains(x, y)
        || text.getBounds().contains(x - conc.x, y - conc.y)) {
            return this;
        }
        return null;
    }
    public Formula getConclusion() {
        return f;
    }
    public Formula[] getNextUp() {
        setSelect(A_NONE);
        if (trees.length == 1 && get(0).getConclusion().isFalse()) {
            return new Formula[0];
        }
        if (f.isAnd() && getArity() == 0) {
            return f.split();
        }
        if (f.isNeg() && getArity() == 0) {
            setSelect(A_LEFT);
            return new Formula[]{Formula.makeFalse()};
        }
        
        if (f.isImp() && getArity() == 0) {
            setSelect(A_LEFT);
            return new Formula[] {f.get(RIGHT)};
        }
        if (f.isOr()) {
            if (getArity()  != 0
            && get(0).getConclusion().equals(f.get(LEFT))) {
                if (get(0).getConclusion().equals(f.get(RIGHT))) {
                    return new Formula[]{Formula.makeFalse()};
                }
                return new Formula[] {f.get(RIGHT)};
            }
            if (getArity() == 0) {
                return new Formula[] {f.get(LEFT)};
            }
        }
        if (getConclusion().isFalse()) {
            return new Formula[0];
        }
        return new Formula[] {Formula.makeFalse()};
    }
    public boolean closed() {
        if (trees.length == 0) {
            return close;
        }
        for (int i = 0; i < trees.length; i++) {
            if (!(trees[i].closed())) {
                return false;
            }
        }
        return true;
    }
    public void update(Rectangle rec) {
        origin.setLocation(rec.x, rec.y);
    }
    public Rectangle getRectangle() {
        rec.setBounds(getSize());
        rec.translate(origin.x, origin.y);
        return rec;
    }
    public void drawArc(Graphics2D g, ModPoint p1, Tree f,ModPoint p2, Color c) {
        Rectangle b1 = getConclusionBounds(p1.getMod());
        Rectangle b2 = f.getConclusionBounds(p2.getMod());
        Color c1 = g.getColor();
        g.setColor(c);
        int x = conc.x + p1.getX();
        int y = conc.y + p1.getY();
        int fx = f.conc.x + p2.getX();
        int fy = f.conc.y + p2.getY();
        g.drawLine((int)(x + b1.getCenterX()), (int) (y + b1.getCenterY()),
        (int)(fx + b2.getCenterX()), (int) (fy + b2.getCenterY()));
        g.setColor(c1);
    }
    public void drawArc(Graphics2D g, ModPoint p1, Point p2, Color c) {
        Rectangle b1 = getConclusionBounds(p1.getMod());
        Color c1 = g.getColor();
        int x = conc.x + p1.getX();
        int y = conc.y + p1.getY();
        g.setColor(c);
        g.drawLine((int)(x + b1.getCenterX()), (int) (y + b1.getCenterY()),
        (int) p2.getX(), (int) p2.getY());
        g.setColor(c1);
    }
    Rectangle getConclusionBounds() {
        return text.getBounds().getBounds();
    }   
    Rectangle getConclusionBounds(int mod) {
        if (mod == 0) {
            return text.getBounds().getBounds();
        }
        return shapes[mod - 1];
    }
    void getContext(Vector ctx) {
        if (father == null) {
            return;
        }
        switch (father.trees.length) {
            case 3: {
            //it is a Or elim  
                Formula f = father.get(0).getConclusion();
                ctx.add(f.get(this == father.get(1) ? 0 : 1));  
                break;
            }
            case 2: {
                break;
            }
            case 1: {
                Formula f = father.getConclusion();
                if (f.isImp() || f.isNeg()) {
                    ctx.add(f.get(0));
                }
            }
        }
        father.getContext(ctx);
    }
    boolean isInContext(Formula f) {
        if (isImpI() || isNegI()) {
            if (getConclusion().get(LEFT).equals(f)) {
                return true;
            }
        }
        if (isOrE()) {
            if (get(0).getConclusion().get(LEFT).equals(f)) {
                return true;
            }
            if (get(0).getConclusion().get(RIGHT).equals(f)) {
                return true;
            }
        }
        for (int i = 0; i < getArity(); i++) {
            if (get(i).isInContext(f)) {
                return true;
            }
        }
        return false;
    }
   
    void getHyps(Vector res) {
        if (getArity() == 0) {
            if (close) {
                res.add(getConclusion());
            }
            return;
        }
        boolean forceCheck = false;
        if (isOrE()) {
            get(0).getHyps(res);
            if (res.contains(get(0).getConclusion().get(LEFT))) {
                get(1).getHyps(res);
            } else {
                get(1).getHyps(res);
                res.remove(get(0).getConclusion().get(LEFT));
            }
            if (res.contains(get(0).getConclusion().get(RIGHT))) {
                get(2).getHyps(res);
            } else {
                get(2).getHyps(res);
                res.remove(get(0).getConclusion().get(RIGHT));
            }
            return;
        }
        if (isImpI() || isNegI()) {
            if (res.contains(getConclusion().get(LEFT))) {
                get(0).getHyps(res);
            } else {
                get(0).getHyps(res);
                res.remove(getConclusion().get(LEFT));
            }
            return;
        }
        
        for (int i = 0; i < getArity(); i++) {
            get(i).getHyps(res);
        }
    }   
    void getOpenLeaves(Vector res) {
        if (trees.length == 0) {
          if (!close) {
              res.add(this);
          }
          return;
        }
        for (int i = 0; i < trees.length; i++) {
            trees[i].getOpenLeaves(res);
        }
    }
 
    
    boolean isConclusion() {
        return father == null;
    }
    public static Tree makeClosedLeaf(Formula f) {
        return new Tree(f, true);
    }
    public boolean isClosedLeaf() {
        return getArity() == 0 && close;
    }
    public static Tree makeOpenLeaf(Formula f) {
        return new Tree(f, false);
    }
    public boolean isOpenLeaf() {
        return getArity() == 0 && !close;
    }    
    public static Tree makeAndI(Formula f) {
        //System.out.println("makeAndI");
        Formula[] fs = f.split();
        return new Tree(f, false, 
                new Tree[] {
                        makeOpenLeaf(f.get(LEFT)),
                        makeOpenLeaf(f.get(RIGHT))});
    }
    public boolean isAndI() {
        return getConclusion().isAnd() 
               && getArity() == 2
               && getConclusion().get(LEFT).equals(get(LEFT).getConclusion())
               && getConclusion().get(RIGHT).equals(get(RIGHT).getConclusion());
    }
    public static Tree makeOrI(Formula f, boolean b) {
       //System.out.println("makeOrI");
        return new Tree(f, false,
                new Tree[] {
                        makeOpenLeaf(f.get(b))});
    }  
    public boolean isOrI() {
        return isOrI(LEFT) && isOrI(RIGHT);
    }
    public boolean isOrI(boolean b) {
        return getConclusion().isOr() 
               && getArity() == 1
               && getConclusion().get(b).equals(get(0).getConclusion());
    }
    public static Tree makeImpI(Formula f) {
         //System.out.println("makeImpI");
        Tree tree = new Tree(f, false, 
                new Tree[] {
                        makeOpenLeaf(f.get(RIGHT))});
        tree.setSelect(A_LEFT);
        return tree;
    }
    public boolean isImpI() {
        return getConclusion().isImp() 
               && getArity() == 1
               && getConclusion().get(RIGHT).equals(get(0).getConclusion());
    }
    public static Tree makeNegI(Formula f) {
               //System.out.println("makeNegI");

        Tree tree = new Tree(f, false, 
                new Tree[] {
                        makeOpenLeaf(Formula.makeFalse())});
        tree.setSelect(A_LEFT);
        return tree;
    }
    public boolean isNegI() {
        return getConclusion().isNeg() 
               && getArity() == 1
               && get(0).getConclusion().isFalse();
    }
    
    public Tree makeAndE(boolean b) {
               //System.out.println("makeAndE");

        return new Tree(getConclusion().get(b), false, 
                new Tree[] {this});
    }
    public boolean isAndE() {
        return isAndE(LEFT) || isAndE(RIGHT);
    }
    public boolean isAndE(boolean b) {
        return getArity() == 1
               && get(0).getConclusion().isAnd() 
               && getConclusion().equals(get(0).getConclusion().get(b));
    }
    public Tree makeOrE(Formula f) {
               //System.out.println("makeOrE");

        Tree t = new Tree(f, false,
                    new Tree[] {this, makeOpenLeaf(f), makeOpenLeaf(f)});
        t.get(0).setSelect(A_LEFT_RIGHT);
        return t;
    }  
    public boolean isOrE() {
        return getArity() == 3
               && get(0).getConclusion().isOr() 
               && getConclusion().equals(get(1).getConclusion())
               && getConclusion().equals(get(2).getConclusion());
    }
    public Tree makeImpE() {
               //System.out.println("makeImpE");

        return
          new Tree(getConclusion().get(RIGHT), false, 
                new Tree[] {
                        this,
                        makeOpenLeaf(getConclusion().get(LEFT))});
    }
    public boolean isImpE() {
        return getSons().length == 2
               && get(LEFT).getConclusion().isImp() 
               && getConclusion().equals(get(LEFT).getConclusion().get(RIGHT))
               && get(RIGHT).getConclusion().equals(get(LEFT).getConclusion().get(RIGHT));
    }
    public Tree makeNegE() {
               //System.out.println("makeNegE");

        Tree tree = new Tree(Formula.makeFalse(), false, 
                new Tree[] {
                        this,
                        makeOpenLeaf(getConclusion().get(0))});
        return tree;
    }
    public boolean isNegE() {
        return getArity() == 2 
               && getConclusion().isFalse()
               && get(LEFT).getConclusion().isNeg() 
               && get(LEFT).getConclusion().get(LEFT).equals(
                    get(RIGHT).getConclusion());
    }
    public Tree makeFalseE(Formula f) {
               //System.out.println("makFalseE");

        Tree tree = new Tree(f, false, new Tree[] {this});
        return tree;
    }
    public boolean isFalseE() {
        return getArity() == 1 
               && get(0).getConclusion().isFalse();
    }
}