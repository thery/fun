package peanoware.nd;

import peanoware.Resources;
import peanoware.geometry.Visible;
import peanoware.formula.Formula;
import java.util.Vector;
import java.util.Enumeration;
import java.awt.BorderLayout;
import java.awt.Graphics;
import java.awt.Graphics2D;
import java.awt.Dimension;
import java.awt.Color;
import java.awt.Point;
import java.awt.Rectangle; 
import java.awt.Image;
import java.awt.Font;
import java.awt.Toolkit;
import java.awt.MediaTracker;
import javax.swing.ButtonGroup;
import javax.swing.JLabel;
import javax.swing.JComponent;

public class Pane extends JComponent {   
    Pair pair;
    Tree selectedFrom;
    ModPoint modPointFrom;
    Tree selectedTo;
    ModPoint modPointTo;
    Point drag;
    PaneListener bpl;
    JLabel lb;
    Tree currentTree;
    Tree attachTree;
    Vector attachVector;
    static Image prawitz;
    static Font font;
    boolean bravo;
    
    public Pane(Pair pair, JLabel lb) {
 	this.pair = pair;
        this.lb = lb;
	setMinimumSize(new Dimension(400,250));
	setForeground(Resources.FOREGROUND);
	setFocusable(true);
	//setOpaque(true);
        bpl = new PaneListener(this, pair);
        addMouseListener(bpl);
        addMouseMotionListener(bpl);
        addComponentListener(bpl);
        modPointFrom = new ModPoint();
        modPointTo = new ModPoint();
        currentTree = null;
        attachTree = null;
        attachVector = new Vector();
    }
    public void setSelectFrom(Tree f, ModPoint p) {
        //System.out.println("sel " + f);
        //System.out.println("Mod " + p.getMod());
        lb.setText(Resources.NULL_MESSAGE);
        selectedFrom = f;
        modPointFrom.set(p);
        selectedTo = null;
        drag = null;
    }
    public void unSelectFrom() {
        selectedFrom = null;
        selectedTo = null;
        drag = null;
    }
    public Tree getSelectFrom() {
        return selectedFrom;
    }
    
    public void setSelectTo(Tree f, ModPoint p) {
        lb.setText(Resources.NULL_MESSAGE);
        if (selectedFrom != null) {
            selectedTo = f;
            modPointTo.set(p);
        }
    }
    public void unSelectTo() {
        selectedTo = null;
    }
    public Tree getSelectTo() {
        return selectedTo;
    }
    public void setDragPoint(int x, int y) {
        if (drag == null) {
            drag = new Point(x, y);
            return;
        }
        drag.setLocation(x, y);
    }
    public Point getDragPoint() {
        return drag;
    }
    public void setCurrentTree(Tree tree) {
        if (currentTree != tree) {
            currentTree = tree;
            repaint();
        }
    }

    public boolean isUp(Tree tree) {
        Tree root = tree.getRoot();
        if (root == pair.getMain()) {
            return true;
        }
        while (root.getArity() != 0) {
            if (root == tree) {
                return false;
            }
            root = root.get(0);
        }
        return root != selectedFrom;
    }
    
    /** Process the request of build **/
    public void commitMerge() {
        //System.out.println("MERGE");
        //System.out.println(modPointFrom.getMod());
        if (selectedFrom == null) {
            return;
        }
        if (drag != null && selectedTo != selectedFrom) {
            // The user is trying to link two objects
            if (!attachVector.contains(selectedTo)) {
                lb.setText(Resources.ERROR_ATTACH);
                return;
            }
            commitAttach(selectedFrom, selectedTo);
            return;
        }
        if (selectedFrom.isClosedLeaf() && selectedFrom.getFather() == null) {
            if (!isInContext(selectedFrom.getConclusion())) {
                pair.removeHyp(selectedFrom);
                repaint();
                return;
            }
        }
        //System.out.println(isUp(selectedFrom));        
        if (isUp(selectedFrom)) {
            /** The user is trying to develop an open leaf **/
            commitMergeUp();
            return;
        }
        /** The user is trying to develop a conclusion (elimination rule) **/
        Formula f = selectedFrom.getConclusion();
        Tree father = selectedFrom.getFather();
        if (f.isAnd()) {
            if (father == null) {
                doModif(selectedFrom, selectedFrom.makeAndE(Tree.LEFT));
                return;
            }
            if (father.isAndE(Tree.RIGHT)) {
               doModif(selectedFrom.getRoot(), selectedFrom);
               return;
            }
            if (father.isAndE(Tree.LEFT)) {
               doModif(selectedFrom.getRoot(), 
                       selectedFrom.makeAndE(Tree.RIGHT));
               return;
            }       
            return;
        }
        if (father != null) {
                doModif(selectedFrom.getRoot(), selectedFrom);
                return;
        }
        if (f.isImp()) {        
            doModif(selectedFrom, selectedFrom.makeImpE());
            return;
        }
        if (f.isNeg()) {        
            doModif(selectedFrom, selectedFrom.makeNegE());
            return;
        }
        if (attachVector.size() == 1) {
            /** There is nothing else to do that try to attach it with 
                the unique point of attachment 
             **/
            commitAttach((Tree) attachVector.get(0), selectedFrom);
        }
        
    }
    /** Perform an attachment **/
    public void commitAttach(Tree tree1, Tree tree2) {
            Tree up, down;
            if (tree2.getFather() == null) {
                up = tree2;
                down = tree1;
            } else {
                up = tree1;
                down = tree2;
            }
            if (up.getConclusion().equals(down.getConclusion())) {
                doModif(down, up, up);
                return;
            }
            if (up.getConclusion().isFalse()) {
                doModif(down, up.makeFalseE(down.getConclusion()), up);
                return;
            }
            if (up.getConclusion().isOr()) {
                doModif(down, up.makeOrE(down.getConclusion()), up);
            }
                
            return;
    }
    /** Add a new rule on a open conclusion **/
    public void commitMergeUp() {
        if (modPointFrom.getMod() == 0) {
            if (selectedFrom.isClosedLeaf()) {
                return;
            }
            /* We are fully selecting a conclusion **/
            Formula f = selectedFrom.getConclusion();
            if (f.isOr()) {
                if (selectedFrom.getArity() == 0) {
                    doModif(selectedFrom, Tree.makeOrI(f, Tree.LEFT));
                    return;
                }
                if (selectedFrom.isOrI(Tree.RIGHT)) {
                    doModif(selectedFrom, Tree.makeOpenLeaf(f));
                    return;
                }
                if (selectedFrom.isOrI(Tree.LEFT)) {
                    doModif(selectedFrom, Tree.makeOrI(f, Tree.RIGHT));
                    return;
                }
                doModif(selectedFrom, Tree.makeOpenLeaf(f));
                return;
            }
            /** If the selected rule has sons, cut them ! **/
            if (selectedFrom.getArity() != 0) {
                doModif(selectedFrom, Tree.makeOpenLeaf(f));
                return;
            }

            if (f.isAnd()) {
                doModif(selectedFrom, Tree.makeAndI(f));
                return;
            }
            if (f.isImp()) {
                doModif(selectedFrom, Tree.makeImpI(f));
                repaint();
            }    
            if (f.isNeg()) {
                doModif(selectedFrom, Tree.makeNegI(f));
                return;
            } 
            /** If there is nothing else to do and there is only one possible
             *  attachment, do it! 
             **/
            if (attachVector.size() == 1) {
                commitAttach((Tree) attachVector.get(0), selectedFrom);
            }
            return;
        }
        /** The user has selected an assumption in a tree **/
        //System.out.println("Modif");
        //System.out.println(modPointFrom.getMod());
        Formula f = selectedFrom.getConclusion().get(modPointFrom.getMod() - 1);
        Tree tree = pair.findHyp(f);
        /** If the assumption is already present in the board as a standalore
         *  hypothesis, cancel this assumption
         **/
        if (tree != null && tree.isClosedLeaf()) {
            doModif(tree, false);
            repaint();
            return;
        }
        /** Otherwise create a copy of the assumption and make it a standalone one 
         **/
        doModif(new Tree(f, true, new Tree[]{}));
    }
    
    /** Activate the proof board */
    public void setActive() {
        bravo = false;
        repaint();
    }
    /** Desactivate the proof board */
    public void setInactive() {
        bravo = true;
        repaint();
    }
    /** Put a new formula **/
    public void init() {
        pair.init();
        centerMainTree();
    }
    /** Check if we have reached the result **/
    public void checkWin() {
        if (pair.hasWon()) {
               javax.swing.SwingUtilities.invokeLater(new Runnable() {
                    public void run() {
                      try {
                        Thread.sleep(500);
                      } catch (Exception e) {
                      }
                      setInactive();
                    }
                });            
        }
    }
    /** Load the image of Prawitz **/
    void loadPrawitz() {
        font = new Font("Serif", Font.ITALIC, 28);
        Toolkit toolkit = Toolkit.getDefaultToolkit();
        prawitz = toolkit.getImage(Resources.class.getResource(Resources.PRAWITZ_IMAGE));
        MediaTracker mediaTracker = new MediaTracker(this);
        mediaTracker.addImage(prawitz, 0);
        try {
            mediaTracker.waitForID(0);
        }
        catch (InterruptedException ie) {
            System.err.println(ie);
            System.exit(1);
        }
    }
    public Tree getMainTree() {
        return pair.getMain();
    }
    public Dimension getMinimumSize() {
        int minx = Math.max(400, (int) getMainTree().getSize().getWidth());
        int miny = Math.max(250, (int) getMainTree().getSize().getHeight());
        return new Dimension(minx, miny);
    }
    public void centerMainTree() {
        Tree tree = getMainTree();
        Rectangle size = tree.getSize();
        tree.setOrigin((int) ((getSize().getWidth() 
                                    - tree.getSize().getWidth()) / 2),
                         (int) (getSize().getHeight() 
                                    - tree.getSize().getHeight()) - 5);
     }  
    private void print(Vector v) {
        Enumeration en = v.elements();
        while (en.hasMoreElements()) {
            System.out.println(en.nextElement());
        }
    }
    // Compute the possible attach point 
    public void setAttach(Tree tree) {
        if (attachTree == tree) {
            return;
        }
        attachTree = tree;
        attachVector.removeAllElements();
        if (tree == null) {
            return;
        }
        if (tree.isOpenLeaf()) {
            boolean isMain = tree.getRoot() == pair.getMain();
            Enumeration en = pair.getHyps();
            Tree tmp, root = tree.getRoot();
            Vector ctx = new Vector();
            Vector hctx = new Vector();
            tree.getContext(ctx);
            //System.out.println("context");
            //print(ctx);
            String s;
            while (en.hasMoreElements()) {
                tmp = (Tree) en.nextElement();
                if (tmp == root) {
                    continue;
                }
                if (!tmp.getConclusion().equals(tree.getConclusion())) {
                    if (! (tmp.getConclusion().isOr()  
                           || tmp.getConclusion().isFalse())) {
                        continue;
                    }
                }
                if (isMain) {
                    hctx.removeAllElements();
                    tmp.getHyps(hctx);
                    //System.out.print("Hyps");
                    //print(hctx);
                    if (ctx.containsAll(hctx)) {
                        attachVector.add(tmp);
                    }
                } else {
                    attachVector.add(tmp);
                }
            }
            repaint();
            return;
        }               
        if (tree.isConclusion() && tree != pair.getMain()) {
            Vector ctx = new Vector();
            tree.getHyps(ctx);
            processHyps(pair.getMain(), tree.getConclusion(), attachVector, ctx);
            Enumeration en = pair.getHyps();
            Tree tmp;
            while (en.hasMoreElements()) {
                tmp = (Tree) en.nextElement();
//                processHyps(tmp, tree.getConclusion(), attachVector, ctx);
                if (tmp != tree) {
                  processHyps(tmp, tree.getConclusion(), attachVector); 
                }
            }
            repaint();
            return;
        }
        repaint();
    }
    /* Check all the possibility for attachment */
    private static void processHyps(Tree tree, Formula f, 
                                    Vector res) {
        Vector hctx = new Vector();
        tree.getOpenLeaves(hctx);
        Enumeration en = hctx.elements();
        Tree tmp;
        while (en.hasMoreElements()) {
            tmp = (Tree) en.nextElement();
            if (!tmp.getConclusion().equals(f)) {
                if (! (f.isOr() || f.isFalse())) {
                    continue;
                }
            }
            res.add(tmp);
        }
    }
    
    /* Check all the possibility for attachment */
    private static void processHyps(Tree tree, Formula f, 
                                    Vector res, Vector ctx) {
        Vector hctx = new Vector();
        tree.getOpenLeaves(hctx);
        Enumeration en = hctx.elements();
        Tree tmp;
        Vector tmpCtx = new Vector();
        while (en.hasMoreElements()) {
            tmp = (Tree) en.nextElement();
            if (!tmp.getConclusion().equals(f)) {
                if (! (f.isOr() || f.isFalse())) {
                    continue;
                }
            }
            tmpCtx.removeAllElements();
            tmp.getContext(tmpCtx);
            if (tmpCtx.containsAll(ctx)) {
                res.add(tmp);
            }
        }
    }
    /* Check all the possibility for attachment */
    private boolean isInContext(Formula f) {
        if (pair.getMain().isInContext(f)) {
            return true;
        }
        Enumeration en = pair.getHyps();
        Tree tmp;
        while (en.hasMoreElements()) {
            if (((Tree) en.nextElement()).isInContext(f)) {
                return true;
            }
        }
        return false;
    }
          
    /** Remove a stand-alone assumptiom **/
    void doModif(Tree tree, boolean b) {
        if (b) {
            // Add
            pair.addHyp(tree);
            if (!redraw()) {
                pair.removeHyp(tree);
            }
            return;
        }
        //Remove
        pair.removeHyp(tree);
        repaint();
        checkWin();
    }

    /** Remove a stand-alone assumptiom **/
    void doModif(Tree tree) {
        doModif(tree, true);
    }   
    /** Substitute **/
    void doModif(Tree from, Tree to) {
        doModif(from, to, null);
    }
    /** Perform a modification if it is not possible do nothing **/
    void doModif(Tree from, Tree to, Tree del) {          
        //System.out.println("MODIF");
        //System.out.println(from.getConclusion());
        //System.out.println(to.getConclusion());
        //System.out.println(del);
        Point locFrom = new Point(from.getOrigin()), locDel = new Point();
        boolean changeMain = false;
        boolean addOrElim = false;
        int indexFrom = 0, indexDel = 0;
        if (del != null) {
            locDel = new Point(del.getOrigin());
            indexDel = pair.getIndex(del);
            //System.out.println("Index del " + indexDel);
            pair.removeHyp(del);
        }
        to.setOrigin(locFrom);
        Tree father = from.getFather();
        if (from == pair.getMain()) {
            // we change the main tree
            pair.setMain(to);
            changeMain = true;            
        } else if ((from.father == to.father) 
                        || (from.getRoot() != pair.getMain()
                            && from.getRoot() == to.getRoot())) {
            // We are in the case where we have added or removed an elmination rule
            indexFrom = pair.getIndex(from);
            //System.out.println("Index from " + indexFrom);            
            pair.removeHyp(from);
            pair.addHyp(to, indexFrom);
            addOrElim = true;
        } else {
             // we add a new tree to an open leaf
            father.replace(from, to);
        }    
        if (redraw()) {
            // Everything when fine ww can check if it is a win
            checkWin();
            return;
        }
        // Something when wrong we have to undo the change
        from.setOrigin(locFrom);
        if (changeMain) {
            // we change the main tree
            pair.setMain(from);   
        } else if (addOrElim) {
            pair.removeHyp(to);
            pair.addHyp(from, indexFrom);
        } else if (changeMain) {
            // we change the main tree
            pair.setMain(from);   
        } else {
            // we add a new tree to an open leaf
            father.replace(to, from);
        }    
        if (del != null) {
            del.setOrigin(locDel);
            pair.addHyp(del,indexDel);
        }
    }
    
    /** Recompute the layout **/
    public boolean redraw() {     
        Tree tree = getMainTree();
        Visible vis = new Visible(getSize());
        Rectangle mainRec = vis.bestChoice(tree.getSize());
        if (mainRec == null) {
                lb.setText(Resources.ERROR_SPACE);
                return false;
        }
        mainRec.setLocation(
            (int) ((getSize().getWidth() - tree.getSize().getWidth()) / 2),
            (int) ((getSize().getHeight() - tree.getSize().getHeight()) - 5));
        
        vis.remove(mainRec);
        Enumeration en = pair.getHyps();
        Rectangle[] recs = new Rectangle[pair.nHyps()];
        Tree tmp;
        for (int i = 0; i < recs.length; i++) {
            tmp = (Tree) en.nextElement();
            recs[i] = vis.bestChoice(tmp.getSize());
            if (recs[i] == null) {
                lb.setText(Resources.ERROR_SPACE);
                return false;
            }
            vis.remove(recs[i]);
        }
        en = pair.getHyps(); 
        getMainTree().update(mainRec);
        for (int i = 0; i < recs.length; i++) {
            tmp = (Tree) en.nextElement();
            tmp.update(recs[i]);
        }
        repaint();
        return true;
    }
    public void paintComponent(Graphics g) {
        if (bravo) {
            if (prawitz == null) {
                loadPrawitz();
            }
            g.setColor(Color.LIGHT_GRAY);
            g.fillRect(0,0, (int) (getSize().getWidth()),
                            (int) (getSize().getHeight()));
            g.drawImage(prawitz, 
                        (int) (getSize().getWidth() - prawitz.getWidth(null)), 
                        (int) (getSize().getHeight() - prawitz.getHeight(null)),
                        null);
            g.setFont(font);
            g.setColor(Color.BLACK);
            g.drawString(Resources.BRAVO, 
                        (int) (getSize().getWidth() - (5 * prawitz.getWidth(null)/3)),
                        (int) (getSize().getHeight() - (prawitz.getHeight(null))/ 2));
            return;
        }
	Graphics2D g2 = (Graphics2D) g;
        if (selectedFrom != null) {
            if (selectedTo != null) {
                selectedFrom.drawArc(g2, modPointFrom, 
                                     selectedTo, modPointTo,
                                     Resources.ARC);
            } else if (drag != null) {
                selectedFrom.drawArc(g2, modPointFrom, 
                                     drag, Resources.ARC);
            }
        }

	pair.draw(g2, currentTree, attachVector);
        if (selectedFrom != null) {           
            g2.translate(modPointFrom.getX(), modPointFrom.getY());
            selectedFrom.drawConclusion(g2, modPointFrom.getMod());
            g2.translate(- modPointFrom.getX(), - modPointFrom.getY());
        }
    }
}