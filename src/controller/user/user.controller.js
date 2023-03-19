import Users from "../../models/user.model";
const { encode, decode } = require("../../middleware/crypt");
const crypto = require("crypto");
import { createTokens } from "../../helper/jwt_auth/jwt_auth";
import nodemailer from "nodemailer";
const CURRENT_USER = "currentUser";
import { handleResponse, encrypt, decrypt } from "../../helper/utility";
import jwt from "jsonwebtoken";
import {
  BadRequestError,
  InternalServerError,
  handleError,
  UnauthorizationError,
} from "../../helper/errors/custom-error";
var otpGenerator = require("otp-generator");
const mongoose = require("mongoose");
import { logger, level } from "../../config/logger/logger";

export const register = async (req, res, next) => {
  logger.log(level.info, `✔ Controller register()`);
  try {
    const hashPwd = await encrypt(req.body.password);
    let userData = {
      ...req.body,
      password: hashPwd,
    };
    console.log("userData", userData);
    await Users.createData(userData);
    let dataObject = { message: "User created succesfully" };
    return handleResponse(res, dataObject, 201);
  } catch (e) {
    if (e && e.message) return next(new BadRequestError(e.message));
    logger.log(level.error, `Error: ${JSON.stringify(e)}`);
    return next(new InternalServerError());
  }
};

export const removeSingleUser = async (req, res, next) => {
  try {
    logger.log(level.info, `✔ Controller removeSingleUser()`);
    const query = { _id: req[CURRENT_USER]._id };
    let removedData = await Users.deleteData(query);
    let dataObject = {
      message: "user deleted successfully.",
    };
    return handleResponse(res, dataObject);
  } catch (e) {
    if (e && e.message) return next(new BadRequestError(e.message));
    logger.log(level.error, `Error: ${JSON.stringify(e)}`);
    return next(new InternalServerError());
  }
};
export const getAllUser = async (req, res, next) => {
  try {
    logger.log(level.info, `✔ Controller getAllUser()`);
    const userData = await Users.findData();
    let dataObject = {
      message: "user details fetched successfully.",
      data: userData,
      count: userData.length,
    };
    return handleResponse(res, dataObject);
  } catch (e) {
    if (e && e.message) return next(new BadRequestError(e.message));
    logger.log(level.error, `Error: ${JSON.stringify(e)}`);
    return next(new InternalServerError());
  }
};
export const getSingleUser = async (req, res, next) => {
  try {
    logger.log(level.info, `✔ Controller getSingleUser()`);
    let userData = await Users.findOneDocument({
      _id: mongoose.Types.ObjectId(req[CURRENT_USER]._id),
    });
    let dataObject = {
      message: "user details fetched successfully.",
      data: userData,
    };
    return handleResponse(res, dataObject);
  } catch (e) {
    if (e && e.message) return next(new BadRequestError(e.message));
    logger.log(level.error, `Error: ${JSON.stringify(e)}`);
    return next(new InternalServerError());
  }
};

export const updateSingleUser = async (req, res, next) => {
  try {
    logger.log(level.info, `✔ Controller updateSingleUser()`);
    let {
      user_name,
      email,
      password,
      mobile_no,
      address,
      gender,
      dob,
      no_of_followers,
      no_of_following,
      no_of_posts,
    } = req.body;
    let updateDeviceObject = {
      user_name,
      email,
      mobile_no,
      address,
      gender,
      dob,
      no_of_followers,
      no_of_following,
      no_of_posts,
    };
    if (password) {
      password = await encrypt(password);
      updateDeviceObject = {
        ...updateDeviceObject,
        password,
      };
    }
    let userData = await Users.updateData(
      { _id: mongoose.Types.ObjectId(req[CURRENT_USER]._id) },
      updateDeviceObject
    );
    let dataObject = {
      message: "user details updated successfully.",
      data: userData,
    };
    return handleResponse(res, dataObject);
  } catch (e) {
    if (e && e.message) return next(new BadRequestError(e.message));
    logger.log(level.error, `Error: ${JSON.stringify(e)}`);
    return next(new InternalServerError());
  }
};
export const authenticateLogin = async (req, res, next) => {
  try {
    logger.log(level.info, `✔ Controller login()`);
    const { email, password } = req.body;
    const userData = await Users.findData(
      { email },
      { createdAt: 0, updatedAt: 0 }
    );
    const validateUserData = await decrypt(password, userData[0].password);
    let payload = {
      _id: userData[0]._id,
    };
    let tokens = await createTokens(payload);
    delete userData[0].password;
    if (validateUserData) {
      let dataObject = {
        message: "User login successfully.",
        data: {token: tokens },
      };
      return handleResponse(res, dataObject);
    }
    return next(new UnauthorizationError());
  } catch (e) {
    if (e && e.message) return next(new BadRequestError(e.message));
    logger.log(level.error, `Error: ${JSON.stringify(e)}`);
    return next(new InternalServerError());
  }
};
