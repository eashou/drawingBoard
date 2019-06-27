'use strict';
import Point from './Point';

class Line {
  ctx: CanvasRenderingContext2D;
  start: Point;
  end: Point;
  dash: boolean;
  segments: Array<number> = [15, 5];

  constructor (ctx: CanvasRenderingContext2D, start: Point, end: Point, dash?: boolean) {
    this.ctx = ctx;
    this.start = start;
    this.end = end;
    this.dash = dash
    this.draw();
  }

  draw () {
    this.ctx.beginPath();
    this.ctx.setLineDash(this.dash ? this.segments : []);
    this.ctx.moveTo(this.start.x, this.start.y);
    this.ctx.lineTo(this.end.x, this.end.y);
    this.ctx.lineWidth = this.end.size;
    this.ctx.strokeStyle = this.end.color;
    this.ctx.stroke();
  }
}

export default Line;
