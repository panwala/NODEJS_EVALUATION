import Posts from "../../models/post.model";
import Users from "../../models/user.model";
const { handleResponse } = require("../../helper/utility");
const {
  BadRequestError,
  InternalServerError,
} = require("../../helper/errors/custom-error");
const CURRENT_USER = "currentUser";
const mongoose = require("mongoose");
const { logger, level } = require("../../config/logger/logger");

export const addpost = async (req, res, next) => {
  logger.log(level.info, `✔ Controller addpost()`);
  try {
    req.body.ownerId = req[CURRENT_USER]._id.toString();
    console.log("req.body", req.body);
    let postData = await Posts.createData(req.body);
    let userData = await Users.findOneDocument({ _id: req[CURRENT_USER]._id });
    let postcount = parseInt(userData.no_of_posts) + parseInt(1);
    await Users.updateData(
      { _id: req[CURRENT_USER]._id },
      { no_of_posts: postcount }
    );

    let dataObject = {
      message: "Post inormation stored succesfully",
      data: postData,
    };
    return handleResponse(res, dataObject, 201);
  } catch (e) {
    if (e && e.message) return next(new BadRequestError(e.message));
    logger.log(level.error, `Error: ${JSON.stringify(e)}`);
    return next(new InternalServerError());
  }
};

export const removeSinglePost = async (req, res, next) => {
  try {
    logger.log(level.info, `✔ Controller removeSinglePost()`);
    const query = { _id: req.params.postId };
    let postData = await Posts.findOneDocument(query);
    if (postData.ownerId.toString() === req[CURRENT_USER]._id.toString()) {
      let removedData = await Posts.deleteData(query);
      let userData = await Users.findOneDocument({
        _id: req[CURRENT_USER]._id,
      });
      let postcount = parseInt(userData.no_of_posts) - parseInt(1);
      await Users.updateData(
        { _id: req[CURRENT_USER]._id },
        { no_of_posts: postcount }
      );
      let dataObject = {
        message: "Post information deleted successfully.",
      };
      return handleResponse(res, dataObject);
    } else {
      throw new Error("you are not owner of this post. so you can't delete it");
    }
  } catch (e) {
    if (e && e.message) return next(new BadRequestError(e.message));
    logger.log(level.error, `Error: ${JSON.stringify(e)}`);
    return next(new InternalServerError());
  }
};
export const getAllPosts = async (req, res, next) => {
  try {
    logger.log(level.info, `✔ Controller getAllBooks()`);
    const postData = await Posts.aggregate([
      {
        $match: {
          ownerId: mongoose.Types.ObjectId(req[CURRENT_USER]._id),
        },
      },
      {
        $sort: {
          createdAt: -1,
        },
      },
      {
        $lookup: {
          from: "postcomments",
          localField: "_id",
          foreignField: "postId",
          as: "comments",
          pipeline: [
            {
              $project: {
                comment: 1,
                comment_person_userId: 1,
                userData: 1,
              },
            },
            {
              $limit: 20,
            },
          ],
        },
      },
      {
        $unwind: {
          path: "$comments",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "comments.comment_person_userId",
          foreignField: "_id",
          as: "commentuserData",
          pipeline: [
            {
              $project: {
                user_name: 1,
              },
            },
          ],
        },
      },
      {
        $unwind: {
          path: "$commentuserData",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          _id: 1,
          no_of_likes: 1,
          no_of_comments: 1,
          post_title: 1,
          post_description: 1,
          ownerId: 1,
          comments: "$comments.comment",
          commentedUserName: "$commentuserData.user_name",
        },
      },
      {
        $group: {
          _id: "$_id",
          no_of_likes: {
            $first: "$no_of_likes",
          },
          no_of_comments: {
            $first: "$no_of_comments",
          },
          post_title: {
            $first: "$post_title",
          },
          post_description: {
            $first: "$post_description",
          },
          ownerId: {
            $first: "$ownerId",
          },
          commentsData: {
            $push: {
              comments: "$comments",
              commentedUserName: "$commentedUserName",
            },
          },
        },
      },
    ]);
    let dataObject = {
      message: "post list fetched successfully.",
      data: postData,
      count: postData.length,
    };
    return handleResponse(res, dataObject);
  } catch (e) {
    if (e && e.message) return next(new BadRequestError(e.message));
    logger.log(level.error, `Error: ${JSON.stringify(e)}`);
    return next(new InternalServerError());
  }
};
export const getSinglePost = async (req, res, next) => {
  try {
    logger.log(level.info, `✔ Controller getSinglePost()`);
    const postData = await Posts.aggregate([
      {
        $match: {
          _id: mongoose.Types.ObjectId(req.params.postId),
        },
      },
      {
        $lookup: {
          from: "postcomments",
          localField: "_id",
          foreignField: "postId",
          as: "comments",
          pipeline: [
            {
              $project: {
                comment: 1,
                comment_person_userId: 1,
                userData: 1,
              },
            },
            {
              $limit: 20,
            },
          ],
        },
      },
      {
        $unwind: {
          path: "$comments",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "comments.comment_person_userId",
          foreignField: "_id",
          as: "commentuserData",
          pipeline: [
            {
              $project: {
                user_name: 1,
              },
            },
          ],
        },
      },
      {
        $unwind: {
          path: "$commentuserData",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          _id: 1,
          no_of_likes: 1,
          no_of_comments: 1,
          post_title: 1,
          post_description: 1,
          ownerId: 1,
          comments: "$comments.comment",
          commentedUserName: "$commentuserData.user_name",
        },
      },
      {
        $group: {
          _id: "$_id",
          no_of_likes: {
            $first: "$no_of_likes",
          },
          no_of_comments: {
            $first: "$no_of_comments",
          },
          post_title: {
            $first: "$post_title",
          },
          post_description: {
            $first: "$post_description",
          },
          ownerId: {
            $first: "$ownerId",
          },
          commentsData: {
            $push: {
              comments: "$comments",
              commentedUserName: "$commentedUserName",
            },
          },
        },
      },
    ]);
    let dataObject = {
      message: "Post details fetched successfully.",
      data: postData,
    };
    return handleResponse(res, dataObject);
  } catch (e) {
    if (e && e.message) return next(new BadRequestError(e.message));
    logger.log(level.error, `Error: ${JSON.stringify(e)}`);
    return next(new InternalServerError());
  }
};

export const updateSinglepost = async (req, res, next) => {
  try {
    logger.log(level.info, `✔ Controller updateSinglepost()`);
    let { post_title, post_description } = req.body;
    let updatePostObject = {
      post_title,
      post_description,
    };
    let postData = await Posts.findData({
      _id: mongoose.Types.ObjectId(req.params.postId),
    });
    if (postData.ownerId == req[CURRENT_USER]._id) {
      let postData = await Posts.updateData(
        { _id: mongoose.Types.ObjectId(req.params.postId) },
        updatePostObject
      );
      let dataObject = {
        message: "Post details updated successfully.",
        data: postData,
      };
      return handleResponse(res, dataObject);
    } else {
      throw new Error("you are not owner of this post. so you can't update it");
    }
  } catch (e) {
    if (e && e.message) return next(new BadRequestError(e.message));
    logger.log(level.error, `Error: ${JSON.stringify(e)}`);
    return next(new InternalServerError());
  }
};
