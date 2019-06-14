# drawingBoard
The goal is to implement a canvas drawing board library with Javascript

## Use
```
  <div class="drawing-board-box">
    <canvas id="board" width="500" height="300"></canvas>
  </div>
  ...

  var oBoard = document.getElementById('board');
  new DrawingBoard(oBoard, options?);
```

## Options
| Param         | type          | Available value |
| ------------- | ------------- | ------------- |
| currentTool   | string        | 'pencil', 'text', 'rect', 'line', 'eraser'  |
| size          | number        | 1,2,3,... |
| color         | string        | something like that: '#000' or 'black' or 'rgb(0, 0, 0)' |
| fillColor     | string        |  |

## Tools
- [x] Pencil
- [x] Line
- [x] Eraser
- [x] Rect
- [x] Text
- [x] Ellipse
- [ ] Image
- [ ] ...

## Methods
- [x] setTool
- [x] setSize
- [x] setColor
- [x] setFillColoe
- [x] redo
- [x] undo
- [ ] clear
- [ ] zoom
- [ ] ...

## Demo
Please click [here](./index.html)

![demo](./demo.gif)

## License

MIT
