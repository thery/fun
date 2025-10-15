/*
 * Integer.java
 *
 * Created on 14 ottobre 2004, 4.51
 */

package peanoware.formula;

/**
 *
 * @author  monica
 */
public class Integer {
    int i;
    
    /** Creates a new instance of Integer */
    public Integer() {
        i = 0;
    }
    public Integer(int i) {
        this.i = i;
    }   
    public int get() {
        return i;
    }
    public void decr() {
        i--;
    }
    public boolean isNull() {
        return i == 0;
    }
}
