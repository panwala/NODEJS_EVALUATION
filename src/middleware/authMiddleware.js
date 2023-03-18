const {
  TokenExpiredError,
  UnauthorizationError,
} = require("../helper/errors/custom-error");
const mongoose = require("mongoose");
// import * as JWT from "../helper/jwt_auth/jwt_auth";
const { verifyAccessToken } = require("../helper/jwt_auth/jwt_auth");
import Users from "../models/user.model";
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
        let decoded = await verifyAccessToken(accessToken);
        let { _id } = decoded;
        let userData = await Users.findOneDocument({
          _id: mongoose.Types.ObjectId(_id),
        });
        if (userData) {
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
