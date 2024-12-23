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

dotenv.config();
connectdb();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const port = process.env.PORT || 9000;

const app = express();

const corsOptions = {
  origin: "https://storybook-frontend-u967.onrender.com",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
};

app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "src/templates"));

app.get("/", (req, res) => {
  res.send("Hello world");
});

// API Routes
app.use("/api/users", userRoute);
app.use("/api/stories", authorStoriesRoute);

// Error Handlers
app.use(notFound);
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
