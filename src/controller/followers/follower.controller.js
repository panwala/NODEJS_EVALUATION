import  Followers from "../../models/followers.model";
import Users from "../../models/user.model";
const { handleResponse } = require("../../helper/utility");
const {
  BadRequestError,
  InternalServerError,
} = require("../../helper/errors/custom-error");
const mongoose = require("mongoose");
const CURRENT_USER = "currentUser";
const { logger, level } = require("../../config/logger/logger");

export const createFollower = async (req, res, next) => {
  logger.log(level.info, `✔ Controller createFollower()`);
  try {
    req.body.following_person_user_Id = req[CURRENT_USER]._id;
    req.body.userId = req.params.userId;
    await Followers.createData(req.body);
    let userfollowersData = await Users.findOneDocument({
      _id: req.params.userId,
    });
    let followersCount =
      parseInt(userfollowersData.no_of_followers) + parseInt(1);
    await Users.updateData(
      { _id: req.params.userId },
      { no_of_followers: followersCount }
    );
    let userfollowingData = await Users.findOneDocument({
      _id: req[CURRENT_USER]._id,
    });
    let followingCount =
      parseInt(userfollowingData.no_of_following) + parseInt(1);
    await Users.updateData(
      { _id: req[CURRENT_USER]._id },
      { no_of_following: followingCount }
    );
    let dataObject = { message: "follower created succesfully" };
    return handleResponse(res, dataObject, 201);
  } catch (e) {
    if (e && e.message) return next(new BadRequestError(e.message));
    logger.log(level.error, `Error: ${JSON.stringify(e)}`);
    return next(new InternalServerError());
  }
};

export const removeFollower = async (req, res, next) => {
  try {
    logger.log(level.info, `✔ Controller removeFollower()`);
    let followerData = await Followers.findOneDocument({
      following_person_user_Id: req[CURRENT_USER]._id,
      userId: req.params.userId,
    });
    console.log("followerData", followerData);
    console.log("req[CURRENT_USER]._id", req[CURRENT_USER]._id);
    if (followerData.following_person_user_Id != req[CURRENT_USER]._id) {
      let removedData = await Followers.deleteData({
        following_person_user_Id: req[CURRENT_USER]._id,
        userId: req.params.userId,
      });
      let postData = await Users.findOneDocument({ _id: req.params.userId });
      let followersCount = parseInt(postData.no_of_followers) - parseInt(1);
      await Users.updateData(
        { _id: req.params.userId },
        { no_of_followers: followersCount }
      );
      let userfollowingData = await Users.findOneDocument({
        _id: req[CURRENT_USER]._id,
      });
      let followingCount =
        parseInt(userfollowingData.no_of_following) - parseInt(1);
      await Users.updateData(
        { _id: req[CURRENT_USER]._id },
        { no_of_following: followingCount }
      );

      let dataObject = {
        message: "follower deleted successfully",
      };
      return handleResponse(res, dataObject);
    } else {
      throw new Error(
        "you  have not followed this user =require( this account. so you can't unfollow it"
      );
    }
  } catch (e) {
    if (e && e.message) return next(new BadRequestError(e.message));
    logger.log(level.error, `Error: ${JSON.stringify(e)}`);
    return next(new InternalServerError());
  }
};
