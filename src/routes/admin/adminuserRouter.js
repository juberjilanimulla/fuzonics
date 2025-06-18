import { Router } from "express";
import {
  errorResponse,
  successResponse,
} from "../../helpers/serverResponse.js";
import usermodel from "../../model/usermodel.js";

const adminuserRouter = Router();

export default adminuserRouter;
adminuserRouter.get("/", getalluserHandler);

async function getalluserHandler(req, res) {
  try {
    const user = await usermodel.find({ role: "user" });
    successResponse(res, "success", user);
  } catch (error) {
    console.log("error", error);
    errorResponse(res, 500, "internal server error");
  }
}
