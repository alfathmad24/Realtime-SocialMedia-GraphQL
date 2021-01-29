const { AuthenticationError, UserInputError } = require("apollo-server");
const Post = require("../../models/Post");
const checkAuth = require("../../utils/check-auth");
const { validatePostInput } = require("../../utils/validators");

module.exports = {
    Query: {
        getPost: async function (_, { postId }) {
            let post;
            try {
                post = await Post.findById(postId);
            } catch (err) {
                throw new Error(err);
            }

            if (!post) {
                throw new Error("Post not found");
            }

            return post;
        },
        getPosts: async function (_, __, context) {
            let posts;
            try {
                posts = await Post.find().sort({ createdAt: -1 });
            } catch (err) {
                throw new Error(err);
            }

            if (!posts) {
                throw new Error("Posts not found");
            }

            context.pubsub.publish("ALL_POST", {
                posts: [...posts],
            });

            return posts;
        },
        getLatestPost: async function (_, { postId }, context) {
            const id = postId
                ? {
                      postId: {
                          $regex: postId,
                          $options: "i",
                      },
                  }
                : {};

            let latestPost;
            try {
                latestPost = await Post.find({ ...id }).sort({
                    createdAt: -1,
                });
            } catch (err) {
                throw new Error(err);
            }

            if (!latestPost) {
                throw new Error("Posts not found");
            }

            // context.pubsub.publish("NEW_POST", {
            //     newPost: [...latestPost],
            // });

            return latestPost;
        },
    },
    Mutation: {
        createPost: async function (_, { body }, context) {
            const user = checkAuth(context);
            const { errors, valid } = validatePostInput(body);

            if (!valid) {
                throw new UserInputError("Errors", { errors });
            }

            let count;
            try {
                count = await Post.findOne()
                    .sort({
                        createdAt: -1,
                    })
                    .limit(1);
            } catch (err) {
                throw new Error(err);
            }

            const newPost = new Post({
                postId: count ? +count.postId + 1 : 1,
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
        deletePost: async function (_, { postId }, context) {
            const user = checkAuth(context);

            try {
                const post = await Post.findById(postId);
                if (post.username !== user.username) {
                    throw new AuthenticationError("Action not allowed!");
                }

                await post.delete();

                context.pubsub.publish("DELETE_POST", {
                    deletePost: post,
                });

                return "Post deleted successfully!";
            } catch (err) {
                throw new Error(err);
            }
        },
    },
    Subscription: {
        posts: {
            subscribe: async function (_, __, { pubsub }) {
                return pubsub.asyncIterator("ALL_POST");
            },
        },
        newPost: {
            subscribe: async function (_, __, { pubsub }) {
                return pubsub.asyncIterator("NEW_POST");
            },
        },
        deletePost: {
            subscribe: async function (_, __, { pubsub }) {
                return pubsub.asyncIterator("DELETE_POST");
            },
        },
    },
};
