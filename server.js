import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// Database connection
import connectdb from "./src/config/db.js";
import { notFound, errorHandler } from "./src/middlewares/errMiddleware.js";

// Routes
import userRoute from "./src/routes/userRoute.js";
import authorStoriesRoute from "./src/routes/authorStoriesRoute.js";

const port = process.env.PORT || 9000;
const app = express();
dotenv.config();
connectdb();

// Resolve __dirname (for ES6 modules)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// Set view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "src/templates"));

// Sample GET request
app.get("/", (req, res) => {
  res.send("Hello world");
});

// API routes
app.use("/api/users", userRoute);
app.use("/api/stories", authorStoriesRoute);

// Error Handlers
app.use(notFound);
app.use(errorHandler);

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
