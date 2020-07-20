/**
 * @file append-child.js
 * @author lenconda<i@lenconda.top>
 */

export default function() {
  const appendChild = Element.prototype.appendChild;

  return {
    /**
     * callback for new element
     * @param {Function} callback
     */
    intercept(callback) {
      Element.prototype.appendChild = function(element) {
        const nodeName = element.nodeName.toLowerCase();
        if (/^script$|^link$/.test(nodeName)) {
          const newElement = callback && typeof callback === 'function' && callback(element);
          if (newElement) {
            return appendChild.call(this, newElement);
          }
        }
        return appendChild.call(this, element);
      };
    },

    stop() {
      Element.prototype.appendChild = appendChild;
    },
  };
}
