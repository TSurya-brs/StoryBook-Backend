import express from "express";
import {
  authorStory,
  authorpostedstorieslist,
  fetchSingleStory,
  authorEditStory,
  Storylist,
  likeStory,
  commentStory,
  authorDeleteStory,
  trendingStories,
} from "../controllers/authorStoriesController.js";
import checkAuthorAuthentication from "../middlewares/checkAuthentication.js";

const router = express.Router();

//author
router.post("/", checkAuthorAuthentication, authorStory);
router.get(
  "/authorstories",
  checkAuthorAuthentication,
  authorpostedstorieslist
);
router.get("/list", Storylist);
router.get("/trending", trendingStories);
router.get("/:storyId", checkAuthorAuthentication, fetchSingleStory);
router.put("/:storyId/editstory", checkAuthorAuthentication, authorEditStory);
router.delete(
  "/:storyId/deletestory",
  checkAuthorAuthentication,
  authorDeleteStory
);

router.post("/:storyId/like", likeStory);
router.post("/:storyId/comment", commentStory);

export default router;
