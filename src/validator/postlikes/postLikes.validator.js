const { param } = require("express-validator");
const {
  CONSTANTS: POST_CONSTANTS,
} = require("../../constants/postlikes/postlikes");
import Users from "../../models/user.model";
import Posts from "../../models/post.model";
export const validate = (method) => {
  let error = [];
  switch (method) {
    case POST_CONSTANTS.CREATE_POST_LIKES: {
      error = [param("postId").custom(postExist)];
      break;
    }
    case POST_CONSTANTS.REMOVE_SINGLE_ITEM_FROM_CART: {
      error = [param("postId").custom(postExist)];
      break;
    }
  }
  return error;
};

export const userExist = async (value) => {
  let userExist = await Users.findOneDocument({ _id: value });
  if (!userExist) throw new Error("Operation failed User Not Found");
  return value;
};
export const postExist = async (value) => {
  console.log("value", value);
  let postExist = await Posts.findOneDocument({ _id: value });
  console.log(postExist);
  if (!postExist) throw new Error("Operation failed Post Not Found");
  return value;
};
