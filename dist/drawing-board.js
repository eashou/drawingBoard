'use strict';
;
var defaultArgs = {
    currentTool: 'pan'
};
var DrawingBoard = /** @class */ (function () {
    function DrawingBoard(el, options) {
        var _this = this;
        if (options === void 0) { options = defaultArgs; }
        this.el = null;
        this.isDrawing = false;
        this.shapeList = [];
        this.currentTool = 'pan';
        this.txtInput = null;
        this.el = el;
        this.ctx = el.getContext('2d');
        this.currentTool = options.currentTool;
        el.addEventListener('mousedown', function (ev) {
            if (_this.currentTool === 'pan') {
                _this.drawStart(ev.offsetX, ev.offsetY);
            }
            else if (_this.currentTool === 'text') {
                _this.text(ev.offsetX, ev.offsetY);
            }
        }, false);
        el.addEventListener('mousemove', function (ev) {
            _this.drawing(ev.offsetX, ev.offsetY);
        }, false);
        document.addEventListener('mouseup', function () {
            if (_this.currentTool === 'pan') {
                _this.drawEnd();
            }
            else if (_this.currentTool === 'text') {
            }
        }, false);
    }
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
    return DrawingBoard;
}());
