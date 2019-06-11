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
      if (this.currentTool === 'text') {
        this.text(ev.offsetX, ev.offsetY);
      } else {
        this.drawStart(ev.offsetX, ev.offsetY);
      }
    }, false);
    el.addEventListener('mousemove', ev => {
      if (this.currentTool === 'pen' || this.currentTool === 'eraser') {
        this.drawing(ev.offsetX, ev.offsetY);
      } else if (this.currentTool === 'rect') {
        this.rect(ev.offsetX, ev.offsetY);
      } else if (this.currentTool === 'line') {
        this.line(ev.offsetX, ev.offsetY);
      }
    }, false);
    document.addEventListener('mouseup', () => {
      if (this.currentTool !== 'text') {
        this.drawEnd();
      }
    }, false);
  }

  clear () {
    this.ctx.clearRect(0, 0, this.el.width, this.el.height);
  }

  drawStart (x: number, y: number) {
    this.isDrawing = true;
    this.shapeList.push([x, y]);
  }

  drawing (x: number, y: number) {
    if (this.isDrawing) {
      this.shapeList.push([x, y]);
      this.ctx.beginPath();
      if (this.currentTool === 'eraser') {
        this.ctx.globalCompositeOperation = 'destination-out'
      }
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
      this.clear();
      const firstShape: number[] = this.shapeList[0];
      this.shapeList.push([x, y]);
      this.ctx.fillRect(firstShape[0], firstShape[1], x - firstShape[0], y - firstShape[1]);
    }
  }

  line (x: number, y: number) {
    if (this.isDrawing) {
      this.clear();
      this.ctx.beginPath();
      this.ctx.moveTo(this.shapeList[0][0], this.shapeList[0][1]);
      this.ctx.lineTo(x, y);
      this.ctx.stroke();
    }
  }
}
