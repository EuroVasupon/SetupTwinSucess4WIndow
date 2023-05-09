import { Request, Response, NextFunction } from 'express';
import { ResponseHandler } from 'utils';
import { EStatusKey } from 'utils/response/type';
import ErrorMessage from 'static/errorMessage';

export class CustomError extends Error {
  statusKey: EStatusKey;
  message: string;

  constructor(message: string, statusKey: EStatusKey) {
    super(message);

    this.message = message;
    this.statusKey = statusKey;
  }
}

export const handleThrowError = (
  err: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err?.statusKey && err.statusKey.length > 0) {
    ResponseHandler.Response({
      res,
      statusKey: err.statusKey ? err.statusKey : EStatusKey.ERROR500,
      message: err?.message ? err.message : ErrorMessage.server.error
    });
  }
  next();
};
