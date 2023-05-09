export enum EStatusKey {
  SUCCESS200 = 'SUCCESS200',
  SUCCESS201 = 'SUCCESS201',
  ERROR400 = 'ERROR400',
  ERROR401 = 'ERROR401',
  ERROR403 = 'ERROR403',
  ERROR500 = 'ERROR500',
  VALIDATERROR400 = 'VALIDATEERROR400'
}

type TCode = 200 | 201 | 400 | 401 | 403 | 500;
interface IDefaultResponse {
  [EStatusKey: string]: {
    statusCode: TCode;
    status: string;
  };
}

export const defaultResponse: IDefaultResponse = {
  [EStatusKey.SUCCESS200]: {
    statusCode: 200,
    status: 'Success'
  },
  [EStatusKey.SUCCESS201]: {
    statusCode: 201,
    status: 'Created Success'
  },
  [EStatusKey.ERROR400]: {
    statusCode: 400,
    status: 'Bad Request'
  },
  [EStatusKey.ERROR401]: {
    statusCode: 401,
    status: 'UnAuthorized'
  },
  [EStatusKey.ERROR403]: {
    statusCode: 403,
    status: 'Forbidden'
  },
  [EStatusKey.ERROR500]: {
    statusCode: 500,
    status: 'Internal Server Error'
  },
  [EStatusKey.VALIDATERROR400]: {
    statusCode: 400,
    status: 'Validation Error'
  }
};
export interface IPagination {
  pageNo: number;
  pageCount: number;
  pageSize: number;
  total: number;
}
export interface IResponse {
  data: object;
  pagination?: IPagination;
}

export interface IResponseError {
  data: null;
  error: {
    status: string;
    statusCode: TCode;
    message: string;
  };
}
