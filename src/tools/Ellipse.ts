'use strict';
import Point from './Point';

class Ellipse {
  ctx: CanvasRenderingContext2D;
  start: Point;
  end: Point;
  bgColor: string;

  constructor (ctx: CanvasRenderingContext2D, start: Point, end: Point, bgColor?: string) {
    this.ctx = ctx;
    this.start = start;
    this.end = end;
    this.bgColor = bgColor;
    this.draw();
  }

  draw () {
    const x = (this.end.x + this.start.x) / 2;
    const y = (this.end.y + this.start.y) / 2;
    // const a = Math.sqrt(Math.pow((this.end.x - this.start.x), 2) + Math.pow((this.end.y - this.start.y), 2)) / 2
    // const b = ((this.end.y - this.start.y) / (this.end.x - this.start.x)) * a
    // const rotation = Math.atan(b / a)
    const a = Math.abs(this.end.x - this.start.x) / 2;
    const b = Math.abs(this.end.y - this.start.y) / 2;

    this.ctx.beginPath();

    this.ctx.save();
    this.ctx.translate(x, y);
    this.ctx.rotate(0);
    this.ctx.scale(a, b);
    this.ctx.arc(0, 0, 1, 0, 2 * Math.PI, true);
    this.ctx.restore();

    if (this.bgColor) {
      this.ctx.fillStyle = this.bgColor;
      this.ctx.fill();
    }

    this.ctx.lineWidth = this.end.size;
    this.ctx.strokeStyle = this.end.color;
    this.ctx.stroke();
  }
}

export default Ellipse
