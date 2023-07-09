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
    createUser(name: String!, password: String!, email: String!): UserPayload!
    createProfile(bio: String!): ProfilePayload!
    createPost(title: String!, content: String!, published: Boolean): PostPayload!

    updateUser(id: ID!, name: String, password: String, email: String): UserPayload!
    updateProfile(id: ID!, bio: String): ProfilePayload!
    updatePost(id: ID!, title: String, content: String, published: Boolean): PostPayload!
    
    deleteUser(id: ID!): UserPayload!
    deleteProfile(id: ID!): ProfilePayload!
    deletePost(id: ID!): PostPayload!
  }

  type Post {
    id: ID!
    title: String!
    content: String!
    published: Boolean
    userId: Int!
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
    user: User
  }

  type ProfilePayload {
    error: Error
    profile: Profile
  }

  type PostPayload {
    error: Error
    post: Post
  }
  




`;
