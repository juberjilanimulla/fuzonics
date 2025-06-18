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
    const { id } = req.params;
    const { name, description, categoryid } = req.body;

    if (!id) {
      return errorResponse(res, 400, "Subcategory ID is missing");
    }

    const subcategory = await subcategorymodel.findById(id);
    if (!subcategory) {
      return errorResponse(res, 404, "Subcategory not found");
    }

    // If category is changing, validate it
    if (categoryid) {
      const category = await categorymodel.findById(categoryid);
      if (!category) {
        return errorResponse(res, 404, "New category not found");
      }
      subcategory.category = categoryid;
    }

    // If name is being updated, check for duplicates within the (possibly updated) category
    if (name && name !== subcategory.name) {
      const existing = await subcategorymodel.findOne({
        name,
        category: categoryid || subcategory.category,
        _id: { $ne: id },
      });
      if (existing) {
        return errorResponse(
          res,
          409,
          "Subcategory with this name already exists in the category"
        );
      }
      subcategory.name = name;
    }

    if (description) {
      subcategory.description = description;
    }

    await subcategory.save();

    successResponse(res, "Subcategory updated successfully", subcategory);
  } catch (error) {
    console.log("error", error);
    errorResponse(res, 500, "internal server error");
  }
}

async function deletesubcategoryHandler(req, res) {
  try {
    const { id } = req.params;
    if (!id) {
      return errorResponse(res, 400, "some params are missing");
    }
    const subcategory = await subcategorymodel.findByIdAndDelete(id);
    if (!subcategory) {
      return errorResponse(res, 404, "invalid subcategoryid");
    }
    successResponse(res, "successfully deleted");
  } catch (error) {
    console.log("error", error);
    errorResponse(res, 500, "internal server error");
  }
}
