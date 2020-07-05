/**
 * @file css.js
 */

import postcss from 'postcss';
import prefixer from 'postcss-prefix-selector';

/**
 * add prefix to css string
 * @param {string} input
 * @param {string} prefix
 */
export default function(input, prefix) {
  if (!input) {
    return '';
  }

  if (!prefix) {
    return input;
  }

  return postcss().use(prefixer({
    prefix: `.${prefix}`,
    exclude: ['html'],
  })).process(input).css;
};
