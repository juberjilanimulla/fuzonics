import { Router } from "express";
import {
  successResponse,
  errorResponse,
} from "../../helpers/serverResponse.js";
import categorymodel from "../../model/categorymodel.js";
import subcategorymodel from "../../model/subcategorymodel.js";

const admincategoryRouter = Router();

export default admincategoryRouter;

admincategoryRouter.post("/create", createcategoryHandler);
admincategoryRouter.post("/:categoryid/create", createsubcategoryHandler);
admincategoryRouter.get("/getcategory", getcategoryHandler);
admincategoryRouter.get("/:id/getsubcategory", getsubcategoryHandler);
admincategoryRouter.get("/", getallcategorywithsubcategoryHandler);

async function createcategoryHandler(req, res) {
  try {
    const { name, description } = req.body;
    if (!name || !description) {
      return errorResponse(res, 400, "some params are missing");
    }
    const existcategory = await categorymodel.findOne({ name });
    if (existcategory) {
      return errorResponse(res, 404, "already exist category");
    }
    const category = await categorymodel.create({
      name,
      description,
    });
    successResponse(res, "success", category);
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

async function getcategoryHandler(req, res) {
  try {
    const category = await categorymodel.find({ isActive: true });
    successResponse(res, "success", category);
  } catch (error) {
    console.log("error", error);
    errorResponse(res, 500, "internal server error");
  }
}

async function getsubcategoryHandler(req, res) {
  try {
    const category = await categorymodel.findById(req.params.id);
    if (!category) {
      return errorResponse(res, 404, "category not found");
    }
    const subcategory = await subcategorymodel.find({
      category: req.params.id,
      isActive: true,
    });
    successResponse(res, "success", { category, subcategory });
  } catch (error) {
    console.log("error", error);
    errorResponse(res, 500, "internal server error");
  }
}

async function getallcategorywithsubcategoryHandler(req, res) {
  try {
    const categories = await categorymodel.find();
    const categoriesWithSubs = await Promise.all(
      categories.map(async (category) => {
        const subcategories = await subcategorymodel.find({
          category: category._id,
        });
        return {
          ...category.toObject(),
          subcategories,
        };
      })
    );
    successResponse(res, "success", { categories: categoriesWithSubs });
  } catch (error) {
    console.log("error", error);
    errorResponse(res, 500, "internal server error");
  }
}

async function updatecategoryHandler(req, res) {
  try {
  } catch (error) {
    console.log("error", error);
    errorResponse(res, 500, "internal server error");
  }
}
