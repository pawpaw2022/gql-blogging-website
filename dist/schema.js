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

    # Fetch all categories 
    categories: [Category!]!

    # Query tags
    tags: [Tag!]!

    # Query avatars
    avatars: [Avatar!]!
  }

  type Mutation {
    # User Auth 
    signup(credentials: Credentials!, firstName: String!, lastName: String, bio: String!): UserPayload!
    signin(credentials: Credentials!): UserPayload!
    
    # Profile Update
    updateProfile(bio: String!): ProfilePayload!
    updateUser(firstName: String!, lastName: String!, bio: String!): ProfilePayload!

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

    # Comment a post
    createComment(postId: ID!, content: String!): CommentPayload!
    updateComment(commentId: ID!, content: String!): CommentPayload!
    deleteComment(commentId: ID!): CommentPayload!

    # Assign tags to a post
    assignTag(postId: ID!, tagId: ID!): PostPayload!
    unAssignTag(postId: ID!, tagId: ID!): PostPayload!
    createPostwTags(title: String!, content: String!, tagIds: [ID!]!): PostPayload!
    updatePostwTags(postId: ID!, title: String!, content: String!, tagIds: [ID!]!): PostPayload!

    # Assign avatar to a profile
    assignAvatar(avatarId: ID!): ProfilePayload!
    unAssignAvatar: ProfilePayload!

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
    updatedAt: String!
    tags: [Tag!]!
    comments: [Comment!]!
    likes: [Like!]!
  }

  type Comment {
    id: ID!
    content: String!
    postId: ID!
    userId: ID!
    updatedAt: String!
    user: User!
  }

  type Like {
    id: ID!
    postId: ID!
    userId: ID!
    posts: [Post!]!
    updatedAt: String!
  }

  type Category {
    id: ID!
    name: String!
    tags: [Tag!]!
  }


  type User {
    id: ID!
    firstName: String!
    lastName: String
    email: String!
    profile: Profile!
    posts: [Post!]!
    likes: [Like!]!
    comments: [Comment!]!
    createdAt: String!
  }

  type Profile {
    id: ID!
    bio: String!
    userId: ID!
    user: User!
    avatarId: ID
    avatar: Avatar
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

  type AvatarPayload {
    error: Error
    avatar: Avatar
  }

  type CommentPayload{
    error: Error
    comment: Comment
  }


`;
