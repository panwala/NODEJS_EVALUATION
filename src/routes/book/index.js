import { Router } from "express";
const usersCtrl = require("../../controller/user/user.controller");
const booksCtrl = require("../../controller/book/book.controller");
import * as ErrorMiddleware from "../../middleware/validatorError";
import { validate as UserValidate } from "../../validator/user/user.validator";
import { validate as BookValidate } from "../../validator/book/book.validator";
import { CONSTANTS as USER_CONSTANTS } from "../../constants/user/user";
import { CONSTANTS as BOOK_CONSTANTS } from "../../constants/book/book";
import { AuthMiddleware } from "../../middleware/authMiddleware";
const routes = new Router();
const PATH = {
  ROOT: "/",
  UPDATE_BOOK: "/updatebook/:bookId",
  OPERATION_BOOK: "/bookoperation/:bookId",
  AUTOCOMPLETE_SEARCH_BOOK: "/autocomplete",
};
routes
  .route(PATH.ROOT)
  .post(
    [
      AuthMiddleware,
      BookValidate(BOOK_CONSTANTS.CREATE_BOOK),
      ErrorMiddleware.ExpressValidatorError,
    ],
    booksCtrl.addBook
  )
  .get(AuthMiddleware, booksCtrl.getAllBooks);
routes
  .route(PATH.AUTOCOMPLETE_SEARCH_BOOK)
  .post(AuthMiddleware, booksCtrl.getautocompleteAllBooks);
routes
  .route(PATH.UPDATE_BOOK)
  .patch(
    [
      AuthMiddleware,
      BookValidate(BOOK_CONSTANTS.UPDATE_SINGLE_BOOK),
      ErrorMiddleware.ExpressValidatorError,
    ],
    booksCtrl.updateSingleBook
  );
routes
  .route(PATH.OPERATION_BOOK)
  .delete(
    [
      AuthMiddleware,
      BookValidate(BOOK_CONSTANTS.REMOVE_SINGLE_BOOK),
      ErrorMiddleware.ExpressValidatorError,
    ],
    booksCtrl.removeSingleBook
  )
  .get(
    [
      AuthMiddleware,
      BookValidate(BOOK_CONSTANTS.GET_SINGLE_BOOK),
      ErrorMiddleware.ExpressValidatorError,
    ],
    booksCtrl.getSingleBook
  );

export default routes;
