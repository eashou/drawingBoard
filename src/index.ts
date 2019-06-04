'use strict';

interface ConfigArgs {
  currentTool: string
};

const defaultArgs: ConfigArgs = {
  currentTool: 'pan'
};

class DrawingBoard {
  ctx: CanvasRenderingContext2D;
  isDrawing: boolean = false;
  shapeList: Array<number[]> = [];
  currentTool: string = 'pan';

  constructor(el: HTMLCanvasElement, options: ConfigArgs = defaultArgs) {
    this.ctx = el.getContext('2d');
    this.currentTool = options.currentTool;

    if (this.currentTool === 'pan') {
      el.addEventListener('mousedown', ev => {
        this.drawStart(ev.offsetX, ev.offsetY);
      }, false);
      el.addEventListener('mousemove', ev => {
        this.drawing(ev.offsetX, ev.offsetY)
      }, false);
      el.addEventListener('mouseup', this.drawEnd.bind(this), false);
    }
  }

  drawStart (x: number, y: number) {
    this.isDrawing = true;
    this.shapeList.push([x, y]);
  }

  drawing (x: number, y: number) {
    if (this.isDrawing) {
      this.shapeList.push([x, y]);
      this.ctx.beginPath();
      this.shapeList.forEach((shape: number[]) => {
        this.ctx.lineTo(shape[0], shape[1]);
        this.ctx.moveTo(shape[0], shape[1]);
      });
      this.ctx.closePath();
      this.ctx.stroke();
    }
  }

  drawEnd () {
    this.isDrawing = false;
    this.shapeList = [];
  }
}
