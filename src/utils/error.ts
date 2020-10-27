import {
  FaunErrorHandlerType,
} from '../interfaces';

export const generateErrorHandler = (
  errorHandler?: FaunErrorHandlerType,
): FaunErrorHandlerType => {
  if (errorHandler && typeof errorHandler === 'function') {
    return errorHandler;
  } else {
    return error => {
      throw error;
    };
  }
};
