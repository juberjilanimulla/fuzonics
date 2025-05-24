import { Router } from "express";
import admincategoryRouter from "./admincategoryRouter.js";
import adminsubcategoryRouter from "./adminsubcategoryRouter.js";
import adminproductRouter from "./adminproductRouter.js";
import adminorderRouter from "./adminorderRouter.js";
import adminuserRouter from "./adminuserRouter.js";

const adminRouter = Router();

export default adminRouter;

adminRouter.use("/category", admincategoryRouter);
adminRouter.use("/subcategory", adminsubcategoryRouter);
adminRouter.use("/product", adminproductRouter);
adminRouter.use("/order", adminorderRouter);
adminRouter.use("/user", adminuserRouter);
