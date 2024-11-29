type Writeable<T> = { -readonly [P in keyof T]-?: T[P] };

declare module '!worker-loader!*' {
  class WebpackWorker extends Worker {
    constructor();
  }

  // eslint-disable-next-line import/no-default-export
  export default WebpackWorker;
}
