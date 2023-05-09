import { Request, Response, NextFunction } from 'express';

interface IParams {
  (req: Request, res: Response, next: NextFunction): Promise<void>;
}

export default (func: IParams) =>
  (req: Request, res: Response, next: NextFunction) =>
    func(req, res, next).catch(next);
