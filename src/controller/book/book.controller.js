import Users from "../../models/user.model";
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
const CURRENT_USER = "currentUser";
const mongoose = require("mongoose");
import { logger, level } from "../../config/logger/logger";

export const addBook = async (req, res, next) => {
  logger.log(level.info, `✔ Controller addBook()`);
  try {
    let isbookExist = await Books.findOneDocument({
      bookName: req.body.bookName,
      bookCategory: req.body.bookCategory,
      bookAuthor: req.body.bookAuthor,
      bookPrice: req.body.bookPrice,
      pages: req.body.pages,
      ownerId: mongoose.Types.ObjectId(req[CURRENT_USER]._id),
      publishedDate: new Date(req.body.publishedDate),
    });
    console.log("isbookExist", isbookExist);
    req.body.ownerId = req[CURRENT_USER]._id;
    if (!isbookExist) {
      await Books.createData(req.body);
    }
    let dataObject = { message: "Book inormation stored succesfully" };
    return handleResponse(res, dataObject, 201);
  } catch (e) {
    if (e && e.message) return next(new BadRequestError(e.message));
    logger.log(level.error, `Error: ${JSON.stringify(e)}`);
    return next(new InternalServerError());
  }
};

export const removeSingleBook = async (req, res, next) => {
  try {
    logger.log(level.info, `✔ Controller removeSingleBook()`);
    const query = { _id: req.params.bookId };
    let removedData = await Books.deleteData(query);
    let dataObject = {
      message: "book information deleted successfully.",
    };
    return handleResponse(res, dataObject);
  } catch (e) {
    if (e && e.message) return next(new BadRequestError(e.message));
    logger.log(level.error, `Error: ${JSON.stringify(e)}`);
    return next(new InternalServerError());
  }
};
export const getAllBooks = async (req, res, next) => {
  try {
    logger.log(level.info, `✔ Controller getAllBooks()`);
    const bookData = await Books.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "ownerId",
          foreignField: "_id",
          as: "ownerData",
        },
      },
      {
        $unwind: {
          path: "$ownerData",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          bookName: 1,
          bookCategory: 1,
          bookAuthor: 1,
          bookPrice: 1,
          publishedDate: 1,
          pages: 1,
          ownerId: 1,
          ownerName: "$ownerData.userName",
          email: "$ownerData.email",
          mobile_no: "$ownerData.mobile_no",
        },
      },
    ]);
    let dataObject = {
      message: "book list fetched successfully.",
      data: bookData,
      count: bookData.length,
    };
    return handleResponse(res, dataObject);
  } catch (e) {
    if (e && e.message) return next(new BadRequestError(e.message));
    logger.log(level.error, `Error: ${JSON.stringify(e)}`);
    return next(new InternalServerError());
  }
};
export const getSingleBook = async (req, res, next) => {
  try {
    logger.log(level.info, `✔ Controller getSingleBook()`);
    const bookData = await Books.aggregate([
      {
        $match: {
          _id: mongoose.Types.ObjectId(req.params.bookId),
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "ownerId",
          foreignField: "_id",
          as: "ownerData",
        },
      },
      {
        $unwind: {
          path: "$ownerData",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          bookName: 1,
          bookCategory: 1,
          bookAuthor: 1,
          bookPrice: 1,
          publishedDate: 1,
          pages: 1,
          ownerId: 1,
          ownerName: "$ownerData.userName",
          email: "$ownerData.email",
          mobile_no: "$ownerData.mobile_no",
        },
      },
    ]);
    let dataObject = {
      message: "book details fetched successfully.",
      data: bookData,
    };
    return handleResponse(res, dataObject);
  } catch (e) {
    if (e && e.message) return next(new BadRequestError(e.message));
    logger.log(level.error, `Error: ${JSON.stringify(e)}`);
    return next(new InternalServerError());
  }
};

export const updateSingleBook = async (req, res, next) => {
  try {
    logger.log(level.info, `✔ Controller updateSingleBook()`);
    let {
      bookName,
      bookCategory,
      bookAuthor,
      bookPrice,
      publishedDate,
      pages,
    } = req.body;
    let updateBookObject = {
      bookName,
      bookCategory,
      bookAuthor,
      bookPrice,
      publishedDate,
      pages,
    };
    let bookData = await Books.updateData(
      { _id: mongoose.Types.ObjectId(req.params.bookId) },
      updateBookObject
    );
    let dataObject = {
      message: "book details updated successfully.",
      data: bookData,
    };
    return handleResponse(res, dataObject);
  } catch (e) {
    if (e && e.message) return next(new BadRequestError(e.message));
    logger.log(level.error, `Error: ${JSON.stringify(e)}`);
    return next(new InternalServerError());
  }
};
export const getautocompleteAllBooks = async (req, res, next) => {
  try {
    logger.log(level.info, `✔ Controller getautocompleteAllBooks()`);
    const bookData = await Books.findData({
      bookName: { $regex: req.query.booksearch },
    });
    console.log("bookData", bookData);
    let dataObject = {
      message: "book list fetched successfully.",
      data: bookData,
      count: bookData.length,
    };
    return handleResponse(res, dataObject);
  } catch (e) {
    if (e && e.message) return next(new BadRequestError(e.message));
    logger.log(level.error, `Error: ${JSON.stringify(e)}`);
    return next(new InternalServerError());
  }
};
