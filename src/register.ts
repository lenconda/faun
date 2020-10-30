/**
 * @file /src/register.ts
 * @author lenconda<i@lenconda.top>
 */
import {
  IFaunInstanceProps,
  FaunType,
  SubApplicationsType,
  IFaunLifecycleHooks,
} from './interfaces';

/**
 * register sub-applications, context is `props` in constructor
 * @param subApplicationConfigMap
 * @param hooks
 * @returns any
 */
const register = (
  props: IFaunInstanceProps,
  context: FaunType,
  subApplicationConfigMap: SubApplicationsType,
  hooks?: IFaunLifecycleHooks,
) => {
  // only accept Object and NOT Array
  if (!Array.isArray(subApplicationConfigMap)) {
    return context;
  }

  if (hooks && typeof hooks === 'object') {
    Object.keys(hooks).forEach(currentHookName => {
      props.hooks[currentHookName] = hooks[currentHookName];
    });
  }

  // assign sub-application configs to context
  props.registeredSubApplications = Array.from(subApplicationConfigMap || []);
  return;
};

export default register;
