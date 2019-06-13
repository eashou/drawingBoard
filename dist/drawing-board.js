'use strict';
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var Point = /** @class */ (function () {
    function Point(x, y, size, color) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.color = color;
    }
    return Point;
}());
var Line = /** @class */ (function () {
    function Line(ctx, start, end) {
        this.ctx = ctx;
        this.start = start;
        this.end = end;
        this.draw();
    }
    Line.prototype.draw = function () {
        this.ctx.beginPath();
        this.ctx.moveTo(this.start.x, this.start.y);
        this.ctx.lineTo(this.end.x, this.end.y);
        this.ctx.lineWidth = this.start.size;
        this.ctx.strokeStyle = this.start.color;
        this.ctx.stroke();
        this.ctx.save();
    };
    return Line;
}());
var Pencil = /** @class */ (function () {
    function Pencil(ctx, PointList) {
        this.ctx = ctx;
        this.PointList = PointList;
        this.draw();
    }
    Pencil.prototype.draw = function () {
        var _this_1 = this;
        this.PointList.forEach(function (point, index) {
            var lastPoint = _this_1.PointList[index - 1];
            lastPoint && new Line(_this_1.ctx, lastPoint, point);
        });
    };
    return Pencil;
}());
var Eraser = /** @class */ (function (_super) {
    __extends(Eraser, _super);
    function Eraser(ctx, PointList) {
        var _this_1 = _super.call(this, ctx, PointList) || this;
        _this_1.draw();
        return _this_1;
    }
    Eraser.prototype.draw = function () {
        this.ctx.globalCompositeOperation = 'destination-out';
        _super.prototype.draw.call(this);
        this.ctx.globalCompositeOperation = 'source-over';
    };
    return Eraser;
}(Pencil));
var Rect = /** @class */ (function () {
    function Rect(ctx, start, width, height, bgColor) {
        this.ctx = ctx;
        this.start = start;
        this.width = width;
        this.height = height;
        this.bgColor = bgColor;
        this.draw();
    }
    Rect.prototype.draw = function () {
        this.ctx.lineWidth = this.start.size;
        this.ctx.strokeStyle = this.start.color;
        if (this.bgColor) {
            this.ctx.fillStyle = this.bgColor;
            this.ctx.fillRect(this.start.x, this.start.y, this.width, this.height);
        }
        this.ctx.strokeRect(this.start.x, this.start.y, this.width, this.height);
    };
    return Rect;
}());
var Txt = /** @class */ (function () {
    function Txt(ctx, start, text) {
        this.ctx = ctx;
        this.start = start;
        this.text = text;
        this.draw();
    }
    Txt.prototype.draw = function () {
        this.ctx.fillText(this.text, this.start.x, this.start.y);
    };
    return Txt;
}());
;
var defaultArgs = {
    currentTool: 'pencil'
};
var DrawingBoard = /** @class */ (function () {
    function DrawingBoard(el, options) {
        var _this_1 = this;
        if (options === void 0) { options = defaultArgs; }
        this.el = null;
        this.txtInput = null;
        this.isDrawing = false;
        this.pointList = [];
        this.shapeList = [];
        this.currentTool = 'pencil';
        this.el = el;
        this.ctx = el.getContext('2d');
        this.currentTool = options.currentTool;
        this.init();
        el.addEventListener('mousedown', function (ev) {
            _this_1.drawStart(ev.offsetX, ev.offsetY);
        }, false);
        el.addEventListener('mousemove', function (ev) {
            _this_1.drawing(ev.offsetX, ev.offsetY);
        }, false);
        document.addEventListener('mouseup', this.drawEnd.bind(this), false);
    }
    DrawingBoard.prototype.generatePoint = function (x, y, size, color) {
        size = size || 5;
        color = color || 'red';
        return new Point(x, y, size, color);
    };
    DrawingBoard.prototype.createTxtInput = function (start) {
        if (this.txtInput)
            return;
        this.txtInput = document.createElement('textarea');
        this.txtInput.style.position = 'absolute';
        this.txtInput.style.left = start.x + 'px';
        this.txtInput.style.top = start.y + 'px';
        this.txtInput.style.border = '1px solid #000';
        this.el.parentNode.appendChild(this.txtInput);
        this.txtInput.focus();
        var _this = this;
        var timer = setTimeout(function () {
            function onBlur() {
                var text = _this.txtInput.value;
                _this.el.parentNode.removeChild(_this.txtInput);
                _this.txtInput.removeEventListener('blur', onBlur, false);
                _this.txtInput = null;
                if (text) {
                    _this.shapeList.push(new Txt(_this.ctx, start, text));
                }
            }
            _this.txtInput.addEventListener('blur', onBlur, false);
            clearTimeout(timer);
        }, 30);
    };
    DrawingBoard.prototype.init = function () {
        this.ctx.clearRect(0, 0, this.el.width, this.el.height);
        this.shapeList.forEach(function (shape) {
            shape.draw();
        });
    };
    DrawingBoard.prototype.drawStart = function (x, y) {
        this.isDrawing = true;
        this.pointList.push(this.generatePoint(x, y));
        if (this.currentTool === 'text') {
            this.createTxtInput(this.pointList[this.pointList.length - 1]);
        }
    };
    DrawingBoard.prototype.drawing = function (x, y) {
        if (!this.isDrawing)
            return;
        this.init();
        var start = this.pointList[0];
        var end = this.generatePoint(x, y);
        this.pointList.push(end);
        if (this.currentTool === 'pencil') {
            this.shape = new Pencil(this.ctx, this.pointList);
        }
        else if (this.currentTool === 'eraser') {
            this.shape = new Eraser(this.ctx, this.pointList);
        }
        else if (this.currentTool === 'line') {
            this.shape = new Line(this.ctx, start, end);
        }
        else if (this.currentTool === 'rect') {
            this.shape = new Rect(this.ctx, start, x - start.x, y - start.y);
        }
    };
    DrawingBoard.prototype.drawEnd = function () {
        this.isDrawing && this.shape && this.shapeList.push(this.shape);
        this.pointList = [];
        this.isDrawing = false;
        this.shape = null;
        console.log(this.shapeList);
    };
    return DrawingBoard;
}());
