import { Router } from "express";
import {
  errorResponse,
  successResponse,
} from "../../helpers/serverResponse.js";
import subcategorymodel from "../../model/subcategorymodel.js";
import categorymodel from "../../model/categorymodel.js";

const adminsubcategoryRouter = Router();

export default adminsubcategoryRouter;
adminsubcategoryRouter.get("/", getsubcategoryHandler);
adminsubcategoryRouter.post("/:categoryid/create", createsubcategoryHandler);
adminsubcategoryRouter.put("/update/:id", updatesubcategoryHandler);
adminsubcategoryRouter.delete("/delete/:id", deletesubcategoryHandler);

async function getsubcategoryHandler(req, res) {
  try {
    const subcategory = await subcategorymodel.find();
    successResponse(res, "success", subcategory);
  } catch (error) {
    console.log("error", error);
    errorResponse(res, 500, "internal server error");
  }
}

async function createsubcategoryHandler(req, res) {
  try {
    const { name, description } = req.body;
    if (!name || !description) {
      return errorResponse(res, 400, "some params are missing");
    }
    const { categoryid } = req.params;
    const category = await categorymodel.findById(categoryid);
    if (!category) {
      return errorResponse(res, 404, "category not found");
    }
    const existingSubCategory = await subcategorymodel.findOne({
      name,
      category: categoryid,
    });
    if (existingSubCategory) {
      return errorResponse(
        res,
        400,
        "Subcategory already exists in this category"
      );
    }
    const subcategory = await subcategorymodel.create({
      name,
      description,
      category: categoryid,
    });
    successResponse(res, "success", subcategory);
  } catch (error) {
    console.log("error", error);
    errorResponse(res, 500, "internal server error");
  }
}

async function updatesubcategoryHandler(req, res) {
  try {
  } catch (error) {
    console.log("error", error);
    errorResponse(res, 500, "internal server error");
  }
}

async function deletesubcategoryHandler(req, res) {
  try {
  } catch (error) {
    console.log("error", error);
    errorResponse(res, 500, "internal server error");
  }
}
