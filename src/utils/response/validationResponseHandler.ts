import * as express from 'express';
import { validationResult, ValidationError } from 'express-validator';
import * as ResponseHandler from './responseHandler';

interface IError {
  param: string;
  value?: undefined;
  msg: string;
}
const errorFormatter = ({
  msg,
  param,
  value,
  nestedErrors
}: ValidationError) => {
  if (nestedErrors && nestedErrors.length > 0) {
    const errors: IError[] = [];

    nestedErrors.forEach((err: any) => {
      if (err.value !== undefined)
        errors.push({
          param: err.param,
          value: err.value,
          msg: err.msg
        });
    });

    if (errors.length > 0) return errors[0];
  }
  return {
    param,
    value,
    msg
  };
};

const ResponseValidator = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  const result = validationResult(req).formatWith(errorFormatter).array({
    onlyFirstError: true
  });

  if (result.length > 0) {
    const message = `${result[0].param} ${result[0].msg}`;
    return ResponseHandler.Response({
      res,
      statusKey: ResponseHandler.EStatusKey.VALIDATERROR400,
      message
    });
  }

  next();
};

export default ResponseValidator;
