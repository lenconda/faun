/**
 * @file append-child.js
 * @author lenconda<i@lenconda.top>
 */

export default function() {
  window.__APPEND_CHILD__ = Element.prototype.appendChild;
  Element.prototype.appendChild = function(element) {
    const childNodes = Array.prototype.slice.call(this.childNodes);
    if (childNodes.find(node => element.isEqualNode(node))) {
      return;
    };
    return window.__APPEND_CHILD__.call(this, element);
  };
}
