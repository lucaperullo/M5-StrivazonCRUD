import express from "express";
import cors from "cors";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import productsRoutes from "../src/services/ files/index.js";
import reviewsRoutes from "../src/reviews/index.js";
const server = express();
server.use(cors());
server.use(express.json());
server.use("/product", productsRoutes);
server.use("/review", reviewsRoutes);
const PORT = process.env.PORT || 4200;
server.listen(PORT, () =>
  console.log("the server is listening on port : " + PORT)
);
