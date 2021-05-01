import usersResolvers from "./users";
import postsResolvers from "./posts";
import commentsResolvers from "./comments";

export default {
  Post: {
    commentCount: (parent) => parent.comments.length,
    likeCount: (parent) => parent.likes.length,
  },
  Query: {
    ...postsResolvers.Query,
  },
  Mutation: {
    ...usersResolvers.Mutation,
    ...postsResolvers.Mutation,
    ...commentsResolvers.Mutation,
  },
  Subscription: {
    ...postsResolvers.Subscription,
  },
};
