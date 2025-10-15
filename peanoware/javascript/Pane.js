// Pane.js - Translation from Java
import Resources from './Resources.js';
import Point from './Point.js';
import ModPoint from './ModPoint.js';
import Tree from './Tree.js';
import Visible from './Visible.js';
import PaneListener from './PaneListener.js';

class Pane {
    static prawitz = null;
    static font = null;

    constructor(pair) {
        this.pair = pair;
        this.selectedFrom = null;
        this.modPointFrom = new ModPoint();
        this.selectedTo = null;
        this.modPointTo = new ModPoint();
        this.drag = null;
        this.currentTree = null;
        this.attachTree = null;
        this.attachVector = [];
        this.bravo = false;
        
        // Canvas setup (assuming canvas element is provided separately)
        this.canvas = null;
        this.ctx = null;
        this.minWidth = 400;
        this.minHeight = 250;
        
        // Create listener
        this.listener = new PaneListener(this, pair);
    }

    // Initialize canvas
    initCanvas(canvasElement) {
        this.canvas = canvasElement;
        this.ctx = canvasElement.getContext('2d');
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
         
        // Set minimum size
        this.canvas.width = Math.max(this.minWidth, this.canvas.width);
        this.canvas.height = Math.max(this.minHeight, this.canvas.height);
        
        // Add event listeners
        this.canvas.addEventListener('mousedown', (e) => this.listener.handleMouseDown(e));
        this.canvas.addEventListener('mousemove', (e) => this.listener.handleMouseMove(e));
        this.canvas.addEventListener('mouseup', (e) => this.listener.handleMouseUp(e));
        this.canvas.addEventListener('click', (e) => this.listener.handleClick(e));
        
        // Component resize listener
        window.addEventListener('resize', () => this.listener.handleResize());
    }

    setSelectFrom(f, p) {
        this.selectedFrom = f;
        this.modPointFrom.setM(p);
        this.selectedTo = null;
        this.drag = null;
    }

    unSelectFrom() {
        this.selectedFrom = null;
        this.selectedTo = null;
        this.drag = null;
    }

    getSelectFrom() {
        return this.selectedFrom;
    }

    setSelectTo(f, p) {
        if (this.selectedFrom !== null) {
            this.selectedTo = f;
            this.modPointTo.setM(p);
        }
    }

    unSelectTo() {
        this.selectedTo = null;
    }

    getSelectTo() {
        return this.selectedTo;
    }

    setDragPoint(x, y) {
        if (this.drag === null) {
            this.drag = new Point(x, y);
            return;
        }
        this.drag.x = x;
        this.drag.y = y;
    }

    getDragPoint() {
        return this.drag;
    }

    setCurrentTree(tree) {
        if (this.currentTree !== tree) {
            this.currentTree = tree;
            this.repaint();
        }
    }

    isUp(tree) {
        let root = tree.getRoot();
        if (root === this.pair.getMain()) {
            return true;
        }
        while (root.getArity() !== 0) {
            if (root === tree) {
                return false;
            }
            root = root.get(0);
        }
        return root !== this.selectedFrom;
    }

    /** Process the request of build **/
    commitMerge() {
        if (this.selectedFrom === null) {
            return;
        }
        if (this.drag !== null && this.selectedTo !== this.selectedFrom) {
            // The user is trying to link two objects
            if (!this.attachVector.includes(this.selectedTo)) {
                alert(Resources.ERROR_ATTACH);
                return;
            }
            this.commitAttach(this.selectedFrom, this.selectedTo);
            return;
        }
        if (this.selectedFrom.isClosedLeaf() && this.selectedFrom.getFather() === null) {
            if (!this.isInContext(this.selectedFrom.getConclusion())) {
                this.pair.removeHyp(this.selectedFrom);
                this.repaint();
                return;
            }
        }
        if (this.isUp(this.selectedFrom)) {
            /** The user is trying to develop an open leaf **/
            this.commitMergeUp();
            return;
        }
        /** The user is trying to develop a conclusion (elimination rule) **/
        const f = this.selectedFrom.getConclusion();
        const father = this.selectedFrom.getFather();
        if (f.isAnd()) {
            if (father === null) {
                this.doModifTT(this.selectedFrom, this.selectedFrom.makeAndE(Tree.LEFT));
                return;
            }
            if (father.isAndE(Tree.RIGHT)) {
                this.doModifTT(this.selectedFrom.getRoot(), this.selectedFrom);
                return;
            }
            if (father.isAndE(Tree.LEFT)) {
                this.doModifTT(this.selectedFrom.getRoot(), 
                           this.selectedFrom.makeAndE(Tree.RIGHT));
                return;
            }
            return;
        }
        if (father !== null) {
            this.doModifTT(this.selectedFrom.getRoot(), this.selectedFrom);
            return;
        }
        if (f.isImp()) {
            this.doModifTT(this.selectedFrom, this.selectedFrom.makeImpE());
            return;
        }
        if (f.isNeg()) {
            this.doModifTT(this.selectedFrom, this.selectedFrom.makeNegE());
            return;
        }
        if (this.attachVector.length === 1) {
            /** There is nothing else to do that try to attach it with 
                the unique point of attachment 
             **/
            this.commitAttach(this.attachVector[0], this.selectedFrom);
        }
    }

    /** Perform an attachment **/
    commitAttach(tree1, tree2) {
        let up, down;
        if (tree2.getFather() === null) {
            up = tree2;
            down = tree1;
        } else {
            up = tree1;
            down = tree2;
        }
        if (up.getConclusion().equals(down.getConclusion())) {
            this.doModifTTT(down, up, up);
            return;
        }
        if (up.getConclusion().isFalse()) {
            this.doModifTTT(down, up.makeFalseE(down.getConclusion()), up);
            return;
        }
        if (up.getConclusion().isOr()) {
            this.doModifTTT(down, up.makeOrE(down.getConclusion()), up);
        }
    }

    /** Add a new rule on an open conclusion **/
    commitMergeUp() {
        const sel = this.selectedFrom;
        if (this.modPointFrom.getMod() === 0) {
            if (sel.isClosedLeaf()) {
                return;
            }
            /* We are fully selecting a conclusion **/
            const f = sel.getConclusion();
            if (f.isOr()) {
                if (sel.getArity() === 0) {
                    this.doModifTT(sel, sel.makeOrI(f, Tree.LEFT));
                    return;
                }
                if (sel.isOrI(Tree.RIGHT)) {
                    this.doModifTT(sel, sel.makeOpenLeaf(f));
                    return;
                }
                if (sel.isOrI(Tree.LEFT)) {
                    this.doModifTT(sel, sel.makeOrI(f, Tree.RIGHT));
                    return;
                }
                this.doModifTT(sel, sel.makeOpenLeaf(f));
                return;
            }
            /** If the selected rule has sons, cut them! **/
            if (sel.getArity() !== 0) {
                this.doModifTT(sel, sel.makeOpenLeaf(f));
                return;
            }

            if (f.isAnd()) {
                this.doModifTT(sel, sel.makeAndI(f));
                return;
            }
            if (f.isImp()) {
                this.doModifTT(sel, sel.makeImpI(f));
                this.repaint();
            }
            if (f.isNeg()) {
                this.doModifTT(sel, sel.makeNegI(f));
                return;
            }
            /** If there is nothing else to do and there is only one possible
             *  attachment, do it! 
             **/
            if (this.attachVector.length === 1) {
                this.commitAttach(this.attachVector[0], sel);
            }
            return;
        }
        /** The user has selected an assumption in a tree **/
        const f = sel.getConclusion().get(this.modPointFrom.getMod() - 1);
        const tree = this.pair.findHyp(f);
        /** If the assumption is already present in the board as a standalone
         *  hypothesis, cancel this assumption
         **/
        if (tree !== null && tree.isClosedLeaf()) {
            this.doModifTb(tree, false);
            this.repaint();
            return;
        }
        /** Otherwise create a copy of the assumption and make it a standalone one **/
        this.doModifT(new Tree(f, true, this.ctx));
    }

    /** Activate the proof board */
    setActive() {
        this.bravo = false;
        this.repaint();
    }

    /** Deactivate the proof board */
    setInactive() {
        this.bravo = true;
        this.repaint();
    }

    /** Put a new formula **/
    init(ctx) {
        this.pair.init(ctx);
        this.centerMainTree();
    }

    /** Check if we have reached the result **/
    checkWin() {
        if (this.pair.hasWon()) {
            setTimeout(() => {
                this.setInactive();
            }, 500);
        }
    }

    /** Load the image of Prawitz **/
    loadPrawitz() {
        Pane.font = '28px italic serif';
        Pane.prawitz = new Image();
        Pane.prawitz.src = Resources.PRAWITZ_IMAGE;
        // Image will load asynchronously
        Pane.prawitz.onload = () => {
            if (this.bravo) {
                this.repaint();
            }
        };
    }

    getMainTree() {
        return this.pair.getMain();
    }

    getMinimumSize() {
        const tree = this.getMainTree();
        const size = tree.getSize();
        const minx = Math.max(400, size.width);
        const miny = Math.max(250, size.height);
        return { width: minx, height: miny };
    }

    centerMainTree() {
        const tree = this.getMainTree();
        const size = tree.getSize();
        const canvasWidth = this.canvas ? this.canvas.width : 800;
        const canvasHeight = this.canvas ? this.canvas.height : 600;
        tree.setOrigin(
            Math.floor((canvasWidth - size.width) / 2),
            Math.floor(canvasHeight - size.height) - 20
        );
    }

    // Compute the possible attach points
    setAttach(tree) {
        if ((this.attachTree == null) && (tree != null))
        if (this.attachTree === tree) {
            return;
        }
        this.attachTree = tree;
        this.attachVector = [];
        if (tree === null) {
            return;
        }
        if (tree.isOpenLeaf()) {
            const isMain = tree.getRoot() === this.pair.getMain();
            const hyps = this.pair.getHyps();
            const root = tree.getRoot();
            const ctx = [];
            const hctx = [];
            tree.getContext(ctx);

            for (const tmp of hyps) {
                if (tmp === root) {
                    continue;
                }
                if (!tmp.getConclusion().equals(tree.getConclusion())) {
                    if (!(tmp.getConclusion().isOr() || tmp.getConclusion().isFalse())) {
                        continue;
                    }
                }
                if (isMain) {
                    hctx.length = 0;
                    tmp.getHyps(hctx);
                    if (Pane.containsAll(ctx, hctx)) {
                        this.attachVector.push(tmp);
                    }
                } else {
                    this.attachVector.push(tmp);
                }
            }
            this.repaint();
            return;
        }
        if (tree.isConclusion() && tree !== this.pair.getMain()) {
            const ctx = [];
            tree.getHyps(ctx);
            Pane.processHyps(this.pair.getMain(), tree.getConclusion(), this.attachVector, ctx);
            const hyps = this.pair.getHyps();
            for (const tmp of hyps) {
                if (tmp !== tree) {
                    Pane.processHypsSimple(tmp, tree.getConclusion(), this.attachVector);
                }
            }
            this.repaint();
            return;
        }
        this.repaint();
    }

    // Helper method for containsAll
    static containsAll(v1, v2) {
        return v2.every(item1 => 
            v1.some(item2 => item1.equals(item2)));
    }
    
 
    /* Check all the possibility for attachment */
    static processHypsSimple(tree, f, res) {
        const hctx = [];
        tree.getOpenLeaves(hctx);
        for (const tmp of hctx) {
            if (!tmp.getConclusion().equals(f)) {
                if (!(f.isOr() || f.isFalse())) {
                    continue;
                }
            }
            res.push(tmp);
        }
    }

    /* Check all the possibility for attachment */
    static processHyps(tree, f, res, ctx) {
        const hctx = [];
        tree.getOpenLeaves(hctx);
        const tmpCtx = [];
        for (const tmp of hctx) {
            if (!tmp.getConclusion().equals(f)) {
                if (!(f.isOr() || f.isFalse())) {
                    continue;
                }
            }
            tmpCtx.length = 0;
            tmp.getContext(tmpCtx);
            if (Pane.containsAll(tmpCtx, ctx)) {
                res.push(tmp);
            }
        }
    }

    /* Check all the possibility for attachment */
    isInContext(f) {
        if (this.pair.getMain().isInContext(f)) {
            return true;
        }
        const hyps = this.pair.getHyps();
        for (const tmp of hyps) {
            if (tmp.isInContext(f)) {
                return true;
            }
        }
        return false;
    }
    /** Remove a stand-alone assumption **/
    doModifTb(tree, b) {
        if (b) {
            // Add
            this.pair.addHyp(tree);
            if (!this.redraw()) {
                this.pair.removeHyp(tree);
            }
            return;
        }
        // Remove
        this.pair.removeHyp(tree);
        this.repaint();
        this.checkWin();
        return;
    }
    doModifT(tree) {
        this.doModifTb(tree, true);
    }
    doModifTT(from, to) {
        this.doModifTTT(from, to, null);
    }

    /** Remove a stand-alone assumption **/
    doModifTTT(from, to, del) {
        const locFrom = new Point(from.getOrigin().getX(),from.getOrigin().getY());
        const locDel = new Point(0, 0);
        let changeMain = false;
        let addOrElim = false;
        let indexFrom = 0;
        let indexDel = 0;

        if (del !== null) {
            locDel.copy(del.getOrigin());
            indexDel = this.pair.getIndex(del);
            this.pair.removeHyp(del);
        }

        to.setOrigin(locFrom.x, locFrom.y);
        const father = from.getFather();
 
        if (from === this.pair.getMain()) {
            // we change the main tree
            this.pair.setMain(to);
            changeMain = true;
        } else if ((from.father === to.father) ||
                   (from.getRoot() !== this.pair.getMain() &&
                    from.getRoot() === to.getRoot())) {
            // We are in the case where we have added or removed an elimination rule
            indexFrom = this.pair.getIndex(from);
            this.pair.removeHyp(from);
            this.pair.addHyp(to, indexFrom);
            addOrElim = true;
        } else {
            // we add a new tree to an open leaf
            father.replace(from, to);
        }

        if (this.redraw()) {
            // Everything went fine, we can check if it is a win
            this.checkWin();
            return;
        }

        // Something went wrong, we have to undo the change
        from.setOrigin(locFrom.x, locFrom.y);
        if (changeMain) {
            this.pair.setMain(from);
        } else if (addOrElim) {
            this.pair.removeHyp(to);
            this.pair.addHyp(from, indexFrom);
        } else {
            father.replace(to, from);
        }

        if (del !== null) {
            del.setOrigin(locDel.x, locDel.y);
            this.pair.addHyp(del, indexDel);
        }
    }

    /** Recompute the layout **/
    redraw() {
        const tree = this.getMainTree();
        const size = { 
            width: this.canvas ? this.canvas.width : 800, 
            height: this.canvas ? this.canvas.height : 600 
        };
        const vis = new Visible(size);
        const mainRec = vis.bestChoice(tree.getSize());

        if (mainRec === null) {
            console.alert(Resources.ERROR_SPACE);
            return false;
        }

        mainRec.x = Math.floor((size.width - tree.getSize().width) / 2);
        mainRec.y = Math.floor(size.height - tree.getSize().height) - 20;
        vis.remove(mainRec);

        const hyps = this.pair.getHyps();
        const recs = [];
        const hypArray = Array.from(hyps);

        for (const tmp of hypArray) {
            const rec = vis.bestChoice(tmp.getSize());
            if (rec === null) {
                console.alert(Resources.ERROR_SPACE);
                return false;
            }
            recs.push(rec);
            vis.remove(rec);
        }
        this.getMainTree().update(mainRec);
        for (let i = 0; i < recs.length; i++) {
            hypArray[i].update(recs[i]);
        }

        this.repaint();
        return true;
    }

    repaint() {
        if (!this.canvas || !this.ctx) return;
        this.paintComponent(this.ctx);
    }

    paintComponent(g) {
        // Clear 
        g.clearRect(0, 0, this.canvas.width, this.canvas.height);
        g.strokeStyle = 'pink';
        g.lineWidth = 1;
        g.strokeRect(0, 0, this.canvas.width, this.canvas.height);
        if (this.bravo) {
            if (Pane.prawitz === null) {
                this.loadPrawitz();
            }
            g.fillStyle = '#D3D3D3'; // LIGHT_GRAY
            g.fillRect(0, 0, this.canvas.width, this.canvas.height);
            
            if (Pane.prawitz && Pane.prawitz.complete) {
                g.drawImage(
                    Pane.prawitz,
                    this.canvas.width - Pane.prawitz.width,
                    this.canvas.height - Pane.prawitz.height
                );
                g.font = Pane.font || '28px italic serif';
                g.fillStyle = '#000000';
                g.fillText(
                    Resources.BRAVO,
                    this.canvas.width - (5 * Pane.prawitz.width / 3),
                    this.canvas.height - (Pane.prawitz.height / 2)
                );
            }
            return;
        }

        if (this.selectedFrom !== null) {
            if (this.selectedTo !== null && (this.selectedFrom != this.selectedFrom)) {
                this.selectedFrom.drawArct(
                    g,
                    this.modPointFrom,
                    this.selectedTo,
                    this.modPointTo,
                    Resources.ARC
                );
            } else if (this.drag !== null) {
                this.selectedFrom.drawArc(
                    g,
                    this.modPointFrom,
                    this.drag,
                    Resources.ARC
                );
            }
        }

        this.pair.draw(g, this.currentTree, this.attachVector);

        if (this.selectedFrom !== null) {
            g.save();
            g.translate(this.modPointFrom.getX(), this.modPointFrom.getY());
            this.selectedFrom.drawConclusion(g, this.modPointFrom.getMod());
            g.translate(-this.modPointFrom.getX(), -this.modPointFrom.getY());
            g.restore();
        }
    }
}

/*
// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Pane;
}
*/

export default Pane;
