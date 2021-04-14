import { Query } from "./posts";
import { Mutation } from "./users";

export default {
  Query: {
    ...Query,
  },
  Mutation: {
    ...Mutation,
  },
};
