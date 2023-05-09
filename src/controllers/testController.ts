import { Request, Response } from 'express';

import { ResponseHandler } from 'utils';

import { ErrorMessage } from 'static';

export const test = async (req: Request, res: Response) => {
  try {
    console.log(req.body);
    return ResponseHandler.Response({
      res,
      statusKey: ResponseHandler.EStatusKey.SUCCESS201,
      data: { test: 'เเละนี่คือเสียงจากเด็กวัด' }
    });
  } catch (err) {
    console.error(err);
    return ResponseHandler.Response({
      res,
      statusKey: ResponseHandler.EStatusKey.ERROR500,
      message: ErrorMessage.controller.test.reset
    });
  }
};
