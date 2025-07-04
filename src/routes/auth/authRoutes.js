import { Router } from "express";
import {
  errorResponse,
  successResponse,
} from "../../helpers/serverResponse.js";
import usermodel from "../../model/usermodel.js";
import {
  bcryptPassword,
  checkRateLimit,
  comparePassword,
  generateAccessToken,
} from "../../helpers/helperFunction.js";

const authRouter = Router();

authRouter.post("/signin", signinHandler);
authRouter.post("/forgotpassword", forgetpasswordHandler);
authRouter.post("/resetpassword", resetpasswordHandler);
authRouter.post("/signup", signupHandler);

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

async function forgetpasswordHandler(req, res) {
  try {
    const { email } = req.body;
    if (!email) {
      return errorResponse(res, 400, "some params are missing");
    }
    const user = await usermodel.findOne({ email });
    if (!user) {
      return errorResponse(res);
    }
    const isWithinRateLimit = await checkRateLimit(email);
    if (!isWithinRateLimit) {
      return errorResponse(
        res,
        429,
        "Too many requests. Please try again after 15 minutes"
      );
    }
    // usersotp.tokenotp = await sendEmailOTP(email, usersotp.firstname);
    await usersotp.save();
    successResponse(res, "OTP successfully sent");
  } catch (error) {
    console.log("error", error);
    errorResponse(res, 500, "internal server error");
  }
}

async function resetpasswordHandler(req, res) {
  try {
  } catch (error) {
    console.log("error", error);
    errorResponse(res, 500, "internal server error");
  }
}

async function signupHandler(req, res) {
  try {
    const { firstname, lastname, email, mobile, address, password } = req.body;
    if (!firstname || !lastname || !email || !mobile || !address || !password) {
      return errorResponse(res, 400, "some params are missing");
    }

    const existingUser = await usermodel.findOne({ email });
    if (existingUser) {
      return errorResponse(res, 409, "User with this email already exists");
    }
    const existingMobile = await usermodel.findOne({ mobile });
    if (existingMobile) {
      return errorResponse(res, 409, "User with this mobile already exists");
    }

    const hashedpassword = bcryptPassword(password);
    const user = await usermodel.create({
      firstname,
      lastname,
      email,
      mobile,
      address,
      password: hashedpassword,
    });
    if (!user) {
      return errorResponse(res, 404, "user not created");
    }
    successResponse(res, "success", user);
  } catch (error) {
    console.log("error", error);
    errorResponse(res, 500, "internal server error");
  }
}
