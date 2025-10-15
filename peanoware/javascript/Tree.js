// Tree class for natural deduction proof visualization
import Resources from './Resources.js';
import Rectangle from './Rectangle.js';
import Formula from './Formula.js';
import Point from './Point.js';

class Tree {
  // Types of rule constants
  static OPEN = 0;
  static CLOSE = 1;
  static AND_INTRO = 2;
  static OR_INTRO = 3;
  static IMP_INTRO = 4;
  static NEG_INTRO = 5;
  static AND_ELIM = 6;
  static OR_ELIM = 7;
  static IMP_ELIM = 8;
  static NEG_ELIM = 9;
  
  static A_NONE = 0;
  static A_LEFT = 1;
  static A_RIGHT = 2;
  static A_LEFT_RIGHT = 3;
  static DELTA_X = 15;
  static DELTA_Y = 4;
  static THICKNESS = 1;
  static LEFT = false;
  static RIGHT = true;
  static empty = new Rectangle(0, 0, 0, 0);
  static getNewRect() {
    return new Rectangle(0, 0, 0, 0);
  }

  constructor(f, close,  ctx, trees = []) {
    this.rec =  Tree.getNewRect();
    this.shapes = [];
    this.select = 0;
    this.origin = new Point(0, 0)
    this.bar = Tree.getNewRect();
    this.conc = new Point (0, 0);
    this.size = Tree.getNewRect();
    this.close = close;
    this.trees = [];
    this.father = null;
    this.f = f;
    
    // Text handling - would need Canvas 2D context or similar
    this.ctx = ctx;
    this.font = Resources.FONT_FORMULA;
    this.text = Resources.getRect(this.f.toString(), this.font, ctx);
    this.setSons(trees);
  }

  setSelect(select) {
    this.select = select;
    if (select === Tree.A_LEFT) {
      this.shapes = [Tree.getNewRect()];
      const f = this.getConclusion();
      const son = f.getb(Tree.LEFT).toString();
      const i = f.toString().indexOf(son);
      this.shapes[0] = 
        Resources.getRectRange(f.toString(), this.font, this.ctx, i, son.length);
      this.shapes[0].grow(0, Tree.DELTA_Y - 2);
      return;
    }
    if (select === Tree.A_LEFT_RIGHT) {
      const f = this.getConclusion();
      const pt = new Array(f.toString().length);
      f.putIndex(0, pt, false);
      this.shapes = [{}, {}];
      let son = f.getb(Tree.LEFT).toString();
      let i = f.maxPoint(0, pt).x;
      // Would need text layout implementation
      this.shapes[0] = 
        Resources.getRectRange(f.toString(), this.font, this.ctx, i, son.length);
      this.shapes[0].grow(0, Tree.DELTA_Y - 2);

      son = f.getb(Tree.RIGHT).toString();
      i = f.maxPoint(pt.length - 1, pt).x;
      this.shapes[1] = 
        Resources.getRectRange(f.toString(), this.font, this.ctx, i, son.length);
      this.shapes[1].grow(0, Tree.DELTA_Y - 2);

      return;
    }
    this.shapes = [];
  }

  getb(i) {
    return this.trees[i === Tree.LEFT ? 0 : 1];
  }
  get(i) {
    return this.trees[i];
  }

  getArity() {
    return this.trees.length;
  }

  getSelect() {
    return this.select;
  }

  setFather(father) {
    this.father = father;
  }

  getFather() {
    return this.father;
  }

  getRoot() {
    let res = this;
    while (res.father !== null) {
      res = res.father;
    }
    return res;
  }

  setOrigin(x, y) {
    this.origin.x = x;
    this.origin.y = y;
  }

  getOrigin() {
    return this.origin;
  }

  getWidth() {
    return this.getSize().getWidth();
  }

  getbWidth(b) {
    if (b === Tree.LEFT) {
      return this.getSize().width - this.conc.x;
    }
    this.update();
    return this.conc.x + (this.text ? this.text.width : 0);
  }

  getHeight() {
    return this.getSize().height;
  }

  getBaseHeight() {
    this.update();
    return this.conc.y;
  }

  getMaxBaseHeight() {
    let res = 0;
    for (let i = 0; i < this.trees.length; i++) {
      res = Math.max(res, this.trees[i].getBaseHeight());
    }
    return res;
  }

  getBaseWidth() {
    switch (this.trees.length) {
      case 0:
        return 0;
      case 1:
        return this.trees[0].getConclusionBounds().width;
    }
    let res = this.trees[0].getbWidth(Tree.LEFT) +
              this.trees[this.trees.length - 1].getbWidth(Tree.RIGHT) +
              Tree.DELTA_X;
    for (let i = 1; i < this.trees.length - 1; i++) {
      res += this.trees[i].getWidth() + Tree.DELTA_X;
    }
    return res;
  }

  modify() {
    this.size = Tree.getNewRect();
    if (this.father !== null) {
      this.father.modify();
    }
  }

  getSons() {
    return this.trees;
  }

  setSons(sons) {
    this.trees = sons;
    for (let i = 0; i < this.trees.length; i++) {
      this.trees[i].setFather(this);
    }
    this.modify();
  }

  replace(from, to) {
    for (let i = 0; i < this.trees.length; i++) {
      if (this.trees[i] === from) {
        this.trees[i] = to;
        to.setFather(this);
      }
    }
    this.modify();
  }

  update(rec)  {
    if (rec == null) {
      this.getSize();
    }else{
      this.setOrigin(rec.x, rec.y);
    }
  }

  getSize() {
    if (!this.isEmptyRect(this.size)) {
      return this.size;
    }
    this.size.setBounds(0, 0, 0, 0);
    
    const baseWidth = this.getBaseWidth();
    const textWidth = this.text ? this.text.width : 0;
    const maxWidth = Math.max(baseWidth, textWidth);
    let rx, ldelta, rb, rc;
    
    if (maxWidth === baseWidth) {
      rx = 0;
      ldelta = 0;
      rb = this.trees[0] ? this.trees[0].getWidth() - this.trees[0].getbWidth(Tree.LEFT) : 0;
      rc = rb + (baseWidth - textWidth) / 2;
    } else {
      ldelta = Math.floor((textWidth - baseWidth) / (this.trees.length + 1));
      let u = 0;
      if (this.trees.length !== 0) {
        u = (this.trees[0].getWidth() - this.trees[0].getbWidth(Tree.LEFT)) - ldelta;
      }
      if (u > 0) {
        rx = 0;
        rb = u;
        rc = u;
      } else {
        rx = -u;
        rb = 0;
        rc = 0;
      }
    }
    ldelta += Tree.DELTA_X;
    const maxBaseHeight = this.getMaxBaseHeight();
    const tmp = new Rectangle(0, 0, 0, 0);
    // Place all subtrees
    for (let i = 0; i < this.trees.length; i++) {
      this.trees[i].setOrigin(rx, maxBaseHeight - this.trees[i].getBaseHeight());
      rx += this.trees[i].getWidth() + ldelta;
      tmp.setrBounds(this.trees[i].getSize());
      tmp.translate(this.trees[i].getOrigin().x, this.trees[i].getOrigin().y);
      this.size.add(tmp);
    }
    // Handle the bar
    let ry = this.size.height + Tree.DELTA_Y;
    this.bar = new Rectangle(rb, ry, maxWidth, Tree.THICKNESS);
    this.size.add(this.bar);
    
    // Handle conclusion
    ry += Tree.THICKNESS + Tree.DELTA_Y - (this.text ? this.text.y : 0);
    this.conc = new Point(rc, ry);
    const textBounds = this.text ? 
      new Rectangle(this.text.x, this.text.y, this.text.width, this.text.height) :
      new Rectangle(0, 0, 0, 0);
    this.size.add(new Rectangle(
      this.conc.x + textBounds.x,
      this.conc.y + textBounds.y,
      textBounds.width,
      textBounds.height));
    
    return this.size;
  }

  isEmptyRect(rect) {
    return rect.x === 0 && rect.y === 0 && rect.width === 0 && rect.height === 0;
  }

  draw(g, b, v) {
    this.update();
    g.translate(this.origin.x, this.origin.y);
    
    if (b) {
      const c1 = g.fillStyle;
      g.fillStyle = Resources.HYP;
      g.translate(this.conc.x, this.conc.y);
      for (let i = 0; i < this.shapes.length; i++) {
        // g.fill3DRect equivalent
        g.fillRect(this.shapes[i].x, this.shapes[i].y,
                   this.shapes[i].width, this.shapes[i].height);
      }
      g.translate(-this.conc.x, -this.conc.y);
      g.fillStyle = c1;
    }
    
    if (v.includes(this)) {
      const c1 = g.fillStyle;
      g.fillStyle = Resources.TO;
      g.translate(this.conc.x, this.conc.y);
      const rec = this.getConclusionBounds();
      g.fillRect(rec.x, rec.y, rec.width, rec.height);
      g.translate(-this.conc.x, -this.conc.y);
      g.fillStyle = c1;
    }
    
    // Draw text
    const f1 = g.fillStyle;
    const oldfont = g.font;
    g.fillStyle = 'black';
    g.font = this.font;
    g.fillText(this.f.toString(), this.conc.x, this.conc.y);
        
    if (this.trees.length !== 0 || this.close) {
      g.fillRect(this.bar.x, this.bar.y, this.bar.width, this.bar.height);
    }
    
    for (let i = 0; i < this.trees.length; i++) {
      this.trees[i].draw(g, b, v);
    }
    
    g.font = oldfont;
    g.fillStyle = f1;
    g.translate(-this.origin.x, -this.origin.y);
  }

  drawConclusion(g, mod) {
    this.update();
    g.translate(this.conc.x, this.conc.y);
    let sh;
    if (mod !== 0) {
      sh = this.shapes[mod - 1];
    } else {
      sh = this.getConclusionBounds();
    }
    const c1 = g.fillStyle;
    g.fillStyle = Resources.TO;
    g.fillRect(sh.x, sh.y, sh.width, sh.height);
    g.fillStyle = c1;
    const f1 = g.fillStyle;
    g.fillStyle = 'black';
    const oldfont = g.font;
    g.font = this.font;
    g.fillText(this.f.toString(), 0, 0);
    g.font = oldfont;
    g.fillStyle = f1;
    g.translate(-this.conc.x, -this.conc.y);
  }

  inside(x, y, p) {
    x = x - this.origin.x;
    y = y - this.origin.y;
    const size = this.getSize();
    if (x < size.x || x > size.x + size.width || 
        y < size.y || y > size.y + size.height) {
      return null;
    }
    p.translate(this.origin.x, this.origin.y);
    
    for (let i = 0; i < this.trees.length; i++) {
      const res = this.trees[i].inside(x, y, p);
      if (res !== null) {
        return res;
      }
    }
    for (let i = 0; i < this.shapes.length; i++) {
      const shape = this.shapes[i];
      const sx = shape.x + this.conc.x;
      const sy = shape.y + this.conc.y;
      if (x >= sx && x <= sx + shape.width && 
          y >= sy && y <= sy + shape.height) {
        p.setMod(i + 1);
        break;
      }
    }
    
    if ((x >= this.bar.x && x <= this.bar.x + this.bar.width &&
         y >= this.bar.y && y <= this.bar.y + this.bar.height) ||
         this.text.contains(x - this.conc.x, y - this.conc.y)) {
      return this;
    }
    return null;
  }

  getConclusion() {
    return this.f;
  }

  getNextUp() {
    this.setSelect(Tree.A_NONE);
    if (this.trees.length === 1 && this.get(0).getConclusion().isFalse()) {
      return [];
    }
    if (this.f.isAnd() && this.getArity() === 0) {
      return this.f.split();
    }
    if (this.f.isNeg() && this.getArity() === 0) {
      this.setSelect(Tree.A_LEFT);
      return [Formula.makeFalse()];
    }
    if (this.f.isImp() && this.getArity() === 0) {
      this.setSelect(Tree.A_LEFT);
      return [this.f.getb(Tree.RIGHT)];
    }
    if (this.f.isOr()) {
      if (this.getArity() !== 0 && 
          this.get(0).getConclusion().equals(this.f.getb(Tree.LEFT))) {
        if (this.get(0).getConclusion().equals(this.f.getb(Tree.RIGHT))) {
          return [Formula.makeFalse()];
        }
        return [this.f.getb(Tree.RIGHT)];
      }
      if (this.getArity() === 0) {
        return [this.f.getb(Tree.LEFT)];
      }
    }
    if (this.getConclusion().isFalse()) {
      return [];
    }
    return [Formula.makeFalse()];
  }

  closed() {
    if (this.trees.length === 0) {
      return this.close;
    }
    for (let i = 0; i < this.trees.length; i++) {
      if (!this.trees[i].closed()) {
        return false;
      }
    }
    return true;
  }

  getRectangle() {
    this.rec.setrBounds(this.getSize());
    this.rec.x += this.origin.x;
    this.rec.y += this.origin.y;
    return this.rec;
  }

  drawArct(g, p1, t, p2, c) {
    const b1 = this.getConclusionBoundsm(p1.getMod());
    const b2 = t.getConclusionBoundsm(p2.getMod());
    const x = this.conc.x + p1.getX();
    const y = this.conc.y + p1.getY();
    const fx = p2.getX();
    const fy = p2.getY();
    const c1 = g.strokeStyle;
    g.strokeStyle = c;
    g.beginPath();
    g.moveTo(x + b1.getCenterX(), y - b1.getCenterY());
    g.lineTo(fx + b2.getCenterX(), fy + b2.getCenterY());
    g.stroke();
    g.strokeStyle = c1;
  }

  drawArc(g, p1, p2, c) {
    const b1 = this.getConclusionBoundsm(p1.getMod());
    const x = this.conc.x + p1.getX();
    const y = this.conc.y + p1.getY();    
    const c1 = g.strokeStyle;
    g.strokeStyle = c;
    g.beginPath();
    g.moveTo(x + b1.getCenterX(), y - b1.getCenterY());
    g.lineTo(p2.getX(), p2.getY());
    g.stroke();
    g.strokeStyle = c1;
  }

  getConclusionBoundsm(mod) {
    if (mod === 0) {
      return this.text;
    }
    return this.shapes[mod - 1];
  }

  getConclusionBounds() {
    return  this.text;
  }

  getContext(ctx) {
    if (this.father === null) {
      return;
    }
    switch (this.father.trees.length) {
      case 3: {
        const f = this.father.get(0).getConclusion();
        ctx.push(f.get(this === this.father.get(1) ? 0 : 1));
        break;
      }
      case 2:
        break;
      case 1: {
        const f = this.father.getConclusion();
        if (f.isImp() || f.isNeg()) {
          ctx.push(f.get(0));
        }
      }
    }
    this.father.getContext(ctx);
  }

  isInContext(f) {
    if (this.isImpI() || this.isNegI()) {
      if (this.getConclusion().getb(Tree.LEFT).equals(f)) {
        return true;
      }
    }
    if (this.isOrE()) {
      if (this.get(0).getConclusion().getb(Tree.LEFT).equals(f)) {
        return true;
      }
      if (this.get(0).getConclusion().getb(Tree.RIGHT).equals(f)) {
        return true;
      }
    }
    for (let i = 0; i < this.getArity(); i++) {
      if (this.get(i).isInContext(f)) {
        return true;
      }
    }
    return false;
  }

  getHyps(res) {
    if (this.getArity() === 0) {
      if (this.close) {
        res.push(this.getConclusion());
      }
      return;
    }
    
    if (this.isOrE()) {
      this.get(0).getHyps(res);
      if (res.includes(this.get(0).getConclusion().getb(Tree.LEFT))) {
        this.get(1).getHyps(res);
      } else {
        this.get(1).getHyps(res);
        const idx = res.indexOf(this.get(0).getConclusion().getb(Tree.LEFT));
        if (idx > -1) res.splice(idx, 1);
      }
      if (res.includes(this.get(0).getConclusion().getb(Tree.RIGHT))) {
        this.get(2).getHyps(res);
      } else {
        this.get(2).getHyps(res);
        const idx = res.indexOf(this.get(0).getConclusion().getb(Tree.RIGHT));
        if (idx > -1) res.splice(idx, 1);
      }
      return;
    }
    
    if (this.isImpI() || this.isNegI()) {
      if (res.includes(this.getConclusion().getb(Tree.LEFT))) {
        this.get(0).getHyps(res);
      } else {
        this.get(0).getHyps(res);
        const idx = res.indexOf(this.getConclusion().getb(Tree.LEFT));
        if (idx > -1) res.splice(idx, 1);
      }
      return;
    }
    
    for (let i = 0; i < this.getArity(); i++) {
      this.get(i).getHyps(res);
    }
  }

  getOpenLeaves(res) {
    if (this.trees.length === 0) {
      if (!this.close) {
        res.push(this);
      }
      return;
    }
    for (let i = 0; i < this.trees.length; i++) {
      this.trees[i].getOpenLeaves(res);
    }
  }

  isConclusion() {
    return this.father === null;
  }

  makeClosedLeaf(f) {
    return new Tree(f, true, this.ctx);
  }

  isClosedLeaf() {
    return this.getArity() === 0 && this.close;
  }

  makeOpenLeaf(f) {
    return new Tree(f, false, this.ctx);
  }

  isOpenLeaf() {
    return this.getArity() === 0 && !this.close;
  }

  makeAndI(f) {
    return new Tree(f, false, this.ctx, [
      this.makeOpenLeaf(f.getb(Tree.LEFT)),
      this.makeOpenLeaf(f.getb(Tree.RIGHT))
    ]);
  }

  isAndI() {
    return this.getConclusion().isAnd() &&
           this.getArity() === 2 &&
           this.getConclusion().getb(Tree.LEFT).equals(this.getb(Tree.LEFT).getConclusion()) &&
           this.getConclusion().getb(Tree.RIGHT).equals(this.getb(Tree.RIGHT).getConclusion());
  }

  makeOrI(f, b) {
    return new Tree(f, false, this.ctx, [this.makeOpenLeaf(f.getb(b))]);
  }

  isOrI(b) {
    if (b === undefined) {
      return this.isOrI(Tree.LEFT) || this.isOrI(Tree.RIGHT);
    }
    return this.getConclusion().isOr() &&
           this.getArity() === 1 &&
           this.getConclusion().getb(b).equals(this.get(0).getConclusion());
  }

  makeImpI(f) {
    const tree = 
      new Tree(f, false, this.ctx, [this.makeOpenLeaf(f.getb(Tree.RIGHT))]);
    tree.setSelect(Tree.A_LEFT);
    return tree;
  }

  isImpI() {
    return this.getConclusion().isImp() &&
           this.getArity() === 1 &&
           this.getConclusion().getb(Tree.RIGHT).equals(this.get(0).getConclusion());
  }

  makeNegI(f) {
    const tree = 
      new Tree(f, false, this.ctx, [this.makeOpenLeaf(Formula.makeFalse())]);
    tree.setSelect(Tree.A_LEFT);
    return tree;
  }

  isNegI() {
    return this.getConclusion().isNeg() &&
           this.getArity() === 1 &&
           this.get(0).getConclusion().isFalse();
  }

  makeAndE(b) {
    return new Tree(this.getConclusion().getb(b), false, this.ctx, [this]);
  }

  isAndE(b) {
    if (b === undefined) {
      return this.isAndE(Tree.LEFT) || this.isAndE(Tree.RIGHT);
    }
    return this.getArity() === 1 &&
           this.get(0).getConclusion().isAnd() &&
           this.getConclusion().equals(this.get(0).getConclusion().getb(b));
  }

  makeOrE(f) {
    const t = new Tree(f, false, this.ctx, [
      this,
      this.makeOpenLeaf(f),
      this.makeOpenLeaf(f)
    ]);
    t.get(0).setSelect(Tree.A_LEFT_RIGHT);
    return t;
  }

  isOrE() {
    return this.getArity() === 3 &&
           this.get(0).getConclusion().isOr() &&
           this.getConclusion().equals(this.get(1).getConclusion()) &&
           this.getConclusion().equals(this.get(2).getConclusion());
  }

  makeImpE() {
    return new Tree(this.getConclusion().getb(Tree.RIGHT), false, this.ctx, 
    [
      this,
      this.makeOpenLeaf(this.getConclusion().getb(Tree.LEFT))
    ]);
  }b

  isImpE() {
    return this.getSons().length === 2 &&
           this.getb(Tree.LEFT).getConclusion().isImp() &&
           this.getConclusion().equals(this.getb(Tree.LEFT).getConclusion().getb(Tree.RIGHT)) &&
           this.getb(Tree.RIGHT).getConclusion().equals(this.getb(Tree.LEFT).getConclusion().getb(Tree.RIGHT));
  }

  makeNegE() {
    return new Tree(Formula.makeFalse(), false, this.ctx, 
    [
      this,
      this.makeOpenLeaf(this.getConclusion().get(0))
    ]);
  }

  isNegE() {
    return this.getArity() === 2 &&
           this.getConclusion().isFalse() &&
           this.getb(Tree.LEFT).getConclusion().isNeg() &&
           this.getb(Tree.LEFT).getConclusion().getb(Tree.LEFT).equals(
             this.getb(Tree.RIGHT).getConclusion()
           );
  }

  makeFalseE(f) {
    return new Tree(f, false, this.ctx, [this]);
  }

  isFalseE() {
    return this.getArity() === 1 &&
           this.get(0).getConclusion().isFalse();
  }

  toString() {
    return "Tree [" + this.f + "]";
  }
}

export default Tree;