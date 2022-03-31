import { body, param } from "express-validator";
import { CONSTANTS as USER_CONSTANTS } from "../../constants/user/user";
import { CONSTANTS as BOOK_CONSTANTS } from "../../constants/book/book";
import Users from "../../models/user.model";
import Books from "../../models/book.model";
export const validate = (method) => {
  let error = [];
  switch (method) {
    case BOOK_CONSTANTS.CREATE_BOOK: {
      error = [
        body("bookName", "bookName should not be empty").not().isEmpty(),
        body("bookCategory", "bookCategory should not be empty")
          .not()
          .isEmpty(),
        body("bookAuthor", "bookAuthor should not be empty").not().isEmpty(),
        body("bookPrice", "bookPrice should be numeric value")
          .not()
          .isEmpty()
          .isNumeric(),
        body("publishedDate", "publishedDate should be in valid format")
          .not()
          .isEmpty()
          .isDate(),
        body("pages", "pages should be numeric value")
          .not()
          .isEmpty()
          .isNumeric(),
      ];
      break;
    }
    case BOOK_CONSTANTS.REMOVE_SINGLE_BOOK: {
      error = [param("bookId").custom(bookExist)];
      break;
    }
    case BOOK_CONSTANTS.GET_SINGLE_BOOK: {
      error = [param("bookId").custom(bookExist)];
      break;
    }
    case BOOK_CONSTANTS.UPDATE_SINGLE_BOOK: {
      error = [param("bookId").custom(bookExist)];
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
export const bookExist = async (value) => {
  let bookExist = await Books.findOneDocument({ _id: value });
  if (!bookExist) throw new Error("This book does not exist");
  return value;
};
