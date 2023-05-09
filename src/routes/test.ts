import { Router } from 'express';
// import { AuthMiddleware } from 'middlewares';
import { TestController } from 'controllers';
// import { UserValidation } from 'validations';
import { AsyncWrapper } from 'utils';
// import { EPermissionsPage, EPermissionsType } from 'database/models/types';

const router = Router();

router.get(
  '/dekwat',
  // AsyncWrapper(AuthMiddleware.verifyUser),
  // AsyncWrapper(
  //   AuthMiddleware.permissionAccess(
  //     [EPermissionsPage.USERS, EPermissionsPage.MESSAGES],
  //     EPermissionsType.PAGE
  //   )
  // ),
  // UserValidation.findAll,
  AsyncWrapper(TestController.test)
);

export default {
  baseUrl: '/api/tests',
  router
};
