const { UserInputError, AuthenticationError } = require("apollo-server");
const Post = require("../../models/Post");
const checkAuth = require("../../utils/check-auth");

module.exports = {
    Mutation: {
        createComment: async function (_, { postId, body }, context) {
            const { username } = checkAuth(context);
            if (body.trim() === "") {
                throw new UserInputError("Empty comment!", {
                    errors: {
                        body: "Comment body must not empty!",
                    },
                });
            }

            let post;
            try {
                post = await Post.findById(postId);
            } catch (err) {
                throw new Error(err);
            }

            if (!post) {
                throw new Error("Post not found");
            }

            post.comments.unshift({
                body,
                username,
                createdAt: new Date().toISOString(),
            });

            try {
                await post.save();
            } catch (err) {
                throw new Error("Cannot add comment!");
            }

            context.pubsub.publish("CREATE_COMMENT", {
                createComment: post,
            });

            return post;
        },
        deleteComment: async function (_, { postId, commentId }, context) {
            const { username } = checkAuth(context);

            let post;
            try {
                post = await Post.findById(postId);
            } catch (err) {
                throw new Error(err);
            }

            if (!post) {
                throw new Error("Post not found");
            }

            const commentIndex = await post.comments.findIndex(
                (c) => c.id === commentId
            );

            if (post.comments[commentIndex].username === username) {
                post.comments.splice(commentIndex, 1);
                await post.save();
            } else {
                throw new AuthenticationError("Action not allowed!");
            }

            context.pubsub.publish("DELETE_COMMENT", {
                deleteComment: post,
            });

            return post;
        },
        likePost: async function (_, { postId }, context) {
            const { username } = checkAuth(context);

            let post;
            try {
                post = await Post.findById(postId);
            } catch (err) {
                throw new Error(err);
            }

            if (!post) {
                throw new Error("Post not found");
            }

            const postLike = await post.likes.find(
                (like) => like.username === username
            );
            if (postLike) {
                // Unlike post
                post.likes = post.likes.filter(
                    (like) => like.username !== username
                );
            } else {
                // like post
                post.likes.push({
                    username,
                    createdAt: new Date().toISOString(),
                });
            }

            try {
                await post.save();
            } catch (err) {
                throw new Error("Cannot like this post!");
            }

            context.pubsub.publish("LIKE_POST", {
                likePost: post,
            });

            return post;
        },
    },
    Subscription: {
        createComment: {
            subscribe: async function (_, __, { pubsub }) {
                return pubsub.asyncIterator("CREATE_COMMENT");
            },
        },
        deleteComment: {
            subscribe: async function (_, __, { pubsub }) {
                return pubsub.asyncIterator("DELETE_COMMENT");
            },
        },
        likePost: {
            subscribe: async function (_, __, { pubsub }) {
                return pubsub.asyncIterator("LIKE_POST");
            },
        },
    },
};
