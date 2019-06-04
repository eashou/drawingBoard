'use strict';
var DrawingBoard = /** @class */ (function () {
    function DrawingBoard(el) {
        var _this = this;
        this.isDrawing = false;
        this.shapeList = [];
        this.ctx = el.getContext('2d');
        el.addEventListener('mousedown', function (ev) {
            _this.drawStart(ev.offsetX, ev.offsetY);
        }, false);
        el.addEventListener('mousemove', function (ev) {
            _this.drawing(ev.offsetX, ev.offsetY);
        }, false);
        el.addEventListener('mouseup', this.drawEnd.bind(this), false);
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
    return DrawingBoard;
}());
