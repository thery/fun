/*
 * Operator.java
 *
 * Created on 7 ottobre 2004, 1.40
 */

package peanoware;

import java.awt.Color;
import java.awt.Font;

/**
 *
 * @author  monica
 */
public class Resources {
    public static final String AND = "And";
    public static final String OR = "Or";
    public static final String IMP = "Imp";
    public static final String NEG = "Neg";
    public static final String FORALL = "Forall";
    public static final String EXISTS = "Exist";
    public static final String APPLY = "Apply";
    public static final String QUANT_SEP = ".";
    public static final Color HYP = Color.BLUE;
    public static final Color FROM = Color.BLUE;
    public static final Color TO = Color.RED;
    public static final Color ARC = new Color(0, 163, 0);
    public static final String[] BUILD_OP = {AND, OR, IMP, NEG};
    public static final String[] BUILD_PROP_VAR = {"A", "B", "C", "D"};
    public static final String[] BUILD_PRED_SYMBOL = {"P", "Q", "R", "S"};
    public static final int[] BUILD_PRED_ARITY = {1, 1, 2, 2};
    public static final String[] BUILD_VAR = {"x", "y", "z", "t"};
    public static final Font FONT_FORMULA = new Font("Serif", Font.PLAIN, 35);
    public static final String CHALLENGE = "Challenge";
    public static final String NEXT = "Next";
    public static final String BRAVO = "Well done!!";
    public static final String PEANO_IMAGE = "peano2.png";
    public static final String PRAWITZ_IMAGE = "Dag.png";
    public static final String NULL_MESSAGE = " ";
    public static final String TYPES_ERROR = "Objects of wrong types";
    public static final String TYPE_ERROR = "Object of wrong type";
    public static final String ERROR_ARITY = "Only one item is allowed!";
    public static final String ERROR_ATTACH = "You can't perform this attachment";
    public static final String ERROR_SPLIT = "Only one item to dissolve!";
    public static final String ERROR_SPACE = "Can't make it. Resize the window please!";
    public static final String ERROR_COPY ="Only one item to copy!";
    public static final String ERROR_IMPOSSIBLE ="The formula requires this variable";
    public static final String ERROR_AND ="Only one active hypothesis is allowed";
    public static final String ERROR_TWO = "This operation requires two elements";
    public static String COPY = "Copy";
    public static String SPLIT = "Dissolve";
    public static String[] COMMAND = {COPY, SPLIT, AND, OR, IMP, NEG, FORALL, EXISTS, APPLY};
    public static String FALSE = "\u22A5";
    public static String BOX = "\u25A1";
    public static String[] INFO = 
        { null, null, " \u2227 ", " \u2228 ", " \u21d2 ", "\u00ac", "\u2200", "\u2203", ""};
    public static int[] ARITY = {1, 1, 2, 2, 2, 1, 2, 2, 2};
    public static int[] PREC = {1, 1, 30, 20, 10, 40, 7, 7, 60};
    public static int[] PREC_LEFT = {1, 1, 29, 19, 9, 41, 8, 8, 60};
    public static int[] PREC_RIGHT = {1, 1, 31, 21, 11, 40, 8, 8, 60};
    public static Color BACKGROUND = Color.BLACK;
    public static Color FOREGROUND = Color.WHITE;
    public static Color MESSAGE_COLOR = Color.RED;
    public static Color BORDER_COLOR = Color.LIGHT_GRAY;
    public static Color HIGHLIGHT_COLOR = new Color(0, 163, 0);
    public static Color BOX_COLOR = new Color(0, 163, 0);
    public static boolean validTopDown = false;
    public static boolean validBottomUp = true;
    
    public static String getString(String s) {
        for (int i = 0; i < COMMAND.length; i++) {
            if (s.equals(COMMAND[i])) {
                return INFO[i];
            }
        }
        return null;
    }
    
    public static String getCommand(String s) {
        for (int i = 0; i < COMMAND.length; i++) {
            if (s.equals(INFO[i])) {
                return COMMAND[i];
            }
        }
        return null;
    }
    
    public static int getArity(String s) {
        for (int i = 0; i < COMMAND.length; i++) {
            if (s.equals(COMMAND[i])) {
                return ARITY[i];
            }
        }
        return -1;
    }
    public static int getPrec(String s) {
        for (int i = 0; i < COMMAND.length; i++) {
            if (s.equals(COMMAND[i])) {
                return PREC[i];
            }
        }
        return 60;
    }
    public static int getLeftPrec(String s) {
        for (int i = 0; i < COMMAND.length; i++) {
            if (s.equals(COMMAND[i])) {
                return PREC_LEFT[i];
            }
        }
        return 60;
    }
    public static int getRightPrec(String s) {
        for (int i = 0; i < COMMAND.length; i++) {
            if (s.equals(COMMAND[i])) {
                return PREC_RIGHT[i];
            }
        }
        return 60;
    }
}
