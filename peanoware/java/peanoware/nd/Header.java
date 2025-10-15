/*
 * Header.java
 *
 * Created on 7 ottobre 2004, 12.38
 */

package peanoware.nd;

import peanoware.Resources;
import peanoware.build.Box;
import peanoware.formula.Formula;
import java.awt.Point;
import java.awt.Dimension;
import java.awt.event.MouseMotionListener;
import java.awt.event.MouseListener;
import javax.swing.JPanel;
import javax.swing.JLabel;
import javax.swing.JButton;
import javax.swing.JTextField;
import javax.swing.BoxLayout;

/**
 *
 * @author  monica
 */
public class Header extends JPanel {
    Formula f;
    Point[] pt;
    
    
    /** Creates a new instance of Header */
    public Header(Pane pane) {
        setLayout(new BoxLayout(this, BoxLayout.PAGE_AXIS));
        JPanel jp = new JPanel();
        add(javax.swing.Box.createRigidArea(new Dimension(0,5)));
        add(jp);
        add(javax.swing.Box.createRigidArea(new Dimension(0,5)));
        jp.setLayout(new BoxLayout(jp, BoxLayout.LINE_AXIS));
        jp.add(javax.swing.Box.createRigidArea(new Dimension(20,0)));
        jp.add(javax.swing.Box.createRigidArea(new Dimension(15,0)));
        jp.add(javax.swing.Box.createRigidArea(new Dimension(20, 0)));
        JButton jb = new JButton(Resources.NEXT);
        HeaderListener ht = new HeaderListener(pane);
        jb.addActionListener(ht);
        jp.add(jb);
        jp.add(javax.swing.Box.createRigidArea(new Dimension(5, 0)));
    }
    public Formula getFormula() {
        return f;
    }
    
    static Point emptyPoint = new Point(0,0);
    public Point getPoint(int i) {
        if (i < pt.length) {
            return pt[i];
        }
        return emptyPoint;
    }
    
}
