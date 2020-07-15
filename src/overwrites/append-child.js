/**
 * @file append-child.js
 * @author lenconda<i@lenconda.top>
 */

export default function() {
  const appendChild = Element.prototype.appendChild;

  return {
    overwriteAppendChild(domSnapshot) {
      Element.prototype.appendChild = function(element) {
        const nodeName = element.nodeName;
        if (/^STYLE$|^SCRIPT$|^LINK$/.test(nodeName)) {
          domSnapshot && domSnapshot.push(element);
        }
        return appendChild.call(this, element);
      };
    },

    restoreAppendChild() {
      Element.prototype.appendChild = appendChild;
    },
  };
}
