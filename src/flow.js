function mountAssets(assets, parent) {
  if (!Array.isArray(assets) || !(parent instanceof HTMLElement)) {
    return;
  }

  assets.forEach(asset => {
    if (asset instanceof HTMLElement) {
      parent.appendChild(asset);
    }
  });
}

function removeAssets(assets) {
  if (!Array.isArray(assets) || !(parent instanceof HTMLElement)) {
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
