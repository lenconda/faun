const NAMESPACE = 'POLYATOMIC';

export const setGlobalObject = (key, value) => {
  if (!window[NAMESPACE]) {
    window[NAMESPACE] = {};
  }

  window[NAMESPACE][key] = value;
};

export const getGlobalObject = key => {
  const polyatomic = window[NAMESPACE];
  return polyatomic && polyatomic[key] ? polyatomic[key] : null;
};
