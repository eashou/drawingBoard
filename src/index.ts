'use strict';

import Point from './tools/Point';
import Line from './tools/Line';
import Pencil from './tools/Pencil';
import Eraser from './tools/Eraser';
import Rect from './tools/Rect';
import Text from './tools/Text';
import Ellipse from './tools/Ellipse';

type Shape = Line|Pencil|Eraser|Rect|Text|Ellipse;
interface ConfigArgs {
  currentTool?: string,
  size?: number,
  color?: string,
  fillColor?: string,
  zoom?: number
};
interface Origin {
  x: number,
  y: number
}

const defaultArgs: ConfigArgs = {
  currentTool: 'pencil',
  size: 5,
  color: 'black',
  zoom: 1
};

class DrawingBoard {
  el: HTMLCanvasElement = null;
  txtInput: HTMLTextAreaElement = null;
  ctx: CanvasRenderingContext2D;
  isDrawing: boolean = false;
  pointList: Array<Point> = [];
  shape: Shape;
  shapeList: Array<Shape> = [];
  redoShapeList: Array<Shape[]> = [];
  origin: Origin = {x: 0, y: 0};
  zoomFator: number = 1;
  currentTool: string;
  size: number;
  color: string;
  fillColor: string;

  constructor(el: HTMLCanvasElement, options: ConfigArgs = defaultArgs) {
    this.el = el;
    this.ctx = el.getContext('2d');
    this.currentTool = options.currentTool;
    this.size = options.size;
    this.color = options.color;
    this.fillColor = options.fillColor;
    this.zoomFator = options.zoom;
    this.redraw();

    el.addEventListener('mousedown', ev => {
      const x = Math.round(ev.offsetX / this.zoomFator - this.origin.x);
      const y = Math.round(ev.offsetY / this.zoomFator - this.origin.y);
      this.drawStart(x, y);
    }, false);
    el.addEventListener('mousemove', ev => {
      const x = Math.round(ev.offsetX / this.zoomFator - this.origin.x);
      const y = Math.round(ev.offsetY / this.zoomFator - this.origin.y);
      this.drawing(x, y);
    }, false);
    document.addEventListener('mouseup', this.drawEnd.bind(this), false);
  }

  setTool (tool: string = 'pencil') {
    this.currentTool = tool;
  }

  setSize (size: number = 5) {
    this.size = size / this.zoomFator;
  }

  setColor (color: string = 'black') {
    this.color = color
  }

  setFillColor (color: string) {
    this.fillColor = color;
  }

  redo () {
    const shape: Shape = this.shapeList.pop();
    if (!shape) return;
    const shapes = [ shape ];
    this.redoShapeList.push(shapes);
    this.redraw();
  }

  undo () {
    const shapes: Shape[] = this.redoShapeList.pop();
    if (!shapes) return;
    this.shapeList = this.shapeList.concat(shapes);
    this.redraw();
  }

  clear () {
    this.redoShapeList.push(this.shapeList);
    this.shapeList = [];
    this.redraw();
  }

  zoom (zoom: number) {
    if (!zoom || (zoom <= 0 && zoom > 2) || this.zoomFator === zoom) return;
    this.ctx.scale(1 / this.zoomFator, 1 / this.zoomFator);
    this.size *= this.zoomFator / zoom;
    this.origin = Object.assign({}, {
      x: this.origin.x * this.zoomFator / zoom,
      y: this.origin.y * this.zoomFator / zoom
    });
    this.zoomFator = zoom;
    this.ctx.scale(this.zoomFator, this.zoomFator);
    this.redraw();
  }

  move (origin: Origin) {
    this.ctx.translate(-this.origin.x, -this.origin.y);
    this.origin = Object.assign({}, origin);
    this.ctx.translate(this.origin.x, this.origin.y);
    this.redraw();
  }

  createTxtInput (start: Point) {
    if (this.txtInput) return;
    this.txtInput = document.createElement('textarea');
    this.txtInput.style.position = 'absolute';
    this.txtInput.style.left = Math.round((start.x + this.origin.x) * this.zoomFator) + 'px';
    this.txtInput.style.top = Math.round((start.y + this.origin.y) * this.zoomFator) + 'px';
    this.txtInput.style.border = '1px solid #000';
    this.el.parentNode.appendChild(this.txtInput);
    this.txtInput.focus();

    const _this = this;
    const timer = setTimeout(() => {
      function onBlur () {
        const text = _this.txtInput.value;
        _this.el.parentNode.removeChild(_this.txtInput);
        _this.txtInput.removeEventListener('blur', onBlur, false);
        _this.txtInput = null;
        if (text) {
          _this.shapeList.push(new Text(_this.ctx, start, text));
        }
      }
      _this.txtInput.addEventListener('blur', onBlur, false);
      clearTimeout(timer);
    }, 30)
  }

  redraw () {
    this.ctx.clearRect(-this.origin.x, -this.origin.y, this.el.width / this.zoomFator, this.el.height / this.zoomFator);
    this.shapeList.forEach(shape => {
      shape.draw();
    });
  }

  drawStart (x: number, y: number) {
    this.isDrawing = true;
    this.pointList.push(new Point(x, y, this.size, this.color));
    if (this.currentTool !== 'move') {
      this.redoShapeList = [];
    }
    if (this.currentTool === 'text') {
      this.createTxtInput(this.pointList[this.pointList.length - 1]);
    }
  }

  drawing (x: number, y: number) {
    if (!this.isDrawing) return;
    const start: Point = this.pointList[0];
    const end: Point = new Point(x, y, this.size, this.color);
    if (start.x === end.x && start.y === end.y) return;
    this.currentTool !== 'move' && this.redraw();
    this.pointList.push(end);
    if (this.currentTool === 'pencil') {
      this.shape = new Pencil(this.ctx, this.pointList);
    } else if (this.currentTool === 'eraser') {
      this.shape = new Eraser(this.ctx, this.pointList);
    } else if (this.currentTool === 'line') {
      this.shape = new Line(this.ctx, start, end);
    } else if (this.currentTool === 'rect') {
      this.shape = new Rect(this.ctx, start, x - start.x, y - start.y, this.fillColor);
    } else if (this.currentTool === 'ellipse') {
      this.shape = new Ellipse(this.ctx, start, end, this.fillColor);
    } else if (this.currentTool === 'move') {
      this.move({x: this.origin.x + x - start.x, y: this.origin.y + y - start.y})
    }
  }

  drawEnd () {
    if (!this.isDrawing) return;
    this.shape && this.shapeList.push(this.shape);
    this.pointList = [];
    this.isDrawing = false;
    this.shape = null;
    console.log(this.shapeList);
  }
}

module.exports = DrawingBoard;