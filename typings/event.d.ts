export interface IEvent {
  emit: (key: string, data: any) => any;
  on: (key: string, callback: () => any)  => () => any;
  off: (key: string, callback: () => any) => () => any;
  has: (key: string) => boolean;
}
