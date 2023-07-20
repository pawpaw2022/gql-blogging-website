/** @format */

import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { PrismaClient } from "@prisma/client";
import { typeDefs } from "./schema";
import { Query } from "./resolvers/Query";
import { User } from "./resolvers/User";
import { Post } from "./resolvers/Post";
import { Profile } from "./resolvers/Profile";
import { redisStart } from "./utils/Redis";
import { AllMutations } from "./utils/MutationRefactor";

export const prisma = new PrismaClient();

const redis = await redisStart();

// console.log(await redis.del("posts"));

export interface Context {
  prisma: PrismaClient;
  auth: string | undefined;
  redis: typeof redis;
}

// The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.
const server = new ApolloServer({
  typeDefs,
  resolvers: {
    Query,
    User,
    Post,
    Profile,
    Mutation: AllMutations,
  },
});

// Passing an ApolloServer instance to the `startStandaloneServer` function:
//  1. creates an Express app
//  2. installs your ApolloServer instance as middleware
//  3. prepares your app to handle incoming requests
const { url } = await startStandaloneServer(server, {
  listen: { port: 4000 },
  context: async ({ req }): Promise<Context> => ({
    prisma,
    auth: req.headers.authorization,
    redis,
  }),
});

console.log(`🚀  Server ready at: ${url}`);
