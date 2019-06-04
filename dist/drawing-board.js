'use strict';
var DrawingBoard = /** @class */ (function () {
    function DrawingBoard(el) {
        this.ctx = el.getContext('2d');
    }
    DrawingBoard.prototype.getCtx = function () {
        return this.ctx;
    };
    return DrawingBoard;
}());
