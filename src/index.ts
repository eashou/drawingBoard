'use strict';

class Point {
  x: number;
  y: number;
  size: number;
  color: string;

  constructor (x: number, y: number, size: number, color: string) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.color = color;
  }
}

class Line {
  ctx: CanvasRenderingContext2D;
  start: Point;
  end: Point;

  constructor (ctx: CanvasRenderingContext2D, start: Point, end: Point) {
    this.ctx = ctx;
    this.start = start;
    this.end = end;
    this.draw();
  }

  draw () {
    this.ctx.beginPath();
    this.ctx.moveTo(this.start.x, this.start.y);
    this.ctx.lineTo(this.end.x, this.end.y);
    this.ctx.lineWidth = this.start.size;
    this.ctx.strokeStyle = this.start.color;
    this.ctx.stroke();
    this.ctx.save();
  }
}

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

class Txt {
  ctx: CanvasRenderingContext2D;
  start: Point;
  text: string;

  constructor (ctx: CanvasRenderingContext2D, start: Point, text: string) {
    this.ctx = ctx;
    this.start = start;
    this.text = text;
    this.draw();
  }

  draw () {
    this.ctx.fillText(this.text, this.start.x, this.start.y);
  }
}


interface ConfigArgs {
  currentTool: string
};

const defaultArgs: ConfigArgs = {
  currentTool: 'pencil'
};

class DrawingBoard {
  el: HTMLCanvasElement = null;
  txtInput: HTMLTextAreaElement = null;
  ctx: CanvasRenderingContext2D;
  isDrawing: boolean = false;
  pointList: Array<Point> = [];
  shape: Line|Pencil|Eraser|Rect|Txt;
  shapeList: Array<Line|Pencil|Eraser|Rect|Txt> = [];
  currentTool: string = 'pencil';

  constructor(el: HTMLCanvasElement, options: ConfigArgs = defaultArgs) {
    this.el = el;
    this.ctx = el.getContext('2d');
    this.currentTool = options.currentTool;
    this.init();

    el.addEventListener('mousedown', ev => {
      this.drawStart(ev.offsetX, ev.offsetY);
    }, false);
    el.addEventListener('mousemove', ev => {
      this.drawing(ev.offsetX, ev.offsetY);
    }, false);
    document.addEventListener('mouseup', ev => {
      this.drawEnd(ev.offsetX, ev.offsetY);
    }, false);
  }

  generatePoint (x: number, y: number, size?: number, color?: string) {
    size = size || 5
    color = color || 'red'
    return new Point(x, y, size, color)
  }

  createTxtInput (start: Point) {
    if (this.txtInput) return
    this.txtInput = document.createElement('textarea');
    this.txtInput.style.position = 'absolute';
    this.txtInput.style.left = start.x + 'px';
    this.txtInput.style.top = start.y + 'px';
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
          _this.shapeList.push(new Txt(_this.ctx, start, text));
        }
      }
      _this.txtInput.addEventListener('blur', onBlur, false);
      clearTimeout(timer);
    }, 30)
  }

  init () {
    this.ctx.clearRect(0, 0, this.el.width, this.el.height);
    this.shapeList.forEach(shape => {
      shape.draw();
    });
  }

  drawStart (x: number, y: number) {
    this.isDrawing = true;
    this.pointList.push(this.generatePoint(x, y));
    if (this.currentTool === 'text') {
      this.createTxtInput(this.pointList[this.pointList.length - 1])
    }
  }

  drawing (x: number, y: number) {
    if (!this.isDrawing) return
    this.init();
    const start: Point = this.pointList[0];
    const end: Point = this.generatePoint(x, y);
    this.pointList.push(end);
    if (this.currentTool === 'pencil') {
      this.shape = new Pencil(this.ctx, this.pointList)
    } else if (this.currentTool === 'eraser') {
      this.shape = new Eraser(this.ctx, this.pointList)
    } else if (this.currentTool === 'line') {
      this.shape = new Line(this.ctx, start, this.generatePoint(x, y))
    } else if (this.currentTool === 'rect') {
      this.shape = new Rect(this.ctx, start, x - start.x, y - start.y);
    }
  }

  drawEnd (x: number, y: number) {
    this.isDrawing && this.shape && this.shapeList.push(this.shape);
    this.pointList = [];
    this.isDrawing = false;
    this.shape = null;
    console.log(this.shapeList);
  }
}
