import { AuthenticationError } from "apollo-server";

import Post from "../../models/Post";
import checkAuth from "../../util/check-auth";
import { UserInputError } from "apollo-server";
import { subscribe } from "graphql";

const Query = {
  async getPosts() {
    try {
      const posts = await Post.find().sort({ createdAt: -1 });
      return posts;
    } catch (error) {
      throw new Error(error);
    }
  },
  async getPost(_, { postId }) {
    try {
      const post = await Post.findById(postId);
      if (post) {
        return post;
      } else {
        throw new Error("Post not found");
      }
    } catch (error) {
      throw new Error(error);
    }
  },
};

const Mutation = {
  async createPost(_, { body }, context) {
    const user = checkAuth(context);

    if (body.trim() === "") {
      throw new Error("Post body must not be empty");
    }

    const newPost = new Post({
      body,
      user: user.id,
      username: user.username,
      createdAt: new Date().toISOString(),
    });

    const post = await newPost.save();
    context.pubsub.publish("NEW_POST", {
      newPost: post,
    });

    return post;
  },
  async deletePost(_, { postId }, context) {
    const user = checkAuth(context);

    try {
      const post = await Post.findById(postId);

      if (post.user.equals(user.id)) {
        await post.delete();

        return "Post deleted successfully";
      } else {
        throw new AuthenticationError("Action not allowed");
      }
    } catch (error) {
      throw new Error(error);
    }
  },
  async likePost(_, { postId }, context) {
    const { username } = checkAuth(context);
    const post = await Post.findById(postId);

    if (post) {
      if (post.likes.find((like) => like.username === username)) {
        // Post already likes. unlike it
        post.likes = post.likes.filter((like) => like.username !== username);
      } else {
        // Not liked, like post
        post.likes.push({
          username,
          createdAt: new Date().toISOString(),
        });
      }

      await post.save();
      return post;
    } else throw new UserInputError("Post not found");
  },
};

const Subscription = {
  newPost: {
    subscribe: (_, __, { pubsub }) => pubsub.asyncIterator("NEW_POST"),
  },
};

export default { Query, Mutation, Subscription };
