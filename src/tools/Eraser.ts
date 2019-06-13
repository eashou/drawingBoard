'use strict';
import Point from './Point';
import Pencil from './Pencil';

class Eraser extends Pencil {
  constructor (ctx: CanvasRenderingContext2D, PointList: Array<Point>) {
    super(ctx, PointList);
    this.draw();
  }

  draw () {
    this.ctx.globalCompositeOperation = 'destination-out';
    super.draw();
    this.ctx.globalCompositeOperation = 'source-over';
  }
}

export default Eraser;
