import { Router } from "express";
const cartsCtrl = require("../../controller/cart/cart.controller");
const booksCtrl = require("../../controller/book/book.controller");
import * as ErrorMiddleware from "../../middleware/validatorError";
import { validate as CartValidate } from "../../validator/cart/cart.validator";
import { validate as BookValidate } from "../../validator/book/book.validator";
import { CONSTANTS as CART_CONSTANTS } from "../../constants/cart/cart";
import { CONSTANTS as BOOK_CONSTANTS } from "../../constants/book/book";
import { AuthMiddleware } from "../../middleware/authMiddleware";
const routes = new Router();
const PATH = {
  ROOT: "/",
  ADD_ITEM_TO_CART: "/additemtocart",
  REMOVE_ITEM_FROM_CART: "/removeitemfromcart",
  REMOVE_ALL_ITEMS_OF_CART_OF_USER: "/removeallitemsofcartofuser",
};
routes
  .route(PATH.ADD_ITEM_TO_CART)
  .post(
    [
      AuthMiddleware,
      CartValidate(CART_CONSTANTS.ADD_ITEM_TO_CART),
      ErrorMiddleware.ExpressValidatorError,
    ],
    cartsCtrl.addItemtoCart
  );
routes
  .route(PATH.REMOVE_ITEM_FROM_CART)
  .delete(
    [
      AuthMiddleware,
      CartValidate(CART_CONSTANTS.REMOVE_SINGLE_ITEM_FROM_CART),
      ErrorMiddleware.ExpressValidatorError,
    ],
    cartsCtrl.removeSingleItemFromCart
  );
routes
  .route(PATH.REMOVE_ALL_ITEMS_OF_CART_OF_USER)
  .delete(
    [
      AuthMiddleware,
      CartValidate(CART_CONSTANTS.REMOVE_ALL_ITEMS_OF_CART_OF_USER),
      ErrorMiddleware.ExpressValidatorError,
    ],
    cartsCtrl.removeAllitemsofSingleUserFromCart
  );
routes
  .route(PATH.ROOT)
  .get(
    [
      AuthMiddleware,
      CartValidate(CART_CONSTANTS.GET_ALL_ITEMS_OF_CART_OF_USER),
      ErrorMiddleware.ExpressValidatorError,
    ],
    cartsCtrl.getAllItemsofCartOfUser
  );

export default routes;
