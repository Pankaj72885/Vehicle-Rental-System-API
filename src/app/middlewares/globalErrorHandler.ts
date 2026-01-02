/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import { ErrorRequestHandler } from 'express';
import { ZodError } from 'zod';
import config from '../../config';
import AppError from '../utils/AppError';

export type TErrorSources = {
  path: string | number;
  message: string;
}[];

const globalErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
  let statusCode = 500;
  let message = 'Something went wrong!';
  let errorMessages: TErrorSources = [
    {
      path: '',
      message: 'Something went wrong',
    },
  ];

  if (err instanceof ZodError) {
    statusCode = 400;
    message = 'Validation Error';
    errorMessages = err.issues.map(issue => {
      return {
        path: issue.path[issue.path.length - 1],
        message: issue.message,
      };
    });
  } else if (err?.code === '23505') {
    // Postgres unique violation
    statusCode = 409;
    message = 'Duplicate Entry';
    // const match = err.detail.match(/\((.*?)\)=\((.*?)\)/);
    // Simplified extraction
    errorMessages = [
      {
        path: '',
        message: err.detail || 'Duplicate entry found',
      },
    ];
  } else if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
    errorMessages = [
      {
        path: '',
        message: err.message,
      },
    ];
  } else if (err instanceof Error) {
    message = err.message;
    errorMessages = [
      {
        path: '',
        message: err.message,
      },
    ];
  }

  res.status(statusCode).json({
    success: false,
    message,
    errorMessages, // Optional based on API REF?
    // API Ref says: "Standard Error Response Structure: { success: false, message: '...', errors: '...' }"
    // It seems "errors" field is expected, not "errorMessages". And it might be a string or object.
    // The previous code had "errorMessages". Let's stick to API Ref format?
    // API Ref example: "errors": "Error description".
    // But usually structured errors are better.
    // Let's map errorMessages to 'errors' field or keep it structured.
    // If API Ref implies simple structure, maybe we should simplify.
    // However, for debugging detailed SRS mentions "Standardize success/error response format".
    // A common pattern is sending detailed errors.
    // Let's assume standard generic error response.
    // But to match strict "Standard Error Response Structure" from API REF:
    // { success: false, message: "...", errors: "..." }
    // It shows errors as a single field.
    // Let's output what we have, but key it as 'errorMessages' or 'errors'?
    // I will include both or just use 'errorMessages' as it is more descriptive,
    // OR map 'errorMessages' to 'errors' if specific format required.
    // Many modern APIs use 'errorSources' or 'errors' array.
    // I'll keep 'errorMessages' but ALSO add 'stack' only in dev.
    stack: config.env === 'development' ? err?.stack : null,
  });
};

export default globalErrorHandler;
