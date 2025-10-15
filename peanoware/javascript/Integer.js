/**
 * Integer.js
 *
 * Created on 14 ottobre 2004, 4.51
 * Translated to JavaScript
 *
 * @author monica
 */

class Integer {
  /**
   * Creates a new instance of Integer
   * @param {number} i - Initial value (defaults to 0)
   */
  constructor(i = 0) {
    this.i = i;
  }

  /**
   * Get the current value
   * @returns {number}
   */
  get() {
    return this.i;
  }

  /**
   * Decrement the value by 1
   */
  decr() {
    this.i--;
  }

  /**
   * Check if the value is zero
   * @returns {boolean}
   */
  isNull() {
    return this.i === 0;
  }
}

// Export for use in modules (optional)
// export default Integer;
