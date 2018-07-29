
import * as util from 'util';
import * as winston from 'winston';

export interface DefaultLogger {
  info: (log: string | {}) => void;
  error: (log: string | {}) => void;
  debug: (log: string | {}) => void;
}

const winstonLogger = winston.createLogger({
  format: winston.format.cli(),
  transports: [new winston.transports.Console()]
});

function _generatePayload(logPayload: string | {}) {
  if (util.isObject(logPayload) === true) {
    return JSON.stringify(logPayload);
  }
  return logPayload;
}

const defaultLogger: DefaultLogger = {
  info: (log: string | {}) => winstonLogger.info(_generatePayload(log)),
  error: (log: string | {}) => winstonLogger.error(_generatePayload(log)),
  debug: (log: string | {}) => winstonLogger.debug(_generatePayload(log)),
};
export default defaultLogger;