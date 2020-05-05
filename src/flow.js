function mountAssets(assets, parent) {
  if (!Array.isArray(assets) || !(parent instanceof HTMLElement)) {
    return;
  }

  assets.forEach(asset => {
    if (
      asset instanceof HTMLElement
      && !document.querySelector(`[href='${asset.getAttribute('href')}]'`)
      && !document.querySelector(`[src='${asset.getAttribute('src')}]'`)
    ) {
      parent.appendChild(asset);
    }
  });
}

function removeAssets(assets) {
  if (!Array.isArray(assets)) {
    return;
  }

  assets.forEach(asset => {
    if (asset instanceof HTMLElement) {
      asset.remove();
    }
  });
}

export {
  mountAssets,
  removeAssets,
};
