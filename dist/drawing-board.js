(function(_g){(function(f){if(typeof exports==='object'&&typeof module!=='undefined'){module.exports=f()}else if(typeof define==='function'&&define.amd){define([],f.bind(_g))}else{f()}})(function(define,module,exports){var _m =(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
'use strict';
exports.__esModule = true;
var Point_1 = require("./tools/Point");
var Line_1 = require("./tools/Line");
var Pencil_1 = require("./tools/Pencil");
var Eraser_1 = require("./tools/Eraser");
var Rect_1 = require("./tools/Rect");
var Text_1 = require("./tools/Text");
var Ellipse_1 = require("./tools/Ellipse");
;
var defaultArgs = {
    currentTool: 'pencil',
    size: 5,
    color: 'black',
    zoom: 1
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
        this.redoShapeList = [];
        this.origin = { x: 0, y: 0 };
        this.zoomFator = 1;
        this.dash = false;
        this.el = el;
        this.ctx = el.getContext('2d');
        this.currentTool = options.currentTool;
        this.size = options.size;
        this.color = options.color;
        this.fillColor = options.fillColor;
        this.zoomFator = options.zoom;
        this.redraw();
        el.addEventListener('mousedown', function (ev) {
            var x = Math.round(ev.offsetX / _this_1.zoomFator - _this_1.origin.x);
            var y = Math.round(ev.offsetY / _this_1.zoomFator - _this_1.origin.y);
            _this_1.drawStart(x, y);
        }, false);
        el.addEventListener('mousemove', function (ev) {
            var x = Math.round(ev.offsetX / _this_1.zoomFator - _this_1.origin.x);
            var y = Math.round(ev.offsetY / _this_1.zoomFator - _this_1.origin.y);
            _this_1.drawing(x, y);
        }, false);
        document.addEventListener('mouseup', this.drawEnd.bind(this), false);
    }
    DrawingBoard.prototype.setTool = function (tool) {
        if (tool === void 0) { tool = 'pencil'; }
        this.currentTool = tool;
    };
    DrawingBoard.prototype.setSize = function (size) {
        if (size === void 0) { size = 5; }
        this.size = size / this.zoomFator;
    };
    DrawingBoard.prototype.setColor = function (color) {
        if (color === void 0) { color = 'black'; }
        this.color = color;
    };
    DrawingBoard.prototype.setFillColor = function (color) {
        this.fillColor = color;
    };
    DrawingBoard.prototype.redo = function () {
        var shape = this.shapeList.pop();
        if (!shape)
            return;
        var shapes = [shape];
        this.redoShapeList.push(shapes);
        this.redraw();
    };
    DrawingBoard.prototype.undo = function () {
        var shapes = this.redoShapeList.pop();
        if (!shapes)
            return;
        this.shapeList = this.shapeList.concat(shapes);
        this.redraw();
    };
    DrawingBoard.prototype.clear = function () {
        this.redoShapeList.push(this.shapeList);
        this.shapeList = [];
        this.redraw();
    };
    DrawingBoard.prototype.zoom = function (zoom) {
        if (!zoom || (zoom <= 0 && zoom > 2) || this.zoomFator === zoom)
            return;
        this.ctx.scale(1 / this.zoomFator, 1 / this.zoomFator);
        this.size *= this.zoomFator / zoom;
        this.origin = Object.assign({}, {
            x: this.origin.x * this.zoomFator / zoom,
            y: this.origin.y * this.zoomFator / zoom
        });
        this.zoomFator = zoom;
        this.ctx.scale(this.zoomFator, this.zoomFator);
        this.redraw();
    };
    DrawingBoard.prototype.move = function (origin) {
        this.ctx.translate(-this.origin.x, -this.origin.y);
        this.origin = Object.assign({}, origin);
        this.ctx.translate(this.origin.x, this.origin.y);
        this.redraw();
    };
    DrawingBoard.prototype.createTxtInput = function (start) {
        if (this.txtInput)
            return;
        this.txtInput = document.createElement('textarea');
        this.txtInput.style.position = 'absolute';
        this.txtInput.style.left = Math.round((start.x + this.origin.x) * this.zoomFator) + 'px';
        this.txtInput.style.top = Math.round((start.y + this.origin.y - start.size) * this.zoomFator) + 'px';
        this.txtInput.style.padding = '0';
        this.txtInput.style.fontSize = start.size + 'px';
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
                    _this.shapeList.push(new Text_1["default"](_this.ctx, start, text));
                }
            }
            _this.txtInput.addEventListener('blur', onBlur, false);
            clearTimeout(timer);
        }, 30);
    };
    DrawingBoard.prototype.redraw = function () {
        this.ctx.clearRect(-this.origin.x, -this.origin.y, this.el.width / this.zoomFator, this.el.height / this.zoomFator);
        this.shapeList.forEach(function (shape) {
            shape.draw();
        });
    };
    DrawingBoard.prototype.drawStart = function (x, y) {
        this.isDrawing = true;
        this.pointList.push(new Point_1["default"](x, y, this.size, this.color));
        if (this.currentTool !== 'move') {
            this.redoShapeList = [];
        }
        if (this.currentTool === 'text') {
            this.createTxtInput(this.pointList[this.pointList.length - 1]);
        }
    };
    DrawingBoard.prototype.drawing = function (x, y) {
        if (!this.isDrawing)
            return;
        var start = this.pointList[0];
        var end = new Point_1["default"](x, y, this.size, this.color);
        if (start.x === end.x && start.y === end.y)
            return;
        this.currentTool !== 'move' && this.redraw();
        this.pointList.push(end);
        if (this.currentTool === 'pencil') {
            this.shape = new Pencil_1["default"](this.ctx, this.pointList);
        }
        else if (this.currentTool === 'eraser') {
            this.shape = new Eraser_1["default"](this.ctx, this.pointList);
        }
        else if (this.currentTool === 'line') {
            this.shape = new Line_1["default"](this.ctx, start, end, this.dash);
        }
        else if (this.currentTool === 'rect') {
            this.shape = new Rect_1["default"](this.ctx, start, x - start.x, y - start.y, this.fillColor);
        }
        else if (this.currentTool === 'ellipse') {
            this.shape = new Ellipse_1["default"](this.ctx, start, end, this.fillColor);
        }
        else if (this.currentTool === 'move') {
            this.move({ x: this.origin.x + x - start.x, y: this.origin.y + y - start.y });
        }
    };
    DrawingBoard.prototype.drawEnd = function () {
        if (!this.isDrawing)
            return;
        this.shape && this.shapeList.push(this.shape);
        this.pointList = [];
        this.isDrawing = false;
        this.shape = null;
        console.log(this.shapeList);
    };
    return DrawingBoard;
}());
module.exports = DrawingBoard;

},{"./tools/Ellipse":2,"./tools/Eraser":3,"./tools/Line":4,"./tools/Pencil":5,"./tools/Point":6,"./tools/Rect":7,"./tools/Text":8}],2:[function(require,module,exports){
'use strict';
exports.__esModule = true;
var Ellipse = /** @class */ (function () {
    function Ellipse(ctx, start, end, bgColor) {
        this.ctx = ctx;
        this.start = start;
        this.end = end;
        this.bgColor = bgColor;
        this.draw();
    }
    Ellipse.prototype.draw = function () {
        var x = (this.end.x + this.start.x) / 2;
        var y = (this.end.y + this.start.y) / 2;
        // const a = Math.sqrt(Math.pow((this.end.x - this.start.x), 2) + Math.pow((this.end.y - this.start.y), 2)) / 2
        // const b = ((this.end.y - this.start.y) / (this.end.x - this.start.x)) * a
        // const rotation = Math.atan(b / a)
        var a = Math.abs(this.end.x - this.start.x) / 2;
        var b = Math.abs(this.end.y - this.start.y) / 2;
        this.ctx.beginPath();
        this.ctx.save();
        this.ctx.translate(x, y);
        this.ctx.rotate(0);
        this.ctx.scale(a, b);
        this.ctx.arc(0, 0, 1, 0, 2 * Math.PI, true);
        this.ctx.restore();
        if (this.bgColor) {
            this.ctx.fillStyle = this.bgColor;
            this.ctx.fill();
        }
        this.ctx.lineWidth = this.end.size;
        this.ctx.strokeStyle = this.end.color;
        this.ctx.stroke();
    };
    return Ellipse;
}());
exports["default"] = Ellipse;

},{}],3:[function(require,module,exports){
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
exports.__esModule = true;
var Pencil_1 = require("./Pencil");
var Eraser = /** @class */ (function (_super) {
    __extends(Eraser, _super);
    function Eraser(ctx, PointList) {
        var _this = _super.call(this, ctx, PointList) || this;
        _this.draw();
        return _this;
    }
    Eraser.prototype.draw = function () {
        this.ctx.globalCompositeOperation = 'destination-out';
        _super.prototype.draw.call(this);
        this.ctx.globalCompositeOperation = 'source-over';
    };
    return Eraser;
}(Pencil_1["default"]));
exports["default"] = Eraser;

},{"./Pencil":5}],4:[function(require,module,exports){
'use strict';
exports.__esModule = true;
var Line = /** @class */ (function () {
    function Line(ctx, start, end, dash) {
        this.segments = [15, 5];
        this.ctx = ctx;
        this.start = start;
        this.end = end;
        this.dash = dash;
        this.draw();
    }
    Line.prototype.draw = function () {
        this.ctx.beginPath();
        this.ctx.setLineDash(this.dash ? this.segments : []);
        this.ctx.moveTo(this.start.x, this.start.y);
        this.ctx.lineTo(this.end.x, this.end.y);
        this.ctx.lineWidth = this.end.size;
        this.ctx.strokeStyle = this.end.color;
        this.ctx.stroke();
    };
    return Line;
}());
exports["default"] = Line;

},{}],5:[function(require,module,exports){
'use strict';
exports.__esModule = true;
var Line_1 = require("./Line");
var Pencil = /** @class */ (function () {
    function Pencil(ctx, PointList) {
        this.ctx = ctx;
        this.PointList = PointList;
        this.draw();
    }
    Pencil.prototype.draw = function () {
        var _this = this;
        this.ctx.lineCap = 'round';
        this.PointList.forEach(function (point, index) {
            var lastPoint = _this.PointList[index - 1];
            lastPoint && new Line_1["default"](_this.ctx, lastPoint, point);
        });
        this.ctx.lineCap = 'butt';
    };
    return Pencil;
}());
exports["default"] = Pencil;

},{"./Line":4}],6:[function(require,module,exports){
'use strict';
exports.__esModule = true;
var Point = /** @class */ (function () {
    function Point(x, y, size, color) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.color = color;
    }
    return Point;
}());
exports["default"] = Point;

},{}],7:[function(require,module,exports){
'use strict';
exports.__esModule = true;
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
exports["default"] = Rect;

},{}],8:[function(require,module,exports){
'use strict';
exports.__esModule = true;
var Text = /** @class */ (function () {
    function Text(ctx, start, text) {
        this.ctx = ctx;
        this.start = start;
        this.text = text;
        this.draw();
    }
    Text.prototype.draw = function () {
        this.ctx.font = this.start.size + 'px serif';
        this.ctx.fillStyle = this.start.color;
        this.ctx.fillText(this.text, this.start.x, this.start.y);
    };
    return Text;
}());
exports["default"] = Text;

},{}]},{},[1]);
var _r=_m(1);_g.DrawingBoard=_r;return _r;})})(typeof window!=='undefined'?window:(typeof global!=='undefined'?global:(typeof self!=='undefined'?self:this)));