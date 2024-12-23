import Story from "../models/authorStoriesModel.js";

const authorStory = async (req, res, next) => {
  const { content, title } = req.body;

  const userId = req.user.userId;
  const userName = req.user.name;

  if (!content || !title) {
    return res.status(400).json({ message: "Please fill all the fields." });
  }

  try {
    const story = await Story.create({
      title,
      content,
      author_id: userId,
      author: userName,
      likes: 0,
      comments: [],
    });

    res.status(201).json({ message: "Story saved successfully", story });
  } catch (error) {
    console.error("Error creating story:", error);
    return res.status(500).json({ message: "Failed to save the story." });
  }
};

const authorpostedstorieslist = async (req, res, next) => {
  const userId = req.user.userId;
  try {
    const stories = await Story.find({ author_id: userId });
    res.json(stories);
  } catch (error) {
    console.error("Error fetching stories:", error);
    next(error);
  }
};

const fetchSingleStory = async (req, res) => {
  const { storyId } = req.params;
  console.log("Fetching story with ID:", storyId);

  try {
    const story = await Story.findById(storyId);

    if (!story) {
      return res.status(404).json({ message: "Story not found" });
    }
    return res.status(200).json(story);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

const authorEditStory = async (req, res, next) => {
  const { storyId } = req.params;
  const { title, content } = req.body;

  try {
    const story = await Story.findById(storyId);

    story.title = title;
    story.content = content;

    await story.save();

    return res.status(200).json({ message: "Story updated successfully" });
  } catch (error) {
    return next(error);
  }
};

const authorDeleteStory = async (req, res, next) => {
  const storyId = req.params.storyId;

  try {
    const story = await Story.findById(storyId);
    await story.deleteOne();
    res.status(200).json({ message: "Story deleted successfully" });
  } catch (error) {
    console.error("Error deleting story:", error);
    res.status(500).json({ message: "Failed to delete the story" });
  }
};

//Getting stories
const Storylist = async (req, res, next) => {
  try {
    const stories = await Story.find();
    res.json(stories);
  } catch (error) {
    console.error("Error fetching stories:", error);
    next(error);
  }
};

// Liking story
let flag = 0;
const likeStory = async (req, res) => {
  const { storyId } = req.params;
  const { userId } = req.body;

  try {
    const story = await Story.findById(storyId);

    if (!story) {
      return res.status(404).json({ message: "Story not found" });
    }

    const userIndex = story.liked_by_id.includes(userId);

    if (!userIndex) {
      story.liked_by_id.push(userId);
      story.likes += 1;
      flag = 1;
    }
    if (userIndex && flag === 1) {
      story.liked_by_id = story.liked_by_id.filter((id) => id !== userId);
      story.likes -= 1;
      flag = 0;
    }
    // console.log(flag);

    await story.save();

    return res.status(200).json({
      message: "Like status updated successfully",
      likes: story.likes,
      liked_by_id: story.liked_by_id,
    });
  } catch (error) {
    console.error("Error updating like:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const commentStory = async (req, res, next) => {
  const { storyId } = req.params;
  const { comment } = req.body;

  try {
    const story = await Story.findById(storyId);
    if (!story) {
      return res.status(404).json({ message: "Story not found" });
    }

    story.comments.push(comment);
    await story.save();

    return res.status(200).json({ message: "Comment added successfully" });
  } catch (error) {
    return next(error);
  }
};

const trendingStories = async (req, res, next) => {
  try {
    const stories = await Story.find().sort({ likes: -1 });

    res.status(200).json(stories);
  } catch (error) {
    console.error("Error fetching trending stories:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export {
  authorStory,
  authorpostedstorieslist,
  fetchSingleStory,
  authorEditStory,
  authorDeleteStory,
  Storylist,
  commentStory,
  likeStory,
  trendingStories,
};
