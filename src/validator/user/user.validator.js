import { body, param } from "express-validator";
import { CONSTANTS as USER_CONSTANTS } from "../../constants/user/user";
import Users from "../../models/user.model";
export const validate = (method) => {
  let error = [];
  switch (method) {
    case USER_CONSTANTS.CREATE_USER: {
      error = [
        body("user_name", "userName should not be empty").not().isEmpty(),
        body("email", "Invalid Email")
          .not()
          .isEmpty()
          .isEmail()
          .custom(verifyEmailId),
        body("password", "Password should not be empty").not().isEmpty(),
        body("mobile_no", "Please enter 10 digit mobile no")
          .not()
          .isEmpty()
          .isLength(10),
        body("address", "Address should not be empty").not().isEmpty(),
        body("gender", "gender should not be empty").not().isEmpty(),
        body("dob", "Date of birth should be in valid format")
          .not()
          .isEmpty()
          .isDate(),
      ];
      break;
    }
    case USER_CONSTANTS.LOGIN_USER: {
      error = [
        body("email", "Invalid Email").not().isEmpty().isEmail(),
        body("password", "Password should not be empty").not().isEmpty(),
      ];
      break;
    }
  }
  return error;
};

export const verifyEmailId = async (value) => {
  let emailExist = await Users.findOneDocument({ email: value });
  if (emailExist) throw new Error("This email already exist");
  return value;
};

export const verifyValueEmailId = async (value) => {
  let emailExist = await Users.findOneDocument({ email: value });
  const emailRegexp =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  if (emailRegexp.test(emailExist)) return value;
};
export const userExist = async (value) => {
  let userExist = await Users.findOneDocument({ _id: value });
  if (!userExist) throw new Error("This user does not exist");
  return value;
};
