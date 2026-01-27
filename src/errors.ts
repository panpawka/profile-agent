/**
 * Custom error classes for ProfileAgent
 */

/**
 * Base error class for all ProfileAgent errors
 */
export class ProfileAgentError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ProfileAgentError';
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Error thrown when parsing documents (PDF, DOCX, LinkedIn) fails
 */
export class ParseError extends ProfileAgentError {
  constructor(message: string, public readonly filePath?: string) {
    super(message);
    this.name = 'ParseError';
  }
}

/**
 * Error thrown when AI extraction or generation fails
 */
export class AIError extends ProfileAgentError {
  constructor(message: string, public readonly provider?: string) {
    super(message);
    this.name = 'AIError';
  }
}

/**
 * Error thrown when GitHub API operations fail
 */
export class GitHubError extends ProfileAgentError {
  constructor(message: string, public readonly statusCode?: number) {
    super(message);
    this.name = 'GitHubError';
  }
}

/**
 * Error thrown when configuration is invalid or missing
 */
export class ConfigError extends ProfileAgentError {
  constructor(message: string) {
    super(message);
    this.name = 'ConfigError';
  }
}

/**
 * Error thrown when template operations fail
 */
export class TemplateError extends ProfileAgentError {
  constructor(message: string, public readonly templateName?: string) {
    super(message);
    this.name = 'TemplateError';
  }
}

/**
 * Error thrown when file system operations fail
 */
export class FileSystemError extends ProfileAgentError {
  constructor(message: string, public readonly path?: string) {
    super(message);
    this.name = 'FileSystemError';
  }
}
