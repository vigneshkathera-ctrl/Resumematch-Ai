import multer from 'multer';
import { ZodError } from 'zod';

export const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || res.statusCode;
  if (!statusCode || statusCode < 400) {
    statusCode = 500;
  }

  let message = err.message || 'Internal Server Error';

  // Multer error handling
  if (err instanceof multer.MulterError) {
    statusCode = 400;
    if (err.code === 'LIMIT_FILE_SIZE') {
      message = 'Uploaded file exceeds the maximum allowed size of 5 MB.';
    } else {
      message = `File upload error: ${err.message}`;
    }
  }

  // Zod validation error handling
  if (err instanceof ZodError) {
    statusCode = 400;
    const details = err.errors.map((e) => `${e.path.join('.')}: ${e.message}`).join(', ');
    message = `Validation failed: ${details}`;
  }

  // MongoDB duplicate key error (code 11000)
  if (err.code === 11000) {
    statusCode = 409;
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    message = `An account with this ${field} already exists.`;
  }

  // Mongoose CastError (e.g. invalid ObjectId)
  if (err.name === 'CastError') {
    statusCode = 400;
    message = `Invalid format for resource ID: ${err.value}`;
  }

  // Scanned PDF custom indicator
  const isScannedPdf = Boolean(err.isScannedPdf);

  // Log in development/debug
  if (process.env.NODE_ENV !== 'production' && statusCode === 500) {
    console.error('[Error Trace]', err);
  }

  res.status(statusCode).json({
    success: false,
    message,
    isScannedPdf,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

