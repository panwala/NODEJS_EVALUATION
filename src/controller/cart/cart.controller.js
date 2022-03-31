import Carts from "../../models/cart.model";
import Books from "../../models/book.model";
const { encode, decode } = require("../../middleware/crypt");
const crypto = require("crypto");
import nodemailer from "nodemailer";
import { handleResponse, encrypt, decrypt } from "../../helper/utility";
import {
  BadRequestError,
  InternalServerError,
  handleError,
  UnauthorizationError,
} from "../../helper/errors/custom-error";
var otpGenerator = require("otp-generator");
const mongoose = require("mongoose");
const CURRENT_USER = "currentUser";
import { logger, level } from "../../config/logger/logger";

export const addItemtoCart = async (req, res, next) => {
  logger.log(level.info, `✔ Controller addItemtoCart()`);
  try {
    req.body.userId = req[CURRENT_USER]._id;
    await Carts.createData(req.body);
    let dataObject = { message: "Item added to cart" };
    return handleResponse(res, dataObject, 201);
  } catch (e) {
    if (e && e.message) return next(new BadRequestError(e.message));
    logger.log(level.error, `Error: ${JSON.stringify(e)}`);
    return next(new InternalServerError());
  }
};

export const removeSingleItemFromCart = async (req, res, next) => {
  try {
    logger.log(level.info, `✔ Controller removeSingleItemFromCart()`);
    let removedData = await Carts.deleteData({
      userId: req[CURRENT_USER]._id,
      itemId: req.query.itemId,
    });
    let dataObject = {
      message: "removed item from cart",
    };
    return handleResponse(res, dataObject);
  } catch (e) {
    if (e && e.message) return next(new BadRequestError(e.message));
    logger.log(level.error, `Error: ${JSON.stringify(e)}`);
    return next(new InternalServerError());
  }
};
export const removeAllitemsofSingleUserFromCart = async (req, res, next) => {
  try {
    logger.log(level.info, `✔ Controller removeAllitemsofSingleUserFromCart()`);
    let removedData = await Carts.deleteMultipleData({
      userId: req[CURRENT_USER]._id,
    });
    let dataObject = {
      message: "Cart cleaered.please browse our various amazing books",
    };
    return handleResponse(res, dataObject);
  } catch (e) {
    if (e && e.message) return next(new BadRequestError(e.message));
    logger.log(level.error, `Error: ${JSON.stringify(e)}`);
    return next(new InternalServerError());
  }
};
export const getAllItemsofCartOfUser = async (req, res, next) => {
  try {
    logger.log(level.info, `✔ Controller getAllItemsofCartOfUser()`);
    const cartData = await Carts.aggregate([
      {
        $match: {
          userId: mongoose.Types.ObjectId(req[CURRENT_USER]._id),
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "userData",
        },
      },
      {
        $unwind: {
          path: "$userData",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "books",
          localField: "itemId",
          foreignField: "_id",
          as: "BookData",
        },
      },
      {
        $unwind: {
          path: "$BookData",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $group: {
          _id: "$itemId",
          TotalQuantityOrdered: {
            $sum: 1,
          },
          BookName: {
            $first: "$BookData.bookName",
          },
          bookCategory: {
            $first: "$BookData.bookCategory",
          },
          bookAuthor: {
            $first: "$BookData.bookAuthor",
          },
          bookPrice: {
            $first: "$BookData.bookPrice",
          },
          publishedDate: {
            $first: "$BookData.publishedDate",
          },
          pages: {
            $first: "$BookData.pages",
          },
        },
      },
    ]);
    let dataObject = {
      message: "cart data fetched successfully.",
      data: cartData,
      count: cartData.length,
    };
    return handleResponse(res, dataObject);
  } catch (e) {
    if (e && e.message) return next(new BadRequestError(e.message));
    logger.log(level.error, `Error: ${JSON.stringify(e)}`);
    return next(new InternalServerError());
  }
};
