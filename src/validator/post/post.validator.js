const { body, param } = require("express-validator");
const { CONSTANTS: POST_CONSTANTS } = require("../../constants/post/post");
import Posts from "../../models/post.model";
import Users from "../../models/user.model";
export const validate = (method) => {
  let error = [];
  switch (method) {
    case POST_CONSTANTS.CREATE_POST: {
      error = [
        body("post_title", "Post title should not be empty").not().isEmpty(),
        body("post_description", "Post description should not be empty")
          .not()
          .isEmpty(),
      ];
      break;
    }
    case POST_CONSTANTS.REMOVE_SINGLE_POST: {
      error = [param("postId").custom(postExist)];
      break;
    }
    case POST_CONSTANTS.GET_SINGLE_POST: {
      error = [param("postId").custom(postExist)];
      break;
    }
    case POST_CONSTANTS.UPDATE_SINGLE_POST: {
      error = [param("postId").custom(postExist)];
      break;
    }
  }
  return error;
};

export const verifyUserId = async (value) => {
  let userIdExist = await Users.findOneDocument({ _id: value });
  if (userIdExist) throw new Error("This ownedId does not exist");
  return value;
};

export const postExist = async (value) => {
  let postExist = await Posts.findOneDocument({ _id: value });
  if (!postExist) throw new Error("This post does not exist");
  return value;
};
