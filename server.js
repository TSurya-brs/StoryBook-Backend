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

// Load environment variables
dotenv.config();
connectdb();

// Resolve __dirname (for ES6 modules)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Backend Port Configuration (for Render or local)
const port = process.env.PORT || 9000; // Default to 9000 locally or Render will provide a dynamic port

// Initialize express app
const app = express();

// CORS Configuration to allow the frontend URL from Render (change this URL to your actual frontend URL in production)
const corsOptions = {
  origin: "https://storybook-frontend-u967.onrender.com", // Change this to your actual frontend URL on Render
  methods: ["GET", "POST", "PUT", "DELETE"], // Allow necessary HTTP methods
  credentials: true, // Allow cookies or authentication credentials if needed
};

// Apply CORS middleware
app.use(cors(corsOptions));

// Middleware for handling JSON and URL encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// Set up view engine (if you're rendering views)
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "src/templates"));

// Sample GET request to test
app.get("/", (req, res) => {
  res.send("Hello world");
});

// API Routes
app.use("/api/users", userRoute);
app.use("/api/stories", authorStoriesRoute);

// Error Handlers
app.use(notFound);
app.use(errorHandler);

// Start the server and log the port for debugging
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
