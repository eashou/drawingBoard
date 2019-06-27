'use strict';
import Point from './Point';

class Line {
  ctx: CanvasRenderingContext2D;
  start: Point;
  end: Point;
  dash: boolean;
  arrow: boolean;
  segments: Array<number> = [15, 5];

  constructor (ctx: CanvasRenderingContext2D, start: Point, end: Point, dash?: boolean, arrow?: boolean) {
    this.ctx = ctx;
    this.start = start;
    this.end = end;
    this.dash = dash;
    this.arrow = arrow;
    this.draw();
  }

  draw () {
    this.ctx.beginPath();
    this.dash && this.ctx.setLineDash(this.segments);
    this.ctx.moveTo(this.start.x, this.start.y);
    this.ctx.lineTo(this.end.x, this.end.y);
    this.ctx.lineWidth = this.end.size;
    this.ctx.strokeStyle = this.end.color;
    this.ctx.stroke();
    this.ctx.setLineDash([]);
    this.arrow && this.drawArrow();
  }

  drawArrow () {
    const handle = 15;
    const angle = 30;
    const rotaAngle = Math.atan2(this.start.y - this.end.y, this.start.x - this.end.x) * 180 / Math.PI;
    const angle1 = (rotaAngle + angle) * Math.PI / 180;
    const angle2 = (rotaAngle - angle) * Math.PI / 180;
    const point1 = new Point(this.end.x + handle * Math.cos(angle1), this.end.y + handle * Math.sin(angle1), this.end.size, this.end.color);
    const point2 = new Point(this.end.x + handle * Math.cos(angle2), this.end.y + handle * Math.sin(angle2), this.end.size, this.end.color);

    this.ctx.beginPath();
    this.ctx.moveTo(point1.x, point1.y);
    this.ctx.lineTo(this.end.x, this.end.y);
    this.ctx.lineTo(point2.x, point2.y);
    this.ctx.stroke();
    // new Line(this.ctx, point1, this.end);
    // new Line(this.ctx, this.end, point2);
  }
}

export default Line;
