import { Router } from "express";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import fs from "fs-extra";
import multer from "multer";
import { v4 as uniqid } from "uuid";
import { checkSchema, validationResult } from "express-validator";
const currentWorkingFile = fileURLToPath(import.meta.url);
const currentWorkingDirectory = dirname(currentWorkingFile);
const publicFolderDirectory = join(
  currentWorkingDirectory,
  "../../../public/db/index.json"
);

const productsSchema = {
  Name: {
    isString: true,
    errorMessage: "A name is required",
  },
  Description: {
    isString: true,
    errorMessage: "A description is required",
  },
  Brand: {
    isString: true,
    errorMessage: "A brand is required",
  },
  Price: {
    isString: true,
    errorMessage: "A price is required",
  },
};

const productsRoutes = Router();

productsRoutes.get("/", async (req, res) => {
  try {
    const product = await fs.readJson(publicFolderDirectory);
    res.send(product);
  } catch (error) {
    console.log(error);
    res.send({ messege: erorr });
  }
});

productsRoutes.post("/", checkSchema(productsSchema), async (req, res) => {
  try {
    const newProduct = {
      ...req.body,
      _id: uniqid(),
      createdAt: new Date(),
      reviews: [],
    };
    const products = await fs.readJson(publicFolderDirectory);
    products.push(newProduct);
    await fs.writeFile(publicFolderDirectory, JSON.stringify(products));
    res.send(201, products);
  } catch (error) {
    console.log(error);
    res.send({ messege: erorr });
  }
});
productsRoutes.put("/:id", async (req, res) => {
  try {
    const products = await fs.readJson(publicFolderDirectory); // READING ALL THE DATABASE
    const filteredProducts = products.filter(
      (product) => product._id !== req.params.id
    ); // FILTERING THE DATABASE WITHOUT THE USELESS ITEM
    const modifiedProduct = {
      ...req.body,
      _id: req.params.id,

      updatedAt: new Date(),
    }; // CREATING THE MODIFIED PRODUCT WITH THE PREVIOUS NEEDED PARAMS SUCH AS THE ID
    filteredProducts.push(modifiedProduct);
    await fs.writeFile(publicFolderDirectory, JSON.stringify(filteredProducts));
    res.send(201, filteredProducts);
  } catch (error) {
    console.log(error);
  }
});
productsRoutes.delete("/:id", async (req, res) => {
  try {
    const products = await fs.readJson(publicFolderDirectory);
    const filteredProducts = products.filter(
      (product) => product._id !== req.params.id
    );
    await fs.writeFile(publicFolderDirectory, JSON.stringify(filteredProducts));
    res.send(200, filteredProducts);
  } catch (error) {}
});
export default productsRoutes;
