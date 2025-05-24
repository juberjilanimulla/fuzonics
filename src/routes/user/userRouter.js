import { Router } from "express";
import userproductRouter from "./userproductRouter.js";
import usercategoryRouter from "./usercategoryRouter.js";
import usersubcategoryRouter from "./usersubcategoryRouter.js";
import userorderRouter from "./userorderRouter.js";
import usercartRouter from "./usercartRouter.js";
import usershippingRouter from "./usershipppingRouter.js";

const userRouter = Router();

export default userRouter;

userRouter.use("/product", userproductRouter);
userRouter.use("/category", usercategoryRouter);
userRouter.use("/subcategory", usersubcategoryRouter);
userRouter.use("/order", userorderRouter);
userRouter.use("/cart", usercartRouter);
userRouter.use("/shipping", usershippingRouter);
