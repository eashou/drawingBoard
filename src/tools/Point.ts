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

export default Point;
