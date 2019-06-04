'use strict';

interface ConfigArgs {
  currentTool: string
};

const defaultArgs: ConfigArgs = {
  currentTool: 'pan'
};

class DrawingBoard {
  el: HTMLCanvasElement = null;
  ctx: CanvasRenderingContext2D;
  isDrawing: boolean = false;
  shapeList: Array<number[]> = [];
  currentTool: string = 'pan';
  txtInput: HTMLTextAreaElement = null;

  constructor(el: HTMLCanvasElement, options: ConfigArgs = defaultArgs) {
    this.el = el;
    this.ctx = el.getContext('2d');
    this.currentTool = options.currentTool;

    el.addEventListener('mousedown', ev => {
      if (this.currentTool === 'pan') {
        this.drawStart(ev.offsetX, ev.offsetY);
      } else if (this.currentTool === 'text') {
        this.text(ev.offsetX, ev.offsetY);
      }
    }, false);
    el.addEventListener('mousemove', ev => {
      this.drawing(ev.offsetX, ev.offsetY)
    }, false);
    document.addEventListener('mouseup', () => {
      if (this.currentTool === 'pan') {
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
}
