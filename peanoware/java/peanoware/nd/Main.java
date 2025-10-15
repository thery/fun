package peanoware.nd;

import peanoware.Resources;
import peanoware.formula.Formula;
import javax.swing.JFrame;
import javax.swing.JPanel;
import javax.swing.JComponent;
import javax.swing.JLabel;
import java.awt.event.WindowAdapter;
import java.awt.event.WindowEvent;
import java.awt.BorderLayout;


public class Main extends JFrame {
    Pane pane;
    public Main() {
	setTitle("ProveIt");
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
 	addWindowListener(new WindowAdapter() {
		
		public void windowActivated(WindowEvent e) {
		    pane.requestFocusInWindow();
		}
	    });
    }
    private static void createAndShowGUI() {
        //Make sure we have nice window decorations.
        JFrame.setDefaultLookAndFeelDecorated(true);

        //Create and set up the window.
        JFrame frame = new Main();
        frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);

        //Display the window.
        frame.pack();
	frame.setSize(450,350);
        frame.setVisible(true);
    }


    public static void main(String[] a) {
	javax.swing.SwingUtilities.invokeLater(new Runnable() {
            public void run() {
                createAndShowGUI();
            }
        });
    }
}
