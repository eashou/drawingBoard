'use strict';
import Point from './Point';
import Line from './Line';


class Pencil {
  ctx: CanvasRenderingContext2D;
  PointList: Array<Point>;

  constructor (ctx: CanvasRenderingContext2D, PointList: Array<Point>) {
    this.ctx = ctx;
    this.PointList = PointList;
    this.draw()
  }

  draw () {
    this.PointList.forEach((point, index) => {
      const lastPoint = this.PointList[index - 1];
      lastPoint && new Line(this.ctx, lastPoint, point);
    })
  }
}

export default Pencil;
