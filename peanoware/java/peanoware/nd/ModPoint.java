/*
 * ModPoint.java
 *
 * Created on 10 ottobre 2004, 0.50
 */

package peanoware.nd;

/**
 *
 * @author  monica
 */
public class ModPoint {
    int x;
    int y;
    int mod;
    
    /** Creates a new instance of ModPoint */
    public ModPoint() {
        x = 0;
        y = 0;
        mod = 0;
    }
    public void set(ModPoint p) {
        set(p.x, p.y, p.mod);
    }
    public void set(int x, int y, int mod) {
        this.x = x;
        this.y = y;
        this.mod = mod;
    }
    public void setX(int x) {
        this.x = x;
    }
    public int getX() {
        return x;
    }
    public void setY(int y) {
        this.y = y;
    }
    public int getY() {
        return y;
    }
    public void setMod(int mod) {
        this.mod = mod;
    }
    public int getMod() {
        return mod;
    }
    public void translate(int dx, int dy) {
        x += dx;
        y += dy;
    }
    
}
