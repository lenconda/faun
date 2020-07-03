export interface IStore {
  set: (key: string|object, value: any) => void;
  get: (key: string) => any;
  on: (key: string, callback: () => any) => () => any;
}
