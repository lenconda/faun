/**
 * @file index.js
 * @author lenconda<i@lenconda.top>
 */

import Store from '../../store';
import {
  setGlobalObject,
  getGlobalObject,
} from '../../utils/global-namespace';
import {
  FaunType,
} from '../../interfaces';

const storeNamespace = '__FAUN_STORE__';

let store = getGlobalObject(storeNamespace);

if (!store) {
  store = new Store();
  setGlobalObject(storeNamespace, store);
}

export const install = async (Faun: FaunType) => {
  Faun.prototype.store = store;
};

export default {
  install,
};
