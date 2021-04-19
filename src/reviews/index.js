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
  "../../public/db/index.json"
);

const reviewsSchema = {
  Comment: {
    isString: true,
    errorMessage: "A description is required",
  },
  Rate: {
    isInt: { min: 1, max: 5 },
    errorMessage: "A rate is required",
  },
};

const reviewsRoutes = Router();

reviewsRoutes.get("/", async (req, res) => {
  try {
    const Review = await fs.readJson(publicFolderDirectory);
    res.send(Review);
  } catch (error) {
    console.log(error);
    res.send({ messege: erorr });
  }
});

reviewsRoutes.get("/:productID/:id", async (req, res) => {
  try {
    const products = await fs.readJson(publicFolderDirectory);
    console.log("PRODUCT : " + products);
    const productt = [...products].filter(
      (product) => product._id === req.params.productID
    );
    console.log(productt);
    const revieww = productt[0].reviews.filter(
      (review) => review._id === req.params.id
    );
    res.send(revieww);
  } catch (error) {
    console.log(error);
    res.send({ messege: error });
  }
});

reviewsRoutes.post(
  "/:productID",
  checkSchema(reviewsSchema),
  async (req, res) => {
    try {
      const newReview = { ...req.body, _id: uniqid(), createdAt: new Date() };

      const products = await fs.readJson(publicFolderDirectory);
      const filteredProduct = await products.findIndex(
        (product) => product._id === req.params.productID
      );
      await products[filteredProduct].reviews.push(newReview);
      await fs.writeFile(publicFolderDirectory, JSON.stringify(products));
      res.send(201, products);
    } catch (error) {
      console.log(error);
      res.send({ messege: error });
    }
  }
);
reviewsRoutes.put("/:productID/:id", async (req, res) => {
  try {
    const products = await fs.readJson(publicFolderDirectory); // READING ALL THE DATABASE
    const filteredProduct = products.filter(
      (product) => product._id === req.params.productID
    );
    const filteredReviews = filteredProduct[0].reviews.filter(
      (review) => review._id === req.params.id
    );
    const newFilteredReview = { ...filteredReviews, updatedAt: new Date() };
    const oldStuff = await fs.readFile(publicFolderDirectory);
    await fs.writeFile(
      ...(oldStuff + publicFolderDirectory),
      JSON.stringify(newFilteredReview)
    );
    res.send(newFilteredReview);
  } catch (error) {
    console.log(error);
  }
});
reviewsRoutes.delete("/:id", async (req, res) => {
  try {
    const reviews = await fs.readJson(publicFolderDirectory);
    const filteredreviews = reviews.filter(
      (Review) => Review._id !== req.params.id
    );
    await fs.writeFile(publicFolderDirectory, JSON.stringify(filteredreviews));
    res.send(200, filteredreviews);
  } catch (error) {}
});
export default reviewsRoutes;
