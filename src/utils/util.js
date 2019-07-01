
function getStyle (obj, name) {
  return (obj.currentStyle || window.getComputedStyle(obj, false))[name]
}

module.exports = {
  getStyle
};
