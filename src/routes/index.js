import { Router } from "express";
import { handleResponse } from "../helper/utility";
const usersCtrl = require("../controller/user/user.controller");
import { ExpressValidatorError } from "../middleware/validatorError";
import { validate as UserValidate } from "../validator/user/user.validator";
import { CONSTANTS as USER_CONSTANTS } from "../constants/user/user";
import { AuthMiddleware } from "../middleware/authMiddleware";
const postCtrl = require("../controller/post/post.controller");
const postLikesCtrl = require("../controller/postlikes/postLikes.controller");
const followersCtrl = require("../controller/followers/follower.controller");
const postCommentsCtrl = require("../controller/postcomments/postComments.controller");
import { validate as PostValidate } from "../validator/post/post.validator";
import { CONSTANTS as POST_CONSTANTS } from "../constants/post/post";
import { validate as PostLikesValidate } from "../validator/postlikes/postLikes.validator";
import { CONSTANTS as POST_LIKES_CONSTANTS } from "../constants/postlikes/postlikes";
import { validate as PostCommentsValidate } from "../validator/postcomments/postComments.validator";
import { CONSTANTS as POST_COMMENTS_CONSTANTS } from "../constants/postcomment/postcomment";
import { validate as FollowersValidate } from "../validator/follower/follower.validator";
import { CONSTANTS as FOLLOWER_CONSTANTS } from "../constants/follower/follower";
const routes = new Router();
const PATH = {
  ROOT: "/",
  AUTHENTICATE: "/authenticate",
  SIGNUP: "/signup",
  USER: "/user",
  POSTS: "/posts",
  OPERATION_POSTS: "/posts/:postId",
  AUTOCOMPLETE_SEARCH_BOOK: "/autocomplete",
  LIKE: "/like/:postId",
  UNLIKE: "/unlike/:postId",
  COMMENT: "/comment/:postId",
  FOLLOW: "/follow/:userId",
  UNFOLOW: "/unfollow/:userId",
  GET_ALL_POSTS: "/all_posts",
  FETCH_PAGINATION_COMMENT_DATA: "/paginationcomment/:postId",
  FETCH_PAGINATION_LIKE_DATA: "/paginationlike/:postId",
};

routes.get("/healthCheck", (req, res) => {
  let dataObject = {
    message: "Server is running",
  };
  return handleResponse(res, dataObject);
});

//extra route for user registration which is not in API LIST
routes
  .route(PATH.SIGNUP)
  .post([UserValidate(USER_CONSTANTS.CREATE_USER), ExpressValidatorError]);
usersCtrl.register;
//user routes
routes
  .route(PATH.USER)
  .get(AuthMiddleware, usersCtrl.getSingleUser)
  .delete(AuthMiddleware, usersCtrl.removeSingleUser)
  .patch(AuthMiddleware, usersCtrl.updateSingleUser);
routes
  .route(PATH.AUTHENTICATE)
  .post(
    [UserValidate(USER_CONSTANTS.LOGIN_USER), ExpressValidatorError],
    usersCtrl.authenticateLogin
  );
// post routes
routes
  .route(PATH.POSTS)
  .post(
    [
      AuthMiddleware,
      PostValidate(POST_CONSTANTS.CREATE_POST),
      ExpressValidatorError,
    ],
    postCtrl.addpost
  );
routes.route(PATH.GET_ALL_POSTS).get(AuthMiddleware, postCtrl.getAllPosts);
routes
  .route(PATH.OPERATION_POSTS)
  .patch(
    [
      AuthMiddleware,
      PostValidate(POST_CONSTANTS.UPDATE_SINGLE_POST),
      ExpressValidatorError,
    ],
    postCtrl.updateSinglepost
  );
routes
  .route(PATH.OPERATION_POSTS)
  .delete(
    [
      AuthMiddleware,
      PostValidate(POST_CONSTANTS.REMOVE_SINGLE_POST),
      ExpressValidatorError,
    ],
    postCtrl.removeSinglePost
  )
  .get(
    [
      AuthMiddleware,
      PostValidate(POST_CONSTANTS.GET_SINGLE_POST),
      ExpressValidatorError,
    ],
    postCtrl.getSinglePost
  );
//for liking post route
routes
  .route(PATH.LIKE)
  .post(
    [
      AuthMiddleware,
      PostLikesValidate(POST_LIKES_CONSTANTS.CREATE_POST_LIKES),
      ExpressValidatorError,
    ],
    postLikesCtrl.createPostLike
  );
routes
  .route(PATH.UNLIKE)
  .post(
    [
      AuthMiddleware,
      PostLikesValidate(POST_LIKES_CONSTANTS.REMOVE_POST_LIKES),
      ExpressValidatorError,
    ],
    postLikesCtrl.removePostLike
  );

// for commenting on posts
routes
  .route(PATH.COMMENT)
  .post(
    [
      AuthMiddleware,
      PostCommentsValidate(POST_COMMENTS_CONSTANTS.CREATE_POST_COMMENTS),
      ExpressValidatorError,
    ],
    postCommentsCtrl.createPostComment
  )
  .delete(
    [
      AuthMiddleware,
      PostCommentsValidate(POST_COMMENTS_CONSTANTS.REMOVE_POST_COMMENTS),
      ExpressValidatorError,
    ],
    postCommentsCtrl.removePostComment
  );

//for following and unfollowing routes
routes
  .route(PATH.FOLLOW)
  .post(
    [
      AuthMiddleware,
      FollowersValidate(FOLLOWER_CONSTANTS.CREATE_FOLLOWER),
      ExpressValidatorError,
    ],
    followersCtrl.createFollower
  );
routes
  .route(PATH.UNFOLOW)
  .post(
    [
      AuthMiddleware,
      FollowersValidate(FOLLOWER_CONSTANTS.REMOVE_FOLLOWER),
      ExpressValidatorError,
    ],
    followersCtrl.removeFollower
  );
routes
  .route(PATH.FETCH_PAGINATION_COMMENT_DATA)
  .get(postCommentsCtrl.fetchPaginationPostComment);
routes
  .route(PATH.FETCH_PAGINATION_LIKE_DATA)
  .get(postCommentsCtrl.fetchPaginationPostLikeData);
module.exports = routes;
