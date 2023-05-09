import * as express from 'express';
import {
  IResponseError,
  IResponse,
  EStatusKey,
  defaultResponse,
  IPagination
} from './type';

interface IParams {
  res: express.Response;
  statusKey: EStatusKey;
  message?: string;
  data?: object | null;
  pagination?: IPagination;
}

const Response = ({
  res,
  statusKey,
  message,
  data,
  pagination
}: IParams): void => {
  const statusCode = defaultResponse[statusKey].statusCode;

  if (data !== undefined && statusCode < 400) {
    const value = data !== null ? data : {};
    success(res, statusCode, value, pagination);
  } else {
    error(res, statusKey, message);
  }
};
const success = (
  res: express.Response,
  statusCode: number,
  data: object,
  pagination?: IPagination
) => {
  const returnData: IResponse = {
    data
  };

  if (pagination) {
    returnData.pagination = pagination;
  }

  res.header('Content-Type', 'application/json');
  res.status(statusCode).json(returnData).end();
};

const error = (
  res: express.Response,
  statusKey: EStatusKey,
  message?: string
) => {
  const statusCode = defaultResponse[statusKey].statusCode;
  const status = defaultResponse[statusKey].status;
  const data: IResponseError = {
    data: null,
    error: {
      status,
      statusCode,
      message: !!message && message?.length > 0 ? message : status
    }
  };

  res.header('Content-Type', 'application/json');
  res.status(statusCode).json(data).end();
};

export { Response, EStatusKey };
