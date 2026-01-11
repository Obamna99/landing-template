/**
 * Comprehensive logger class for the CRM Etsy Management application
 * Provides structured logging with context, timestamps, and log levels
 */

type LogLevel = "debug" | "info" | "warn" | "error" | "critical"

interface LogContext {
  module?: string
  userId?: number
  candidateId?: number
  documentId?: number
  taskId?: number
  action?: string
  [key: string]: any
}

interface LogEntry {
  timestamp: string
  level: LogLevel
  message: string
  context?: LogContext
  error?: Error | unknown
  environment: string
}

class Logger {
  private module: string
  private isDevelopment: boolean
  private isClient: boolean

  constructor(module: string = "App") {
    this.module = module
    this.isDevelopment = process.env.NODE_ENV === "development"
    this.isClient = typeof window !== "undefined"
  }

  /**
   * Create a child logger with a specific module name
   */
  child(module: string): Logger {
    return new Logger(`${this.module}:${module}`)
  }

  /**
   * Format log entry for output
   */
  private formatLog(level: LogLevel, message: string, context?: LogContext, error?: Error | unknown): string {
    const timestamp = new Date().toISOString()
    const env = this.isClient ? "client" : "server"
    const levelEmoji = {
      debug: "🔍",
      info: "ℹ️",
      warn: "⚠️",
      error: "❌",
      critical: "🚨",
    }[level]

    const logEntry: LogEntry = {
      timestamp,
      level,
      message,
      context: context ? { ...context, module: this.module } : { module: this.module },
      error: error instanceof Error ? { name: error.name, message: error.message, stack: error.stack } : error,
      environment: env,
    }

    // In development, format nicely for console
    if (this.isDevelopment) {
      const contextStr = context ? ` ${JSON.stringify(context, null, 2)}` : ""
      const errorStr = error ? `\nError: ${error instanceof Error ? error.stack : String(error)}` : ""
      return `[${timestamp}] ${levelEmoji} [${this.module}] ${message}${contextStr}${errorStr}`
    }

    // In production, return JSON for structured logging
    return JSON.stringify(logEntry)
  }

  /**
   * Log debug messages (only in development)
   */
  debug(message: string, context?: LogContext): void {
    if (this.isDevelopment) {
      console.debug(this.formatLog("debug", message, context))
    }
  }

  /**
   * Log informational messages
   */
  info(message: string, context?: LogContext): void {
    const formatted = this.formatLog("info", message, context)
    console.log(formatted)
  }

  /**
   * Log warning messages
   */
  warn(message: string, context?: LogContext): void {
    const formatted = this.formatLog("warn", message, context)
    console.warn(formatted)
  }

  /**
   * Log error messages
   */
  error(message: string, error?: Error | unknown, context?: LogContext): void {
    const formatted = this.formatLog("error", message, context, error)
    console.error(formatted)
    
    // In production, you might want to send errors to an error tracking service
    // Example: Sentry.captureException(error, { extra: context })
  }

  /**
   * Log successful operations
   */
  success(message: string, context?: LogContext): void {
    this.info(`✅ ${message}`, context)
  }

  /**
   * Log critical issues that require immediate attention
   * These are high-priority errors that should be monitored closely
   */
  critical(message: string, context?: LogContext): void {
    const formatted = this.formatLog("critical", `🚨 CRITICAL: ${message}`, context)
    console.error(formatted)
    
    // In production, critical logs should be sent to monitoring/alerting systems
    // Example: 
    // - Send to error tracking service (Sentry, Rollbar, etc.)
    // - Send to monitoring service (Datadog, New Relic, etc.)
    // - Send alerts (PagerDuty, Slack, email, etc.)
    if (process.env.NODE_ENV === "production") {
      // TODO: Integrate with your alerting/monitoring service
      // Example: Sentry.captureMessage(message, { level: "fatal", extra: context })
    }
  }

  /**
   * Log authentication events
   */
  auth(message: string, context?: LogContext): void {
    this.info(`🔐 ${message}`, { ...context, action: "auth" })
  }

  /**
   * Log database operations
   */
  db(message: string, context?: LogContext): void {
    this.debug(`💾 ${message}`, { ...context, action: "database" })
  }

  /**
   * Log file upload operations
   */
  upload(message: string, context?: LogContext): void {
    this.info(`📤 ${message}`, { ...context, action: "upload" })
  }

  /**
   * Log file download operations
   */
  download(message: string, context?: LogContext): void {
    this.info(`📥 ${message}`, { ...context, action: "download" })
  }

  /**
   * Log admin actions
   */
  admin(message: string, context?: LogContext): void {
    this.info(`👤 [Admin] ${message}`, { ...context, action: "admin" })
  }

  /**
   * Log R2 operations (Class A or Class B)
   */
  r2Operation(operation: "ClassA" | "ClassB", message: string, context?: LogContext): void {
    const emoji = operation === "ClassA" ? "📝" : "📖"
    this.info(`${emoji} [R2 ${operation}] ${message}`, { 
      ...context, 
      action: "r2_operation",
      operationClass: operation 
    })
  }

  /**
   * Log bucket size information
   */
  bucketSize(message: string, context?: LogContext): void {
    this.info(`📊 [Bucket Size] ${message}`, { ...context, action: "bucket_size" })
  }
}

// Create default logger instance
export const logger = new Logger("App")

// Export Logger class for creating module-specific loggers
export { Logger }

// Export convenience functions for common modules
export const createLogger = (module: string) => new Logger(module)

