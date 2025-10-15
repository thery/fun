/*
 * HeaderListener.java
 *
 * Created on 7 ottobre 2004, 17.56
 */

package peanoware.nd;

import peanoware.Resources;
import peanoware.formula.Formula;
import java.awt.Point;
import java.awt.event.ActionListener;
import java.awt.event.ActionEvent;
import java.awt.event.MouseMotionListener;
import java.awt.event.MouseEvent;
import java.awt.event.MouseListener;
import javax.swing.JTextField;
import javax.swing.text.Highlighter;
import javax.swing.text.DefaultHighlighter;
import javax.swing.text.DefaultHighlighter.DefaultHighlightPainter;


/**
 *
 * @author  monica
 */
public class HeaderListener implements ActionListener {
    
    Pane pane;
    
    
    /** Creates a new instance of HeaderListener */
    public HeaderListener(Pane pane) {
        this.pane = pane;    
    }
    
    public void actionPerformed(ActionEvent e) {
      pane.init();
      pane.setActive();
    }
    
}
