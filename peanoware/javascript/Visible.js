
/**
 * Visible.js
 * 
 * Manages visible rectangular regions on a canvas/dimension
 * Ported from Java to JavaScript
 */
import Point from './Point.js';
import Rectangle from './Rectangle.js';

class Visible {
    static DELTA = 20;

    constructor(dim) {
        this.comp = [];
        this.tmp = [];
        this.comp.push(new Rectangle(
            0, 
            0, 
            dim.width, 
            dim.height
        ));
    }

    /**
     * Add a rectangle to the temporary collection
     */
    add(rec) {
        if (!rec.isEmpty()) {
            this.tmp.push(rec);
        }
    }

    /**
     * Remove a rectangle from the visible area
     */
    remove(rec) {
        // Expand the rectangle by DELTA on all sides
        rec = new Rectangle(
            rec.getX() - Visible.DELTA,
            rec.getY() - Visible.DELTA,
            rec.getWidth() + 2 * Visible.DELTA,
            rec.getHeight() + 2 * Visible.DELTA
        );

        this.tmp = [];

        for (const el of this.comp) {
            const inter = el.intersection(rec);
            
            if (inter.isEmpty()) {
                this.add(el);
                continue;
            }

            // Top rectangle
            this.add(new Rectangle(
                el.x,
                el.y,
                el.width,
                inter.y - el.y
            ));

            // Bottom rectangle
            this.add(new Rectangle(
                el.x,
                inter.y + inter.height,
                el.width,
                (el.y + el.height) - (inter.y + inter.height)
            ));

            // Left rectangle
            this.add(new Rectangle(
                el.x,
                el.y,
                inter.x - el.x,
                el.height
            ));

            // Right rectangle
            this.add(new Rectangle(
                inter.x + inter.width,
                el.y,
                el.width - (inter.width + inter.x - el.x),
                el.height
            ));
        }

        // Swap comp and tmp
        const tmp1 = this.comp;
        this.comp = this.tmp;
        this.tmp = tmp1;
    }

    /**
     * Check if there are no visible rectangles
     */
    isEmpty() {
        return this.comp.length === 0;
    }

    /**
     * Find the best position for a rectangle within visible areas
     */
    bestChoice(rec) {
        let best = null;

        for (const el of this.comp) {
            if (el.width < rec.width || el.height < rec.height) {
                continue;
            }

            // Compute mx
            let mx;
            if (rec.x < el.x) {
                mx = el.x;
            } else if ((el.x + el.width) < rec.x) {
                mx = el.x + el.width - rec.width;
            } else {
                mx = rec.x - Math.max(0, rec.width - (el.width - (rec.x - el.x)));
            }

            // Compute my
            let my;
            if (rec.y < el.y) {
                my = el.y;
            } else if ((el.y + el.height) < rec.height) {
                my = el.y + el.height - rec.height;
            } else {
                my = rec.y - Math.max(0, rec.height - (el.height - (rec.y - el.y)));
            }

            mx -= rec.x;
            my -= rec.y;

            if (best === null) {
                best = new Point(mx, my);
                continue;
            }

            if (mx * mx + my * my < best.x * best.x + best.y * best.y) {
                best = new Point(mx, my);
            }
        }

        if (best === null) {
            return null;
        }

        return new Rectangle(
            best.x + rec.x,
            best.y + rec.y,
            rec.width,
            rec.height
        );
    }
}

/*
// Export for use in Node.js or ES6 modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { Visible, Rectangle, Point, Dimension };
}
*/

export default Visible;
