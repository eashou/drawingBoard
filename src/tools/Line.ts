'use strict';
import Point from './Point';

class Line {
  ctx: CanvasRenderingContext2D;
  start: Point;
  end: Point;

  constructor (ctx: CanvasRenderingContext2D, start: Point, end: Point) {
    this.ctx = ctx;
    this.start = start;
    this.end = end;
    this.draw();
  }

  draw () {
    this.ctx.beginPath();
    this.ctx.moveTo(this.start.x, this.start.y);
    this.ctx.lineTo(this.end.x, this.end.y);
    this.ctx.lineWidth = this.end.size;
    this.ctx.strokeStyle = this.end.color;
    this.ctx.stroke();
    this.ctx.save();
  }
}

export default Line;
