'use strict';
;
var defaultArgs = {
    currentTool: 'pen'
};
var DrawingBoard = /** @class */ (function () {
    function DrawingBoard(el, options) {
        var _this = this;
        if (options === void 0) { options = defaultArgs; }
        this.el = null;
        this.isDrawing = false;
        this.shapeList = [];
        this.currentTool = 'pen';
        this.txtInput = null;
        this.el = el;
        this.ctx = el.getContext('2d');
        this.currentTool = options.currentTool;
        el.addEventListener('mousedown', function (ev) {
            if (_this.currentTool === 'text') {
                _this.text(ev.offsetX, ev.offsetY);
            }
            else {
                _this.drawStart(ev.offsetX, ev.offsetY);
            }
        }, false);
        el.addEventListener('mousemove', function (ev) {
            if (_this.currentTool === 'pen') {
                _this.drawing(ev.offsetX, ev.offsetY);
            }
            else if (_this.currentTool === 'rect') {
                _this.rect(ev.offsetX, ev.offsetY);
            }
            else if (_this.currentTool === 'line') {
                _this.line(ev.offsetX, ev.offsetY);
            }
        }, false);
        document.addEventListener('mouseup', function () {
            if (_this.currentTool !== 'text') {
                _this.drawEnd();
            }
        }, false);
    }
    DrawingBoard.prototype.clear = function () {
        this.ctx.clearRect(0, 0, this.el.width, this.el.height);
    };
    DrawingBoard.prototype.drawStart = function (x, y) {
        this.isDrawing = true;
        this.shapeList.push([x, y]);
    };
    DrawingBoard.prototype.drawing = function (x, y) {
        var _this = this;
        if (this.isDrawing) {
            this.shapeList.push([x, y]);
            this.ctx.beginPath();
            this.shapeList.forEach(function (shape) {
                _this.ctx.lineTo(shape[0], shape[1]);
                _this.ctx.moveTo(shape[0], shape[1]);
            });
            this.ctx.closePath();
            this.ctx.stroke();
        }
    };
    DrawingBoard.prototype.drawEnd = function () {
        this.isDrawing = false;
        this.shapeList = [];
    };
    DrawingBoard.prototype.text = function (x, y) {
        if (this.txtInput) {
            this.ctx.fillText(this.txtInput.value, this.shapeList[0][0], this.shapeList[0][1]);
            this.el.parentNode.removeChild(this.txtInput);
            this.txtInput = null;
            this.shapeList = [];
        }
        else {
            this.shapeList.push([x, y]);
            this.txtInput = document.createElement('textarea');
            this.txtInput.style.position = 'absolute';
            this.txtInput.style.left = x + 'px';
            this.txtInput.style.top = y + 'px';
            this.txtInput.style.border = '1px solid #000';
            this.el.parentNode.appendChild(this.txtInput);
        }
    };
    DrawingBoard.prototype.rect = function (x, y) {
        if (this.isDrawing) {
            var firstShape = this.shapeList[0];
            // const lastShape: number[] = this.shapeList[this.shapeList.length - 1];
            // if (lastShape) {
            //   this.ctx.clearRect(firstShape[0], firstShape[1], lastShape[0] - firstShape[0], lastShape[1] - firstShape[1]);
            // }
            this.clear();
            this.shapeList.push([x, y]);
            this.ctx.fillRect(firstShape[0], firstShape[1], x - firstShape[0], y - firstShape[1]);
        }
    };
    DrawingBoard.prototype.line = function (x, y) {
        if (this.isDrawing) {
            this.clear();
            this.ctx.beginPath();
            this.ctx.moveTo(this.shapeList[0][0], this.shapeList[0][1]);
            this.ctx.lineTo(x, y);
            this.ctx.stroke();
        }
    };
    return DrawingBoard;
}());
