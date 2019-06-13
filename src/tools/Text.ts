'use strict';
import Point from './Point';

class Text {
  ctx: CanvasRenderingContext2D;
  start: Point;
  text: string;

  constructor (ctx: CanvasRenderingContext2D, start: Point, text: string) {
    this.ctx = ctx;
    this.start = start;
    this.text = text;
    this.draw();
  }

  draw () {
    this.ctx.fillText(this.text, this.start.x, this.start.y);
  }
}

export default Text;
