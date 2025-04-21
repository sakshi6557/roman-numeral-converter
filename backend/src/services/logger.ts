/**
 * Logger service with environment-specific configurations.
 * Development: Shows all logs including debug
 * Production: Shows only error, warn, and info logs in a production-friendly format
 * 
 * @module logger
 */

// Environment check
const isDevelopment = process.env.NODE_ENV === 'development';
const isProduction = process.env.NODE_ENV === 'production';
const logLevel = process.env.LOG_LEVEL || (isDevelopment ? 'debug' : 'info');

// Get current timestamp
const getTimestamp = (): string => new Date().toISOString();

// Create logger object
const logger = {
  error: (message: string, ...args: unknown[]): void => {
    const logMessage = isProduction
      ? JSON.stringify({
          timestamp: getTimestamp(),
          level: 'error',
          message,
          ...(args.length > 0 ? { details: args } : {})
        })
      : `[${getTimestamp()}] ERROR: ${message} ${args.length > 0 ? JSON.stringify(args) : ''}`;
    
    console.error(logMessage);
  },

  warn: (message: string, ...args: unknown[]): void => {
    if (['error', 'warn', 'info', 'debug'].includes(logLevel)) {
      const logMessage = isProduction
        ? JSON.stringify({
            timestamp: getTimestamp(),
            level: 'warn',
            message,
            ...(args.length > 0 ? { details: args } : {})
          })
        : `[${getTimestamp()}] WARN: ${message} ${args.length > 0 ? JSON.stringify(args) : ''}`;
      
      console.warn(logMessage);
    }
  },

  info: (message: string, ...args: unknown[]): void => {
    if (['info', 'debug'].includes(logLevel)) {
      const logMessage = isProduction
        ? JSON.stringify({
            timestamp: getTimestamp(),
            level: 'info',
            message,
            ...(args.length > 0 ? { details: args } : {})
          })
        : `[${getTimestamp()}] INFO: ${message} ${args.length > 0 ? JSON.stringify(args) : ''}`;
      
      console.info(logMessage);
    }
  },

  debug: (message: string, ...args: unknown[]): void => {
    if (logLevel === 'debug') {
      console.debug(`[${getTimestamp()}] DEBUG: ${message} ${args.length > 0 ? JSON.stringify(args) : ''}`);
    }
  }
};

// Log startup message
logger.info(`Logger initialized in ${isProduction ? 'production' : 'development'} mode with log level ${logLevel}`);

export default logger; 