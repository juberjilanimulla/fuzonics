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
admincategoryRouter.put("/update/:id", updatecategoryHandler);
admincategoryRouter.delete("/delete/:id", deletecategoryHandler);
admincategoryRouter.get("/getcategory", getcategoryHandler);
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

async function getcategoryHandler(req, res) {
  try {
    const category = await categorymodel.find({ isActive: true });
    successResponse(res, "success", category);
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
    const { id } = req.params;
    const { name, description } = req.body;

    const category = await categorymodel.findById(id);
    if (!category) {
      return errorResponse(res, 404, "Category not found");
    }

    // Check if the new name already exists in another category
    const existingCategory = await categorymodel.findOne({
      name,
      _id: { $ne: id },
    });
    if (existingCategory) {
      return errorResponse(res, 409, "Category name already in use");
    }

    category.name = name;
    category.description = description;
    await category.save();

    successResponse(res, "Category updated successfully", category);
  } catch (error) {
    console.log("error", error);
    errorResponse(res, 500, "internal server error");
  }
}

async function deletecategoryHandler(req, res) {
  try {
    const { id } = req.params;
    if (!id) {
      return errorResponse(res, 400, "Category ID is missing");
    }
    const category = await categorymodel.findByIdAndDelete(id);
    if (!category) {
      return errorResponse(res, 404, "Category not found");
    }
    successResponse(res, "Category deleted successfully");
  } catch (error) {
    console.log("error", error);
    errorResponse(res, 500, "internal server error");
  }
}
