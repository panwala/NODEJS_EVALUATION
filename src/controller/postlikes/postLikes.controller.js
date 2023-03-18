import Postlikes from "../../models/post_likes.model";
import Posts from "../../models/post.model";
const { handleResponse } = require("../../helper/utility");
const {
  BadRequestError,
  InternalServerError,
} = require("../../helper/errors/custom-error");
const mongoose = require("mongoose");
const CURRENT_USER = "currentUser";
const { logger, level } = require("../../config/logger/logger");

export const createPostLike = async (req, res, next) => {
  logger.log(level.info, `✔ Controller createPostLike()`);
  try {
    req.body.liked_person_userId = req[CURRENT_USER]._id;
    req.body.postId = req.params.postId;
    await Postlikes.createData(req.body);
    let postData = await Posts.findOneDocument({ _id: req.params.postId });
    let likeCount = parseInt(postData.no_of_likes) + parseInt(1);
    await Posts.updateData(
      { _id: req.params.postId },
      { no_of_likes: likeCount }
    );
    let dataObject = { message: "Post like created succesfully" };
    return handleResponse(res, dataObject, 201);
  } catch (e) {
    if (e && e.message) return next(new BadRequestError(e.message));
    logger.log(level.error, `Error: ${JSON.stringify(e)}`);
    return next(new InternalServerError());
  }
};

export const removePostLike = async (req, res, next) => {
  try {
    logger.log(level.info, `✔ Controller removeSingleItemFromCart()`);
    let removedData = await Postlikes.deleteData({
      liked_person_userId: req[CURRENT_USER]._id,
      postId: req.params.postId,
    });
    let postData = await Posts.findOneDocument({ _id: req.params.postId });
    let likeCount = parseInt(postData.no_of_likes) - parseInt(1);
    await Posts.updateData(
      { _id: req.params.postId },
      { no_of_likes: likeCount }
    );
    let dataObject = {
      message: "Post disliked successfully",
    };
    return handleResponse(res, dataObject);
  } catch (e) {
    if (e && e.message) return next(new BadRequestError(e.message));
    logger.log(level.error, `Error: ${JSON.stringify(e)}`);
    return next(new InternalServerError());
  }
};
