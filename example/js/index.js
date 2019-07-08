
var oBoard = document.getElementById('board');
var db = new DrawingBoard(oBoard);

var zoomFator = 10;
function zoom (bOk) {
  bOk ? zoomFator++ : zoomFator--;
  zoomFator = zoomFator < 1 ? 1 : zoomFator >= 20 ? 20 : zoomFator;
  db.zoom(zoomFator / 10);
}


var aTools = document.getElementsByTagName('li');
for (var index = 0; index < aTools.length; index++) {
  (function (i) {
    var currTool = aTools[i];
    currTool.addEventListener('click', function () {
      for (var index = 0; index < aTools.length; index++) {
        aTools[index].className = 'tool';
      }
      currTool.className = 'tool active';
    }, false);
  })(index);
}