
export interface DefaultLogger {
  info: (log: string) => void;
  error: (log: string) => void;
  debug: (log: string) => void;
}

const defaultLogger: DefaultLogger = {
  info(log: string) {

  },

  error(log: string) {

  },

  debug(log: string) {

  }
}
export default defaultLogger;