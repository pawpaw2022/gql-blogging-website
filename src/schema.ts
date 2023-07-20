/** @format */

// A schema is a collection of type definitions (hence "typeDefs")
// that together define the "shape" of queries that are executed against
// your data.
export const typeDefs = `#graphql
  # Comments in GraphQL strings (such as this one) start with the hash (#) symbol.

  type Query {
    hello: String
    
    # Query user info (auth needed)
    me: User

    # Query others profiles 
    profile(userId: ID!): Profile! 

    # Query posts in which we can also query the author
    posts: [Post!]!
    post(id: ID!): Post!

    # Query tags
    tags: [Tag!]!

    # Query avatars
    avatars: [Avatar!]!
  }

  type Mutation {
    # User Auth 
    signup(credentials: Credentials!, name: String!, bio: String!): UserPayload!
    signin(credentials: Credentials!): UserPayload!
    
    # Profile Update
    updateProfile(bio: String!): ProfilePayload!

    # TODO: Add tags when creating a post
    # Post Mutations
    createPost(title: String!, content: String!): PostPayload!
    updatePost(id: ID!, title: String, content: String): PostPayload!
    deletePost(id: ID!): PostPayload!

    # Post Publish
    publishPost(id: ID!): PostPayload!
    unpublishPost(id: ID!): PostPayload!

    
    # Like a post 
    likePost(postId: ID!): PostPayload!
    unLikePost(postId: ID!): PostPayload!

    # TODO: 
    # Comment a post
    commentPost(postId: ID!, content: String!): PostPayload!
    editComment(commentId: ID!, content: String!): PostPayload!
    deleteComment(commentId: ID!): PostPayload!

    # TODO: 
    # Assign tags to a post
    assignTags(postId: ID!, tagIds: [ID!]!): PostPayload!
    unAssignTags(postId: ID!, tagIds: [ID!]!): PostPayload!

    # TODO: 
    # Assign avatar to a profile
    assignAvatar(avatarId: ID!): ProfilePayload!
    unAssignAvatar: ProfilePayload!

    # Create Tags 
    createTag(name: String!): TagPayload!
    deleteTag(id: ID!): TagPayload!

    # Create Avatars 
    createAvatar(url: String!): AvatarPayload!
    deleteAvatar(id: ID!): AvatarPayload!

  }


  type Post {
    id: ID!
    title: String!
    content: String!
    published: Boolean
    authorId: ID!
    user: User!
    tags: [Tag!]!
    comments: [Comment!]!
    likes: [Like!]!
  }

  type Comment {
    id: ID!
    content: String!
    postId: ID!
    post: Post!
    userId: ID!
    user: User!
  }

  type Like {
    id: ID!
    postId: ID!
    userId: ID!
  }


  type User {
    id: ID!
    firstName: String!
    lastName: String
    email: String!
    profile: Profile!
    posts: [Post!]!
    likes: [Like!]!
  }

  type Profile {
    id: ID!
    bio: String!
    userId: ID!
    user: User!
  }

  type Tag {
    id: ID!
    name: String!
  }

  type Avatar {
    id: ID!
    url: String!
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

  type TagPayload {
    error: Error
    tag: Tag
  }

  type AvatarPayload {
    error: Error
    avatar: Avatar
  }

`;
