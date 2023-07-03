import mongoose from "mongoose";
import PostMessage from "../models/postMessage.js";

export const getPosts = async (req, res) => {
  const { page } = req.query;

  try {
    const LIMIT = 6;
    const startingIndex = (Number(page) - 1) * LIMIT; //get starting of current page
    const totalPages = await PostMessage.countDocuments();
    const posts = await PostMessage.find()
      .sort({ _id: -1 })
      .limit(LIMIT)
      .skip(startingIndex);
    // console.log(
    //   "start: " + startingIndex,
    //   "fetchedPosts: " + posts.length,
    //   "pageCounts: " + totalPages
    // );
    //sorting from newest to oldest, and getting LIMIT posts, starting from startIndex
    res.status(200).json({
      data: posts,
      currentPage: page,
      numberOfPages: Math.ceil(totalPages / LIMIT),
    });
  } catch (error) {
    res.status(500).json({ message: error.me });
  }
};

export const getPost = async (req, res) => {
  const { id } = req.params;
  console.log("Want to get this post=> ", id);
  try {
    if (!mongoose.Types.ObjectId.isValid(id))
      return res
        .status(404)
        .json({ message: "Invalid Post ID, Post not Found!!!" });
    else {
      // console.log("Valid Post ID, Entered here");
      const post = await PostMessage.findById(id);
      return res.status(200).json(post);
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};

export const getPostBySearch = async (req, res) => {
  const { searchQuery, tags } = req.query;
  console.log("Recieved query at backend: ", searchQuery, tags);
  try {
    const title = new RegExp(searchQuery, "i");
    const posts = await PostMessage.find({
      $or: [{ title }, { tags: { $in: tags.split(",") } }],
    });
    res.status(200).json(posts);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: err.message });
  }
};

export const createPost = async (req, res) => {
  console.log("got the userId in createPost: ", req.userId);
  const body = await req.body;
  const post = new PostMessage({ ...body, creator: req.userId });
  try {
    const savedPost = await post.save();
    res.status(201).json(savedPost);
  } catch (err) {
    res.status(408).json(err);
  }
};

export const updatePost = async (req, res) => {
  const id = await req.params.id;
  if (!mongoose.Types.ObjectId.isValid(id))
    res.status(404).json({ message: "No post with the specific ID" });
  else {
    const modifiedReq = await req.body;
    try {
      const updatedPost = await PostMessage.findByIdAndUpdate(
        id,
        { ...modifiedReq, _id: id },
        {
          new: true,
        }
      );
      res.status(201).json({ updatedPost });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
};

export const deletePost = async (req, res) => {
  const _id = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(_id))
    res.status(500).json({ message: "invalid post id" });
  try {
    await PostMessage.findByIdAndDelete(_id);
    res.status(200).json({ message: "Deleted succesfully" });
  } catch (error) {
    res.status(500).json(error);
  }
};

export const likePost = async (req, res) => {
  const id = req.params.id;
  if (!req.userId)
    return res.status(500).json({ message: "User not authenticated" });
  if (!id || !mongoose.Types.ObjectId.isValid(id))
    res.status(500).json({ message: "Post not found" });

  try {
    const post = await PostMessage.findById(id);
    const index = post.likes.findIndex((id) => id === String(req.userId));

    if (index === -1) {
      //likepost
      post.likes.push(String(req.userId));
    } else {
      //remove like from the post
      post.likes = post.likes.filter((id) => id !== String(req.userId));
    }

    const updatedPost = await PostMessage.findByIdAndUpdate(id, post, {
      new: "true",
    });
    res.status(200).json(updatedPost);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

export const comment = async (req, res) => {
  const {id:postId} = req.params;
  const {value} = req.body;
  console.log("Received id with value",postId,value)
  try {
    if (!mongoose.Types.ObjectId.isValid(postId))
       res.staus(404).json({ message: "Invalid PostID" });
    const post = await PostMessage.findById(postId);
    console.log("These are the posts comments: ",post.comments)
    post.comments.push(value);
    const updatedPost=await PostMessage.findByIdAndUpdate(postId,post,{new:true})
    return res.status(201).json(updatedPost);
  } catch (error) {
    console.log(error)
    return res.status(500).json({message:"Error adding comment at server!"})
  }
};
