import { Router } from "express";
import {
  errorResponse,
  successResponse,
} from "../../helpers/serverResponse.js";
import usermodel from "../../model/usermodel.js";
import {
  comparePassword,
  generateAccessToken,
} from "../../helpers/helperFunction.js";

const authRouter = Router();

authRouter.post("/signin", signinHandler);
authRouter.post("/forgotpassword",forgetpasswordHandler);

export default authRouter;

async function signinHandler(req, res) {
  try {
    const email = req.body.email;
    const password = req.body.password;
    const user = await usermodel.findOne({ email });
    if (!user) {
      return errorResponse(res, 404, "email not found");
    }
    const comparepassword = comparePassword(password, user.password);
    if (!comparepassword) {
      return errorResponse(res, 404, "invalid password");
    }
    const userid = user._id.toString();

    const { encoded_token, public_token } = generateAccessToken(
      userid,
      user.email,
      user.role
    );

    successResponse(res, "SignIn successfully", {
      encoded_token,
      public_token,
    });
  } catch (error) {
    console.log("error", error);
    errorResponse(res, 500, "internal server error");
  }
}

async function forgetpasswordHandler(req,res){
  try {
    const {email} = req.body;
    if(!email){
      return errorResponse(res,400,"some params are missing")
    }
  } catch (error) {
    console.log("error",error);
    errorResponse(res,500,"internal server error")
  }
}