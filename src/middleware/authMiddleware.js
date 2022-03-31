import { decode } from "jsonwebtoken";
import {
  TokenExpiredError,
  UnauthorizationError,
} from "../helper/errors/custom-error";
import * as JWT from "../helper/jwt_auth/jwt_auth";
// //import { Roles /*Users*/ } from "../models/index";
// import Users from "../models/user.model";
import Users from "../models/user.model";
// import { CONSTANTS as USER_STATUS } from "../constants/status/userStatus";
// import * as UserSrv from "../services/user/user.service";

const AUTH_TYPE = "bearer";
const tokenLength = 2;
const tokenSplitBy = " ";
const AUTHORIZATION_HEADER_NAME = "authorization";
const CURRENT_USER = "currentUser";

export const AuthMiddleware = async (req, res, next) => {
  const authorization = req.headers[AUTHORIZATION_HEADER_NAME];
  try {
    if (authorization) {
      let token = authorization.split(tokenSplitBy);
      if (token.length == tokenLength && token[0].toLowerCase() === AUTH_TYPE) {
        let accessToken = token[1];
        let decoded = await JWT.verifyAccessToken(accessToken);
        console.log("decoded", decoded);
        let { _id } = decoded;
        console.log("After Decoding", _id);
        let userData = await Users.findOneDocument({ _id });
        if (userData) {
          console.log("In Middleware", userData);
          req[CURRENT_USER] = userData;
          console.log(req[CURRENT_USER]);
          return next();
        }
      }
    }
  } catch (error) {
    return next(new TokenExpiredError());
  }
  return next(new UnauthorizationError());
};
