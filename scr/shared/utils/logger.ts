import { createLogger, format, transports } from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';

const logger = createLogger({
  level: 'error',
  format: format.combine(
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    format.json() // Save logs in JSON format
  ),
  transports: [
    new DailyRotateFile({
      filename: 'logs/error-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      maxFiles: '14d', // Keep logs for the last 14 days
      zippedArchive: true, // Compress old log files
    }),
  ],
});

export default logger;
