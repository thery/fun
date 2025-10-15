// PaneListener.js - Translation from Java
import Point from './Point.js';
import ModPoint from './ModPoint.js';
import Tree from './Tree.js';

class PaneListener {
    constructor(pane, pair) {
        this.pane = pane;
        this.pair = pair;
        this.p = new ModPoint();
        this.dump = new ModPoint();
        this.mod = null;
        
        // Bind methods to maintain 'this' context
        this.handleMouseDown = this.handleMouseDown.bind(this);
        this.handleMouseUp = this.handleMouseUp.bind(this);
        this.handleMouseMove = this.handleMouseMove.bind(this);
        this.handleMouseDrag = this.handleMouseDrag.bind(this);
        this.handleMouseEnter = this.handleMouseEnter.bind(this);
        this.handleResize = this.handleResize.bind(this);
        
        // Track if mouse is pressed for drag handling
        this.isPressed = false;
    }

    // Get mouse coordinates relative to canvas
    getMousePos(canvas, evt) {
        const rect = canvas.getBoundingClientRect();
        return new Point(Math.floor(evt.clientX - rect.left),
                            Math.floor(evt.clientY - rect.top));
    }

    handleMouseDown(e) {
        if (this.pane.bravo) {
            this.pair.init(this.pane.ctx);
            this.pane.centerMainTree();
            this.pane.setActive();
            return;
        }
        this.isPressed = true;
        const pos = this.getMousePos(this.pane.canvas, e);
        this.p.set(0, 0, Tree.A_NONE);
        this.pane.setSelectFrom(this.pair.inside(pos.x, pos.y, this.p), this.p);
        this.pane.repaint();
        
        // Prevent default to avoid text selection during drag
        e.preventDefault();
    }

    handleMouseUp(e) {
        if (!this.isPressed) return;
        this.isPressed = false;
        
        this.pane.commitMerge();
        this.pane.unSelectFrom();
        this.pane.repaint();
    }

    handleMouseMove(e) {
        const pos = this.getMousePos(this.pane.canvas, e);
        
        if (this.isPressed) {
            // Mouse is being dragged
            this.handleMouseDrag(e);
        } else {
            // Mouse is just moving
            const tree = this.pair.findRoot(pos.x, pos.y);
            this.pane.setCurrentTree(tree);
            const foundTree = this.pair.inside(pos.x, pos.y, this.p);
            this.pane.setAttach(foundTree);
        }
    }

    handleMouseDrag(e) {
        const pos = this.getMousePos(this.pane.canvas, e);
        this.p.set(0, 0, Tree.A_NONE);
        this.pane.setSelectTo(this.pair.inside(pos.x, pos.y, this.p), this.p);
        this.pane.setDragPoint(pos.x, pos.y);
        this.pane.repaint();
    }

    handleMouseEnter(e) {
        // Request focus equivalent - ensure canvas can receive keyboard events
        if (this.pane.canvas) {
            this.pane.canvas.focus();
        }
    }

    handleClick(e) {
        // Handle click events if needed
        // Currently not used in original Java code
    }

    // Component event handlers
    handleResize() {
        if (this.pane.canvas) {
            this.pane.canvas.width = window.innerWidth;
            this.pane.canvas.height = window.innerHeight;
            this.pane.centerMainTree();
            this.pane.repaint();
        }
    }

    handleComponentHidden() {
        // Not used in original
    }

    handleComponentMoved() {
        // Not used in original
    }

    handleComponentShown() {
        // Not used in original
    }

    // Helper method to attach all listeners to a canvas element
    attachListeners(canvas) {
        canvas.addEventListener('mousedown', this.handleMouseDown);
        canvas.addEventListener('mouseup', this.handleMouseUp);
        canvas.addEventListener('mousemove', this.handleMouseMove);
        canvas.addEventListener('mouseenter', this.handleMouseEnter);
        
        // Add touch support for mobile devices
        canvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
            const touch = e.touches[0];
            const mouseEvent = new MouseEvent('mousedown', {
                clientX: touch.clientX,
                clientY: touch.clientY
            });
            this.handleMouseDown(mouseEvent);
        });
        
        canvas.addEventListener('touchend', (e) => {
            e.preventDefault();
            const mouseEvent = new MouseEvent('mouseup', {
                clientX: e.changedTouches[0].clientX,
                clientY: e.changedTouches[0].clientY
            });
            this.handleMouseUp(mouseEvent);
        });
        
        canvas.addEventListener('touchmove', (e) => {
            e.preventDefault();
            const touch = e.touches[0];
            const mouseEvent = new MouseEvent('mousemove', {
                clientX: touch.clientX,
                clientY: touch.clientY
            });
            this.handleMouseMove(mouseEvent);
        });
        
        // Window resize listener
        window.addEventListener('resize', this.handleResize);
        
        // Also listen for canvas resize if using ResizeObserver
        if (typeof ResizeObserver !== 'undefined') {
            const resizeObserver = new ResizeObserver(() => {
                this.handleResize();
            });
            resizeObserver.observe(canvas);
        }
    }

    // Helper method to remove all listeners
    detachListeners(canvas) {
        canvas.removeEventListener('mousedown', this.handleMouseDown);
        canvas.removeEventListener('mouseup', this.handleMouseUp);
        canvas.removeEventListener('mousemove', this.handleMouseMove);
        canvas.removeEventListener('mouseenter', this.handleMouseEnter);
        
        window.removeEventListener('resize', this.handleResize);
    }
}

/*
// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PaneListener;
}
*/

export default PaneListener;