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
  IFaunInstanceProps,
} from '../../interfaces';

export const install = async (Faun: FaunType, props: IFaunInstanceProps) => {
  const errorHandler = props.appConfig.onError || undefined;
  const storeNamespace = '__FAUN_STORE__';

  let store: Store = getGlobalObject(storeNamespace);

  if (!store) {
    store = new Store(errorHandler);
    setGlobalObject(storeNamespace, store);
  }

  Faun.prototype.store = store;
};

export default {
  install,
};
