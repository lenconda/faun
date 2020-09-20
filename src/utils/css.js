/**
 * @file css.js
 */

import parse from 'css/lib/parse';

import Compressed from 'css/lib/stringify/compress';
import Identity from 'css/lib/stringify/identity';

/**
 * Stringfy the given AST `node`.
 *
 * Options:
 *
 *  - `compress` space-optimized output
 *  - `sourcemap` return an object with `.code` and `.map`
 *
 * @param {Object} node
 * @param {Object} [options]
 * @return {String}
 * @api public
 */
function stringify(node, options = {}) {
  const compiler = options.compress
    ? new Compressed(options)
    : new Identity(options);

  const code = compiler.compile(node);
  return code;
};

/**
 * add prefix to css string
 * @param {string} input
 * @param {string} prefix
 */
export default function(input, prefix, excludes = []) {
  if (!input) {
    return '';
  }

  if (!prefix) {
    return input;
  }

  const parsedStyleRules = parse(input);
  const prefixWithSpace = /\s+$/.test(prefix) ? prefix : `${prefix} `;
  const keyframeRules = [
    'keyframes',
    '-webkit-keyframes',
    '-moz-keyframes',
    '-o-keyframes',
  ];

  function excludeSelector(selector, excludeArr) {
    return excludeArr.some(excludeRule => {
      if (excludeRule instanceof RegExp) {
        return excludeRule.test(selector);
      }

      return selector === excludeRule;
    });
  }

  parsedStyleRules.stylesheet.rules.forEach(rule => {
    if (rule.type !== 'rule') {
      return rule;
    }

    if (rule.parent && keyframeRules.includes(rule.parent.type)) {
      return rule;
    }

    rule.selectors = rule.selectors.map(selector => {
      if (excludeSelector(selector, ['html', 'body', '*', ...excludes]) || selector.startsWith(`.${prefix}`)) {
        return selector;
      }

      return '.' + prefixWithSpace + selector;
    });
  });

  const result = stringify(parsedStyleRules);

  return result;
};
