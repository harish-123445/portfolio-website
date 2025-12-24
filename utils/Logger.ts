
type LogLevel = 'INFO' | 'WARN' | 'ERROR' | 'DEBUG';

class Logger {
  private static formatMessage(level: LogLevel, message: string, data?: any) {
    const timestamp = new Date().toISOString();
    return {
      timestamp,
      level,
      message,
      data: data || null
    };
  }

  static info(message: string, data?: any) {
    const logEntry = this.formatMessage('INFO', message, data);
    console.log(`%c[INFO] ${logEntry.timestamp}: ${message}`, 'color: #2563eb; font-weight: bold;', data || '');
    // In a real app, you would send 'logEntry' to an external service (e.g., Sentry, Datadog)
  }

  static warn(message: string, data?: any) {
    const logEntry = this.formatMessage('WARN', message, data);
    console.warn(`%c[WARN] ${logEntry.timestamp}: ${message}`, 'color: #d97706; font-weight: bold;', data || '');
  }

  static error(message: string, error?: any) {
    const logEntry = this.formatMessage('ERROR', message, error);
    console.error(`%c[ERROR] ${logEntry.timestamp}: ${message}`, 'color: #dc2626; font-weight: bold;', error || '');
  }

  static debug(message: string, data?: any) {
    if (process.env.NODE_ENV === 'development') {
        const logEntry = this.formatMessage('DEBUG', message, data);
        console.debug(`%c[DEBUG] ${logEntry.timestamp}: ${message}`, 'color: #9333ea;', data || '');
    }
  }
}

export default Logger;
