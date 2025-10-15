/*
 * Applet.java
 *
 * Created on November 11, 2004, 2:29 PM
 */

package peanoware.nd;
import java.awt.BorderLayout;
import java.awt.event.WindowAdapter;
import java.awt.event.WindowEvent;
import javax.swing.JApplet;
import javax.swing.JLabel;
import peanoware.Resources;


/**
 *
 * @author  thery
 */
public class Applet extends JApplet {
  private Pane pane;

  public void init() {   
      Pair pair = new Pair();
      JLabel label = new JLabel(Resources.NULL_MESSAGE);
      label.setHorizontalAlignment(label.CENTER);
      label.setVerticalAlignment(label.CENTER);
      label.setForeground(Resources.MESSAGE_COLOR);
      label.setOpaque(true);
      pane = new Pane(pair, label);
      pane.setActive();
      Header header = new Header(pane);
      getContentPane().setBackground(Resources.BACKGROUND);
      getContentPane().add(pane, BorderLayout.CENTER);
      getContentPane().add(label, BorderLayout.NORTH);
      getContentPane().add(header, BorderLayout.SOUTH);
      
  }
}
 