package peanoware.nd;

import java.awt.event.KeyListener;
import java.awt.event.KeyEvent;
import java.awt.event.MouseAdapter;
import java.awt.event.MouseMotionListener;
import java.awt.event.MouseEvent;
import java.awt.event.MouseWheelListener;
import java.awt.event.MouseWheelEvent;
import java.awt.event.ComponentListener;
import java.awt.event.ComponentEvent;
import java.awt.Point;
import java.awt.Rectangle;
import java.util.Enumeration;


public class PaneListener extends MouseAdapter implements ComponentListener,
                                                          MouseMotionListener {
    private Pane bp;
    private Pair pair;
    private ModPoint p;
    private ModPoint dump;
    private Integer mod;
    public PaneListener(Pane bp, Pair pair) {
        super();
        this.pair = pair;
        this.bp = bp;
        p = new ModPoint();
        dump = new ModPoint();
    }    

    public void mousePressed(MouseEvent e) {
        p.set(0, 0, Tree.A_NONE);
        bp.setSelectFrom(pair.inside(e.getX(), e.getY(), p), p);
        bp.repaint();
    }
    
    public void mouseReleased(MouseEvent e) {
        bp.commitMerge();
        bp.unSelectFrom();
        bp.repaint();
    }
    
    
    public void mouseDragged(MouseEvent e) {
        p.set(0, 0, Tree.A_NONE);        
        bp.setSelectTo(pair.inside(e.getX(), e.getY(), p), p);
        bp.setDragPoint(e.getX(), e.getY());
        bp.repaint();
    }
    
    public void mouseEntered(MouseEvent e) {
        bp.requestFocus();
    }
    public void mouseMoved(MouseEvent e) {
        Tree tree = pair.findRoot(e.getX(), e.getY());
        bp.setCurrentTree(tree);
        tree = pair.inside(e.getX(), e.getY(), p);
        bp.setAttach(tree);
    }
 
    public void componentHidden(ComponentEvent e) {
    }    
    
    public void componentMoved(ComponentEvent e) {
    }
    
    public void componentResized(ComponentEvent e) {
        bp.centerMainTree();
        bp.repaint();
    }
    
    public void componentShown(java.awt.event.ComponentEvent e) {
    }
    
}
