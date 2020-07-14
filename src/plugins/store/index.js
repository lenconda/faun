/**
 * @file index.js
 * @author lenconda<i@lenconda.top>
 */

import Store from '../../store';
import { setGlobalObject, getGlobalObject } from '../../utils/global-namespace';

const storeNamespace = '@@__POLYATOMIC_STORE__';

let store = getGlobalObject(storeNamespace);

if (!store) {
  store = new Store();
  setGlobalObject(storeNamespace, store);
}

export const install = async function(Faun) {
  Faun.prototype.store = store;
};

export default {
  install,
};
