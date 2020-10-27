/**
 * @file /src/errors.ts
 * @author lenconda<i@lenconda.top>
 */

export class FaunError extends Error {
  constructor(message: string) {
    super();
    this.message = `[faun] ${message}`;
  }
}

export class FaunPluginError extends FaunError {}

export class FaunLifecycleError extends FaunError {}

export class FaunDependencyError extends FaunError {}
