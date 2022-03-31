import { Router } from "express";
import { handleResponse } from "../helper/utility";
import UserRoutes from "./user";
import BookRoutes from "./book";
import CartRoutes from "./cart";
const routes = new Router();
const PATH = {
  ROOT: "/",
  USER: "/users",
  BOOK: "/books",
  CART: "/cart",
};

routes.get("/healthCheck", (req, res) => {
  let dataObject = {
    message: "Server is running",
  };
  return handleResponse(res, dataObject);
});

routes.use(PATH.USER, UserRoutes);
routes.use(PATH.BOOK, BookRoutes);
routes.use(PATH.CART, CartRoutes);

export default routes;
