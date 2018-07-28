
import * as winston from 'winston';

export interface DefaultLogger {
  info: (log: string) => void;
  error: (log: string) => void;
  debug: (log: string) => void;
}

const winstonLogger = winston.createLogger({
  format: winston.format.cli(),
  transports: [new winston.transports.Console()]
});

const defaultLogger: DefaultLogger = {
  info: winstonLogger.info,
  error: winstonLogger.error,
  debug: winstonLogger.debug
};
export default defaultLogger;