import createElement from './utils/create-element';

function appendCssLinks(css, parent) {
  if (!Array.isArray(css) || !(parent instanceof HTMLElement)) {
    return;
  }

  css.forEach(href => {
    if (href && !!href.length && !document.querySelector(`[href='${href}']`)) {
      parent.appendChild(createElement('link', { href, rel: 'stylesheet' }));
    }
  });
};

export {
  appendCssLinks,
};
