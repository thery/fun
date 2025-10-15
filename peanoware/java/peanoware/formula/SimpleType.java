/*
 * SimpleType.java
 *
 * Created on November 18, 2004, 11:10 PM
 */

package peanoware.formula;

/**
 *
 * @author  thery
 */
public class SimpleType extends Type {
    public static String PROP = "Prop";
    public static String TERM = "Term";
    String type;
    
    /** Creates a new instance of SimpleType */
    public SimpleType(String type) {
        this.type = type;
    }
    
    public boolean isProp() {
        return PROP.equals(type);
    }
    
    public static SimpleType makeProp() {
        return new SimpleType(PROP);
    }

    public boolean isTerm() {
       return TERM.equals(type);
    }
  
    public static SimpleType makeTerm() {
        return new SimpleType(TERM);
    }
    public boolean equals(Object o) {
        return o instanceof SimpleType && type.equals((SimpleType) o);
    }

}
