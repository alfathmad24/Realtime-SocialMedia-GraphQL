const { gql } = require("apollo-server");

module.exports = gql`
    type Comment {
        id: ID!
        createdAt: String!
        username: String!
        body: String!
    }

    type Like {
        id: ID!
        createdAt: String!
        username: String!
    }

    type Post {
        id: ID!
        postId: Int!
        body: String!
        createdAt: String!
        username: String!
        comments: [Comment]!
        likes: [Like]!
        likeCount: Int!
        commentCount: Int!
    }

    type User {
        id: ID!
        email: String!
        token: String!
        username: String!
        createdAt: String!
    }

    input RegisterInput {
        username: String!
        password: String!
        confirmPassword: String!
        email: String!
    }

    input LoginInput {
        username: String!
        password: String!
    }

    type Query {
        getPost(postId: ID!): Post
        getPosts: [Post]
        getLatestPost(postId: Int): [Post]
    }

    type Mutation {
        register(registerInput: RegisterInput): User!
        login(loginInput: LoginInput): User!
        createPost(body: String!): Post!
        deletePost(postId: ID!): String!
        createComment(postId: ID!, body: String!): Post!
        deleteComment(postId: ID!, commentId: ID!): Post!
        likePost(postId: ID!): Post!
    }

    type Subscription {
        posts: [Post!]
        newPost: Post!
        deletePost: Post!
        likePost: Post!
        createComment: Post!
        deleteComment: Post!
    }
`;
