/** @format */

// A schema is a collection of type definitions (hence "typeDefs")
// that together define the "shape" of queries that are executed against
// your data.
export const typeDefs = `#graphql
  # Comments in GraphQL strings (such as this one) start with the hash (#) symbol.

  type Query {
    hello: String
    users: [User!]!
    user(id: ID!): User!
    posts: [Post!]!
    post(id: ID!): Post!
    profiles: [Profile!]!
  }

  type Mutation {
    # User Auth 
    signup(credentials: Credentials!, name: String!, bio: String!): UserPayload!
    signin(credentials: Credentials!): UserPayload!
    
    # Post Mutations
    createPost(title: String!, content: String!): PostPayload!
    updatePost(id: ID!, title: String, content: String): PostPayload!
    deletePost(id: ID!): PostPayload!

    # Post Publish
    publishPost(id: ID!): PostPayload!
    unpublishPost(id: ID!): PostPayload!

    # Profile Update
    updateProfile(bio: String!): ProfilePayload!
  }



  type Post {
    id: ID!
    title: String!
    content: String!
    published: Boolean
    authorId: Int!
    user: User!
  }

  type User {
    id: ID!
    name: String!
    email: String!
    profile: Profile!
    posts: [Post!]!
  }

  type Profile {
    id: ID!
    bio: String!
    userId: Int!
    user: User!
  }

  type Error {
    message: String!
  }

  type UserPayload {
    error: Error
    token: String
  }

  type ProfilePayload {
    error: Error
    profile: Profile
  }

  type PostPayload {
    error: Error
    post: Post
  }

  input Credentials {
    email: String!
    password: String!
  }

`;
