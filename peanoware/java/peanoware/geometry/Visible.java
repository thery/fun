/*
 * Visible.java
 *
 * Created on 6 ottobre 2004, 17.08
 */

package peanoware.geometry;

import java.util.Vector;
import java.util.Enumeration;
import java.awt.Rectangle;
import java.awt.Point;
import java.awt.Dimension;

/**
 *
 * @author  monica
 */
public class Visible {
    
    public static int DELTA = 20;
    private Vector comp;
    private Vector tmp;
    /** Creates a new instance of Visible */
    public Visible(Dimension dim) {
        comp = new Vector(0);
        tmp = new Vector(0);
        comp.add(new Rectangle(0, 0, 
                               (int) dim.getWidth(), 
                               (int) dim.getHeight()));
    }
    public void add(Rectangle rec) {
        //System.out.println("trying to add " + rec);
        if (!rec.isEmpty()) {
            tmp.add(rec);
        }
    }
    public void remove(Rectangle rec) {
        rec = new Rectangle((int) rec.getX() - DELTA,
                            (int) rec.getY() - DELTA,
                            (int) rec.getWidth() + 2 * DELTA,
                            (int) rec.getHeight() + 2* DELTA);
        //System.out.println("Before remove " + comp.size());
        //System.out.println(rec);
        Enumeration e = comp.elements();
        Rectangle el;
        Rectangle inter;
        tmp.removeAllElements();
        while (e.hasMoreElements()) {
            el = (Rectangle) e.nextElement();
            //System.out.println("Checking " + el);
            inter = el.intersection(rec);
            if (inter.isEmpty()) {
                add(el);
                continue;
            }
            add(new Rectangle(el.x, el.y, el.width, inter.y - el.y));
            add(new Rectangle(el.x, inter.y + inter.height, el.width, 
                              (el.y + el.height) - (inter.y + inter.height)));
            add(new Rectangle(el.x, el.y, inter.x - el.x, el.height));
            add(new Rectangle(inter.x + inter.width, el.y,
                              el.width - (inter.width + inter.x - el.x),
                              el.height));
        }
        Vector tmp1 = comp;
        comp = tmp;
        tmp = tmp1;
        //System.out.println("After remove " + comp.size());

    }
    public boolean isEmpty() {
        return comp.size() == 0;
    }
    public Rectangle bestChoice(Rectangle rec) {
        Enumeration e = comp.elements();
        Rectangle el, inter;
        Point best = null;
        int mx, my;
        while (e.hasMoreElements()) {
            el = (Rectangle) e.nextElement();
            if (el.width < rec.width || el.height < rec.height) {
                continue;
            }
            // Compute mx
            if (rec.x < el.x) {
                mx = el.x;
            } else if ((el.x + el.width) < rec.x) {
                mx = el.x + el.width - rec.width;
            } else {
                mx = rec.x 
                     - Math.max(0, rec.width - (el.width - (rec.x - el.x)));
            }
            // Compute my
            if (rec.y < el.y) {
                my = el.y;
            } else if ((el.y + el.height) < rec.height) {
                my = el.y + el.height - rec.height;
            } else {
                my = rec.y 
                     - Math.max(0, rec.height - (el.height - (rec.y - el.y)));
            }
            mx -= rec.x;
            my -= rec.y;
            if (best == null) {
                best = new Point(mx, my);
                continue;
            }
            if (mx * mx + my * my < best.x * best.x + best.y * best.y) {
                best = new Point(mx, my);
            }
        }
        if (best == null) {
            return null;
        }
        return new Rectangle(best.x + rec.x, best.y + rec.y, 
                             rec.width, rec.height);
    }
}
        
        

                              
 