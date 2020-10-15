/**
 * @file css.js
 */

import parse from 'css/lib/parse';
import Compressed from 'css/lib/stringify/compress';
import Identity from 'css/lib/stringify/identity';
import {
  StringifyOptions,
  Rule,
} from 'css';

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
const stringify = (
  node: Node,
  options: StringifyOptions = {},
): string => {
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
const css = (
  input: string,
  prefix: string,
  excludes: Array<string> = [],
) => {
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

  const excludeSelector = (selector: string, excludeArr: Array<string | RegExp>) => {
    return excludeArr.some(excludeRule => {
      if (excludeRule instanceof RegExp) {
        return excludeRule.test(selector);
      }

      return selector === excludeRule;
    });
  }

  parsedStyleRules.stylesheet.rules.forEach((rule: Rule) => {
    if (rule.type !== 'rule') {
      return rule;
    }

    if (rule.parent && keyframeRules.includes(rule.parent.type || '')) {
      return rule;
    }

    rule.selectors = rule?.selectors?.map((selector: string) => {
      if (
        excludeSelector(selector, ['html', 'body', '*', ...excludes])
        || selector.startsWith(`#${prefix}`)
        || selector.indexOf(`#${prefix}`) !== -1
      ) {
        return selector;
      }

      return '#' + prefixWithSpace + selector;
    });
    return rule;
  });

  const result = stringify(parsedStyleRules);

  return result;
};

export default css;
