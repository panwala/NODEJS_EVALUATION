import Postcomment from "../../models/post_commets.model";
import Posts from "../../models/post.model";
const { handleResponse } = require("../../helper/utility");
const {
  BadRequestError,
  InternalServerError,
} = require("../../helper/errors/custom-error");
const mongoose = require("mongoose");
const CURRENT_USER = "currentUser";
const { logger, level } = require("../../config/logger/logger");

export const createPostComment = async (req, res, next) => {
  logger.log(level.info, `✔ Controller createPostComment()`);
  try {
    req.body.comment_person_userId = req[CURRENT_USER]._id;
    req.body.postId = req.params.postId;
    let commentData = await Postcomment.createData(req.body);
    let postData = await Posts.findOneDocument({ _id: req.params.postId });
    let commentCount = parseInt(postData.no_of_comments) + parseInt(1);
    await Posts.updateData(
      { _id: req.params.postId },
      { no_of_comments: commentCount }
    );
    let dataObject = {
      message: "Post comment created succesfully",
      data: commentData,
    };
    return handleResponse(res, dataObject, 201);
  } catch (e) {
    if (e && e.message) return next(new BadRequestError(e.message));
    logger.log(level.error, `Error: ${JSON.stringify(e)}`);
    return next(new InternalServerError());
  }
};

export const removePostComment = async (req, res, next) => {
  try {
    logger.log(level.info, `✔ Controller removePostComment()`);
    let postData = await Posts.findOneDocument({
      comment_person_userId: req[CURRENT_USER]._id,
      postId: req.params.postId,
      comment: req.body.comment,
    });
    if (postData.comment_person_userId == req[CURRENT_USER]._id) {
      let removedData = await Postcomment.deleteData({
        comment_person_userId: req[CURRENT_USER]._id,
        postId: req.params.postId,
        comment: req.body.comment,
      });
      let postData = await Posts.findData({ _id: req.body.postId });
      let commentCount = parseInt(postData.no_of_comments) - parseInt(1);
      await Posts.updateData(
        { _id: req.params.postId },
        { no_of_comments: commentCount }
      );
      let dataObject = {
        message: "Post comment deleted successfully",
      };
      return handleResponse(res, dataObject);
    } else {
      throw new Error(
        "you are not owner of this comment . so you cant delete it"
      );
    }
  } catch (e) {
    if (e && e.message) return next(new BadRequestError(e.message));
    logger.log(level.error, `Error: ${JSON.stringify(e)}`);
    return next(new InternalServerError());
  }
};

export const fetchPaginationPostComment = async (req, res, next) => {
  try {
    logger.log(level.info, `✔ Controller fetchPaginationPostComment()`);
    let postcommentData = await Posts.aggregate([
      {
        $match: {
          postId: mongoose.Types.ObjectId(req.params.postId),
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "comment_person_userId",
          foreignField: "_id",
          as: "commentedpersonData",
        },
      },
      {
        $skip: req.query.skip,
      },
      {
        $limit: req.query.limit,
      },
      {
        $unwind: {
          path: "$commentedpersonData",
          preserveNullAndEmptyArrays: true,
        },
      },
    ]);

    let dataObject = {
      message: "Post comment fetched successfully",
      data: postcommentData,
      length: postcommentData.length,
    };
    return handleResponse(res, dataObject);
  } catch (e) {
    if (e && e.message) return next(new BadRequestError(e.message));
    logger.log(level.error, `Error: ${JSON.stringify(e)}`);
    return next(new InternalServerError());
  }
};
export const fetchPaginationPostLikeData = async (req, res, next) => {
  try {
    logger.log(level.info, `✔ Controller fetchPaginationPostLikeData()`);
    let postlikedData = await Posts.aggregate([
      {
        $match: {
          postId: mongoose.Types.ObjectId(req.params.postId),
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "liked_person_userId",
          foreignField: "_id",
          as: "likedpersonData",
        },
      },
      {
        $skip: req.query.skip,
      },
      {
        $limit: req.query.limit,
      },
      {
        $unwind: {
          path: "$likedpersonData",
          preserveNullAndEmptyArrays: true,
        },
      },
    ]);

    let dataObject = {
      message: "Post like data fetched successfully",
      data: postlikedData,
      length: postlikedData.length,
    };
    return handleResponse(res, dataObject);
  } catch (e) {
    if (e && e.message) return next(new BadRequestError(e.message));
    logger.log(level.error, `Error: ${JSON.stringify(e)}`);
    return next(new InternalServerError());
  }
};
