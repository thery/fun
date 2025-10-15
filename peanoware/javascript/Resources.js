/**
 * Resources.js
 *
 * Translated from Java (Created on 7 ottobre 2004, 1.40)
 * Original author: monica
 */

import Rectangle from './Rectangle.js'

const Resources = {
  // String constants
  AND: "And",
  OR: "Or",
  IMP: "Imp",
  NEG: "Neg",
  FORALL: "Forall",
  EXISTS: "Exist",
  APPLY: "Apply",
  QUANT_SEP: ".",
  
  // Color constants (using CSS color strings)
  HYP: "rgb(0, 0, 700)", // Blue
  FROM: "rgb(0, 0, 255)", // Blue
  TO: "rgb(255, 0, 0)", // Red
  ARC: "rgb(0, 163, 0)",
  
  // Array constants
  BUILD_OP: ["And", "Or", "Imp", "Neg"],
  BUILD_PROP_VAR: ["A", "B", "C", "D"],
  BUILD_PRED_SYMBOL: ["P", "Q", "R", "S"],
  BUILD_PRED_ARITY: [1, 1, 2, 2],
  BUILD_VAR: ["x", "y", "z", "t"],
  
  // Font constant (CSS font string)
  FONT_FORMULA: "35px Serif",
  
  // Message constants
  CHALLENGE: "Challenge",
  NEXT: "Next",
  BRAVO: "Well done!!",
  PEANO_IMAGE: "peano2.png",
  PRAWITZ_IMAGE: "Dag.png",
  NULL_MESSAGE: " ",
  TYPES_ERROR: "Objects of wrong types",
  TYPE_ERROR: "Object of wrong type",
  ERROR_ARITY: "Only one item is allowed!",
  ERROR_ATTACH: "You can't perform this attachment",
  ERROR_SPLIT: "Only one item to dissolve!",
  ERROR_SPACE: "Can't make it. Resize the window please!",
  ERROR_COPY: "Only one item to copy!",
  ERROR_IMPOSSIBLE: "The formula requires this variable",
  ERROR_AND: "Only one active hypothesis is allowed",
  ERROR_TWO: "This operation requires two elements",
  
  // Command constants
  COPY: "Copy",
  SPLIT: "Dissolve",
  
  // Computed array
  get COMMAND() {
    return [this.COPY, this.SPLIT, this.AND, this.OR, this.IMP, this.NEG, this.FORALL, this.EXISTS, this.APPLY];
  },
  
  // Special characters
  FALSE: "\u22A5",
  BOX: "\u25A1",
  
  // Info array
  INFO: [null, null, " \u2227 ", " \u2228 ", " \u21d2 ", "\u00ac", "\u2200", "\u2203", ""],
  
  // Numeric arrays
  ARITY: [1, 1, 2, 2, 2, 1, 2, 2, 2],
  PREC: [1, 1, 30, 20, 10, 40, 7, 7, 60],
  PREC_LEFT: [1, 1, 29, 19, 9, 41, 8, 8, 60],
  PREC_RIGHT: [1, 1, 31, 21, 11, 40, 8, 8, 60],
  
  // More color constants
  BACKGROUND: "rgb(0, 0, 0)", // Black
  FOREGROUND: "rgb(255, 255, 255)", // White
  MESSAGE_COLOR: "rgb(255, 0, 0)", // Red
  BORDER_COLOR: "rgb(211, 211, 211)", // Light Gray
  HIGHLIGHT_COLOR: "rgb(0, 163, 0)",
  BOX_COLOR: "rgb(0, 163, 0)",
  
  // Boolean flags
  validTopDown: false,
  validBottomUp: true,
  
  // Methods
  getString(s) {
    const commands = this.COMMAND;
    for (let i = 0; i < commands.length; i++) {
      if (s === commands[i]) {
        return this.INFO[i];
      }
    }
    return null;
  },
  
  getCommand(s) {
    const commands = this.COMMAND;
    for (let i = 0; i < commands.length; i++) {
      if (s === this.INFO[i]) {
        return commands[i];
      }
    }
    return null;
  },
  
  getArity(s) {
    const commands = this.COMMAND;
    for (let i = 0; i < commands.length; i++) {
      if (s === commands[i]) {
        return this.ARITY[i];
      }
    }
    return -1;
  },
  
  getPrec(s) {
    const commands = this.COMMAND;
    for (let i = 0; i < commands.length; i++) {
      if (s === commands[i]) {
        return this.PREC[i];
      }
    }
    return 60;
  },
  
  getLeftPrec(s) {
    const commands = this.COMMAND;
    for (let i = 0; i < commands.length; i++) {
      if (s === commands[i]) {
        return this.PREC_LEFT[i];
      }
    }
    return 60;
  },
  
  getRightPrec(s) {
    const commands = this.COMMAND;
    for (let i = 0; i < commands.length; i++) {
      if (s === commands[i]) {
        return this.PREC_RIGHT[i];
      }
    }
    return 60;
  },
  getRectRange(text, font, ctx, start, stop) {
    const oldfont = ctx.font;
    ctx.font = font;
    const textBefore = text.slice(0, start);
    const textUpToChar = text.slice(0, start + stop);
    const charMetrics = ctx.measureText(textUpToChar);
    const beforeMetrics = ctx.measureText(textBefore);
    const charX = beforeMetrics.width; // X position of the third character
    const charWidth = charMetrics.width - charX;
    const charHeight = charMetrics.actualBoundingBoxAscent + charMetrics.actualBoundingBoxDescent;
    ctx.font = oldfont; 
    return new Rectangle(
        charX - charMetrics.actualBoundingBoxLeft,
        - charMetrics.actualBoundingBoxAscent,
        charWidth,
        charHeight);
  },
  getRect(text, font, ctx) {
    const oldfont = ctx.font;
    ctx.font = font;
    const fullMetrics = ctx.measureText(text);
    const fullWidth = fullMetrics.width;
    const fullHeight = fullMetrics.actualBoundingBoxAscent + fullMetrics.actualBoundingBoxDescent;
    ctx.font = oldfont; 
    return new Rectangle(
                - fullMetrics.actualBoundingBoxLeft,
                - fullMetrics.actualBoundingBoxAscent,
                fullWidth,
                fullHeight
            );
  }
};

// For ES6 module export (if needed)
export default Resources;

// For CommonJS export (if needed)
// module.exports = Resources;