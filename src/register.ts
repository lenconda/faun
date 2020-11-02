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
import {
  emitError,
} from './utils/error';
import {
  FaunParseError,
} from './errors';

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

  const subApplicationConfigs = Array.from(subApplicationConfigMap);
  const cachedSubApplicationNames: string[] = [];
  for (let subApplicationConfig of subApplicationConfigs) {
    const { name = '', useCSSPrefix = false } = subApplicationConfig;
    const onError = props.appConfig.onError || undefined;
    if (cachedSubApplicationNames.indexOf(name) !== -1) {
      return emitError(
        'Param `name` of sub-application must be unique',
        FaunParseError,
        onError,
      );
    }

    cachedSubApplicationNames.push(name);

    if (!name && useCSSPrefix) {
      return emitError(
        'Param `name` must be specified when `useCSSPrefix` is set to `true`',
        FaunParseError,
        onError,
      );
    }
  }
  // assign sub-application configs to context
  props.registeredSubApplications = Array.from(subApplicationConfigs || []);
  return;
};

export default register;
