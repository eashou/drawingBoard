'use strict';

class DrawingBoard {
  ctx: object;

  constructor(el: HTMLCanvasElement) {
    this.ctx = el.getContext('2d');
  }

  getCtx() {
    return this.ctx
  }
}
