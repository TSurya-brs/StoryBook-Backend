import Story from "../models/authorStoriesModel.js";

const authorStory = async (req, res, next) => {
  const { content, title } = req.body;

  const userId = req.user.userId; // Retrieved from middleware
  const userName = req.user.name; // Retrieved from middleware

  if (!content || !title) {
    return res.status(400).json({ message: "Please fill all the fields." });
  }

  try {
    const story = await Story.create({
      title,
      content,
      author_id: userId, // MongoDB ObjectId
      author: userName, // Name of the author
      likes: 0, // Default value
      comments: [], // Default value
    });

    res.status(201).json({ message: "Story saved successfully", story });
  } catch (error) {
    console.error("Error creating story:", error);
    return res.status(500).json({ message: "Failed to save the story." });
  }
};

//To view the list of stories posted by the author
const authorpostedstorieslist = async (req, res, next) => {
  const userId = req.user.userId; // Retrieved from middleware
  try {
    const stories = await Story.find({ author_id: userId });
    res.json(stories);
  } catch (error) {
    console.error("Error fetching stories:", error);
    next(error);
  }
};

//Gettinga single storydata forediting
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

//Editing a story
const authorEditStory = async (req, res, next) => {
  const { storyId } = req.params;
  const { title, content } = req.body;

  try {
    // Find the story by its ID
    const story = await Story.findById(storyId);
    // if (!story) {
    //   return res.status(404).json({ message: "Story not found" });
    // }

    // // Check if the logged-in user is the author of the story
    // if (story.author.toString() !== req.user.userId.toString()) {
    //   return res
    //     .status(403)
    //     .json({ message: "You are not authorized to edit this story" });
    // }

    // Update the story title and content
    story.title = title;
    story.content = content;

    // Save the updated story
    await story.save();

    return res.status(200).json({ message: "Story updated successfully" });
  } catch (error) {
    return next(error);
  }
};

//Deleting a story
const authorDeleteStory = async (req, res, next) => {
  const storyId = req.params.storyId;
  // const userId = req.user.userId; // Assuming `userId` is set by the middleware

  try {
    const story = await Story.findById(storyId);
    // if (!story) {
    //   return res.status(404).json({ message: "Story not found" });
    // }
    // if (story.author_id.toString() !== userId) {
    //   return res.status(403).json({ message: "Unauthorized to delete this story" });
    // }

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
    const stories = await Story.find(); // Fetch all stories from the database
    res.json(stories); // Return the array of stories
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

    // Check if the user has already liked the story
    const userIndex = story.liked_by_id.includes(userId);

    if (!userIndex) {
      // If user has not liked, add their ID and increment likes
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

    // Add the comment to the story's comments array
    story.comments.push(comment);
    await story.save();

    return res.status(200).json({ message: "Comment added successfully" });
  } catch (error) {
    return next(error);
  }
};

const trendingStories = async (req, res, next) => {
  try {
    // Fetch stories sorted by likes in descending order
    const stories = await Story.find().sort({ likes: -1 });

    // Add trending numbers to stories
    // const trendingStories = stories.map((story, index) => ({
    //   ...story.toObject(),
    //   trending: index + 1,
    // }));
    // console.log(stories);
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
