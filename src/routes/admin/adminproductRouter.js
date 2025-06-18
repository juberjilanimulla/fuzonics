import { Router } from "express";
import {
  errorResponse,
  successResponse,
} from "../../helpers/serverResponse.js";
import productmodel from "../../model/productmodel.js";

const adminproductRouter = Router();

export default adminproductRouter;

adminproductRouter.get("/", getproductHandler);
adminproductRouter.post("/create", createproductHandler);
adminproductRouter.put("/update/:id", updateproductHandler);
adminproductRouter.delete("/delete/:id", deleteproductHandler);

async function createproductHandler(req, res) {
  try {
    const {
      name,
      description,
      qty,
      productcode,
      color,
      images,
      discountprice,
      category,
      subcategory,
      brand,
      model,
      specification,
      stock,
      sku,
      price,
      isActive,
      isFeatured,
    } = req.body;

    // Validation
    if (!name || !price || !sku) {
      return errorResponse(res, 400, "Name, Price, and SKU are required");
    }

    // Check for duplicate SKU
    const existSKU = await productmodel.findOne({ sku });
    if (existSKU) {
      return errorResponse(res, 409, "Product with this SKU already exists");
    }

    const product = await productmodel.create({
      name,
      description,
      qty,
      productcode,
      color,
      images,
      discountprice,
      category,
      subcategory,
      brand,
      model,
      specification,
      stock,
      sku,
      price,
      isActive,
      isFeatured,
    });

    successResponse(res, "Product created successfully", product);
  } catch (error) {
    console.log("error", error);
    errorResponse(res, 500, "internal server error");
  }
}

async function getproductHandler(req, res) {
  try {
    const product = await productmodel.find();
    successResponse(res, "success", product);
  } catch (error) {
    console.log("error", error);
    errorResponse(res, 500, "internal server error");
  }
}

async function updateproductHandler(req, res) {
  try {
     const { id } = req.params;

    // Check if product exists
    const product = await productmodel.findById(id);
    if (!product) {
      return errorResponse(res, 404, "Product not found");
    }

    const updateFields = req.body;

    // Optional: prevent SKU duplication
    if (updateFields.sku && updateFields.sku !== product.sku) {
      const existingSKU = await productmodel.findOne({
        sku: updateFields.sku,
        _id: { $ne: id },
      });
      if (existingSKU) {
        return errorResponse(res, 409, "Another product with this SKU already exists");
      }
    }

    // Update and save
    const updatedProduct = await productmodel.findByIdAndUpdate(
      id,
      { $set: updateFields },
      { new: true, runValidators: true }
    );

    successResponse(res, "Product updated successfully", updatedProduct);
  } catch (error) {
    console.log("error", error);
    errorResponse(res, 500, "internal server error");
  }
}

async function deleteproductHandler(req, res) {
  try {
    const { id } = req.params;
    if (!id) {
      return errorResponse(res, 400, "some params are missing");
    }

    const product = await productmodel.findByIdAndDelete(id);
    successResponse(res, "successfully delete");
  } catch (error) {
    console.log("error", error);
    errorResponse(res, 500, "internal server error");
  }
}
