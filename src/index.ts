'use strict';

interface ConfigArgs {
  currentTool: string
};

const defaultArgs: ConfigArgs = {
  currentTool: 'pen'
};

class DrawingBoard {
  el: HTMLCanvasElement = null;
  ctx: CanvasRenderingContext2D;
  isDrawing: boolean = false;
  shapeList: Array<number[]> = [];
  currentTool: string = 'pen';
  txtInput: HTMLTextAreaElement = null;

  constructor(el: HTMLCanvasElement, options: ConfigArgs = defaultArgs) {
    this.el = el;
    this.ctx = el.getContext('2d');
    this.currentTool = options.currentTool;

    el.addEventListener('mousedown', ev => {
      if (this.currentTool === 'pen' || this.currentTool === 'rect') {
        this.drawStart(ev.offsetX, ev.offsetY);
      } else if (this.currentTool === 'text') {
        this.text(ev.offsetX, ev.offsetY);
      }
    }, false);
    el.addEventListener('mousemove', ev => {
      if (this.currentTool === 'pen') {
        this.drawing(ev.offsetX, ev.offsetY);
      } else if (this.currentTool === 'rect') {
        this.rect(ev.offsetX, ev.offsetY);
      }
    }, false);
    document.addEventListener('mouseup', () => {
      if (this.currentTool === 'pen' || this.currentTool === 'rect') {
        this.drawEnd();
      } else if (this.currentTool === 'text') {

      }
    }, false);
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

  text (x: number, y: number) {
    if (this.txtInput) {
      this.ctx.fillText(this.txtInput.value, this.shapeList[0][0], this.shapeList[0][1]);
      this.el.parentNode.removeChild(this.txtInput);
      this.txtInput = null;
      this.shapeList = [];
    } else {
      this.shapeList.push([x, y]);
      this.txtInput = document.createElement('textarea');
      this.txtInput.style.position = 'absolute';
      this.txtInput.style.left = x + 'px';
      this.txtInput.style.top = y + 'px';
      this.txtInput.style.border = '1px solid #000';
      this.el.parentNode.appendChild(this.txtInput);
    }
  }

  rect (x: number, y: number) {
    if (this.isDrawing) {
      const firstShape = this.shapeList[0];
      const lastShape = this.shapeList[this.shapeList.length - 1];
      if (lastShape) {
        this.ctx.clearRect(firstShape[0], firstShape[1], lastShape[0] - firstShape[0], lastShape[1] - firstShape[1]);
      }
      this.shapeList.push([x, y]);
      this.ctx.fillRect(firstShape[0], firstShape[1], x - firstShape[0], y - firstShape[1]);
    }
  }
}
