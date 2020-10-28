import {
  FaunErrorHandlerType,
} from '../interfaces';
import {
  FaunError,
} from '../errors';

export const emitError = (
  message: string,
  CurrentError: typeof FaunError,
  handler?: FaunErrorHandlerType,
) => {
  let errorHandler: FaunErrorHandlerType;

  if (handler && typeof handler === 'function') {
    errorHandler = handler;
  } else {
    errorHandler = (error: FaunError) => {
      throw error;
    };
  }

  const error = new CurrentError(message);
  errorHandler(error);
};
