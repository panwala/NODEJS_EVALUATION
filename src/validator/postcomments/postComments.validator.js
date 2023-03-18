const { body, param } = require("express-validator");
const {
  CONSTANTS: POSTCOMMENT_CONSTANTS,
} = require("../../constants/postcomment/postcomment");
import Users from "../../models/user.model";
import Posts from "../../models/post.model";
export const validate = (method) => {
  let error = [];
  switch (method) {
    case POSTCOMMENT_CONSTANTS.CREATE_POST_COMMENTS: {
      error = [
        param("postId").custom(postExist),
        body("comment", "comment should not be empty").not().isEmpty(),
      ];
      break;
    }
    case POSTCOMMENT_CONSTANTS.REMOVE_POST_COMMENTS: {
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
