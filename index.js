import { ApolloServer } from "apollo-server";
import mongoose from "mongoose";

import typeDefs from "./graphql/typeDefs";
import resolvers from "./graphql/resolvers/index";
import { MONGODB } from "./config";

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => ({ req }),
});

const connectDB = async () => {
  try {
    await mongoose.connect(MONGODB, { useNewUrlParser: true });
    console.log("MongoDB connected");

    const res = await server.listen({ port: 5000 });
    console.log(`Server running at ${res.url}`);
  } catch (error) {
    console.log(error);
  }
};

connectDB();
