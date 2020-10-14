/**
 * @file /src/overwrites/child-operate.ts
 * @author lenconda<i@lenconda.top>
 */

import {
  ChildNodeOperatorProcessorType,
  ChildNodeOperatorType,
} from '../interfaces';

/**
 * get node name
 * @param {Node} node
 */
const getNodeName = (node: Node): string => {
  return node.nodeName && node.nodeName.toLowerCase() || '';
}

/**
 * get processed element using processor
 * @param {Element} element
 * @param {Function} processor
 */
const getResultElement = (
  element: Node,
  processor: ChildNodeOperatorProcessorType,
): Node => {
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
 * process a collection of elements or DOM Strings
 * @param {...Array} collection
 * @param {Function} processor
 */
const mapHTMLCollection = (
  collection: IArguments,
  processor: ChildNodeOperatorProcessorType,
) => {
  const args = Array.from(collection);
  const results = args.map(arg => {
    if (arg instanceof Node) {
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

  const overwriteAppendChild = (callback: ChildNodeOperatorProcessorType) => {
    Element.prototype.appendChild = function(element) {
      return appendChild.call(this, getResultElement(element, callback));
    };
  }

  const overwriteInsertBefore = (callback: ChildNodeOperatorProcessorType) => {
    Element.prototype.insertBefore = function(newChild, refChild) {
      return insertBefore.call(this, getResultElement(newChild, callback), refChild);
    };
  }

  const overwriteAppend = (callback: ChildNodeOperatorProcessorType) => {
    if (!append) {
      return;
    }

    Element.prototype.append = function() {
      const results = mapHTMLCollection(arguments, callback);
      return append.call(this, ...results);
    };
  }

  const overwritePrepend = (callback: ChildNodeOperatorProcessorType) => {
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
    intercept(callback: ChildNodeOperatorProcessorType) {
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
  } as ChildNodeOperatorType;
}
