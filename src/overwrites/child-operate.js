/**
 * @file append-child.js
 * @author lenconda<i@lenconda.top>
 */

/**
 * get node name
 * @param {Node} node
 */
function getNodeName(node) {
  return node.nodeName && node.nodeName.toLowerCase() || '';
}

/**
 * get processed element using processor
 * @param {Element} element
 * @param {Function} processor
 */
function getResultElement(element, processor) {
  const nodeName = getNodeName(element);
  if (/^script$|^link$/.test(nodeName)) {
    const result = processor && typeof processor === 'function' && processor(element);
    if (result) {
      return result;
    }
    return element;
  }
  return element;
}

/**
 * process a collection of elements or DOMStrings
 * @param {...Array} collection
 * @param {Function} processor
 */
function mapHTMLCollection(collection, processor) {
  const args = Array.from(collection);
  const results = args.map(arg => {
    if (arg instanceof Element) {
      return getResultElement(arg, processor);
    }
    return arg;
  });
  return results;
}

export default function() {
  const appendChild = Element.prototype.appendChild;
  const insertBefore = Element.prototype.insertBefore;
  const append = Element.prototype.append;
  const prepend = Element.prototype.prepend;

  function overwriteAppendChild(callback) {
    Element.prototype.appendChild = function(element) {
      return appendChild.call(this, getResultElement(element, callback));
    };
  }

  function overwriteInsertBefore(callback) {
    Element.prototype.insertBefore = function(newChild, refChild) {
      return insertBefore.call(this, getResultElement(newChild, callback), refChild);
    };
  }

  function overwriteAppend(callback) {
    if (!append) {
      return;
    }

    Element.prototype.append = function() {
      const results = mapHTMLCollection(arguments, callback);
      return append.call(this, ...results);
    };
  }

  function overwritePrepend(callback) {
    if (!prepend) {
      return;
    }

    Element.prototype.prepend = function() {
      const results = mapHTMLCollection(arguments, callback);
      return prepend.call(this, ...results);
    };
  }

  return {
    /**
     * callback for new element
     * @param {Function} callback
     */
    intercept(callback) {
      overwriteAppendChild(callback);
      overwriteInsertBefore(callback);
      overwriteAppend(callback);
      overwritePrepend(callback);
    },

    stop() {
      Element.prototype.appendChild = appendChild;
      Element.prototype.insertBefore = insertBefore;
      Element.prototype.append = append;
      Element.prototype.prepend = prepend;
    },
  };
}
