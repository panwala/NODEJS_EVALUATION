import { Router } from "express";
const usersCtrl = require("../../controller/user/user.controller");
import * as ErrorMiddleware from "../../middleware/validatorError";
import { validate as UserValidate } from "../../validator/user/user.validator";
import { CONSTANTS as USER_CONSTANTS } from "../../constants/user/user";
import { AuthMiddleware } from "../../middleware/authMiddleware";
const routes = new Router();
const PATH = {
  ROOT: "/",
  LOGIN: "/login",
  SIGNUP: "/signup",
  UPDATE_USER: "/updateuser",
  REMOVE_OPERATION_USER: "/userremoveoperation/",
  GET_OPERATION_USER: "/singleusergetoperation/:userId",
};
routes.route(PATH.ROOT).get(AuthMiddleware, usersCtrl.getAllUser);
routes
  .route(PATH.SIGNUP)
  .post(
    [
      UserValidate(USER_CONSTANTS.CREATE_USER),
      ErrorMiddleware.ExpressValidatorError,
    ],
    usersCtrl.register
  );
routes
  .route(PATH.UPDATE_USER)
  .patch(AuthMiddleware, usersCtrl.updateSingleUser);
routes
  .route(PATH.REMOVE_OPERATION_USER)
  .delete(
    [
      AuthMiddleware,
      UserValidate(USER_CONSTANTS.REMOVE_SINGLE_USER),
      ErrorMiddleware.ExpressValidatorError,
    ],
    usersCtrl.removeSingleUser
  );
routes
  .route(PATH.GET_OPERATION_USER)
  .get(
    [
      AuthMiddleware,
      UserValidate(USER_CONSTANTS.GET_SINGLE_USER),
      ErrorMiddleware.ExpressValidatorError,
    ],
    usersCtrl.getSingleUser
  );
routes
  .route(PATH.LOGIN)
  .post(
    [
      UserValidate(USER_CONSTANTS.LOGIN_USER),
      ErrorMiddleware.ExpressValidatorError,
    ],
    usersCtrl.login
  );
export default routes;
