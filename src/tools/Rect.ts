'use strict';
import Point from './Point';

class Rect {
  ctx: CanvasRenderingContext2D;
  start: Point;
  width: number;
  height: number;
  bgColor: string;

  constructor (ctx: CanvasRenderingContext2D, start: Point, width: number, height: number, bgColor?: string) {
    this.ctx = ctx;
    this.start = start;
    this.width = width;
    this.height = height;
    this.bgColor = bgColor;
    this.draw();
  }

  draw () {
    this.ctx.lineWidth = this.start.size;
    this.ctx.strokeStyle = this.start.color;
    if (this.bgColor) {
      this.ctx.fillStyle = this.bgColor;
      this.ctx.fillRect(this.start.x, this.start.y, this.width, this.height);
    }
    this.ctx.strokeRect(this.start.x, this.start.y, this.width, this.height);
  }
}

export default Rect;
