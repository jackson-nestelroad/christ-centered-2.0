export interface AppError {
  message?: string;
  stack?: string;
}

export function CreateAppError(error: any): AppError {
  const appError: AppError = {};
  appError.message = error?.message ?? error?.toString?.() ?? 'Unknown error';
  if (error.stack && typeof error.stack === 'string') {
    appError.stack = error.stack;
  }
  return appError;
}
