const { body, param } = require("express-validator");
const {
  CONSTANTS: FOLLOWER_CONSTANTS,
} = require("../../constants/follower/follower");
import Users from "../../models/user.model";
export const validate = (method) => {
  let error = [];
  switch (method) {
    case FOLLOWER_CONSTANTS.CREATE_FOLLOWER: {
      error = [param("userId").custom(userExist)];
      break;
    }
    case FOLLOWER_CONSTANTS.REMOVE_FOLLOWER: {
      error = [param("userId").custom(userExist)];
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
