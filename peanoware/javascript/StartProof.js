import Pair from './Pair.js';
import Pane from './Pane.js';
        const canvas = document.getElementById('textCanvas');
        const ctx = canvas.getContext('2d');
        const pair = new Pair(ctx);
        const pane = new Pane(pair);
        pane.initCanvas(canvas);
        pane.init(ctx);
        pane.paintComponent(ctx);
