/**
 * @file /src/index.ts
 * @author lenconda<i@lenconda.top>
 */

import Faun, { use, history } from './faun';
import {
  FaunError,
  FaunDependencyError,
  FaunLifecycleError,
  FaunPluginError,
} from './errors';
import {
  FaunStoreError,
} from './store';

export * from './interfaces';
export {
  use,
  history,
  FaunError,
  FaunDependencyError,
  FaunLifecycleError,
  FaunPluginError,
  FaunStoreError,
};
export default Faun;
