import gql from "graphql-tag";

/*
    QUERY
*/

export const FETCH_POST_QUERY = gql`
    query($postId: ID!) {
        getPost(postId: $postId) {
            id
            postId
            body
            createdAt
            username
            comments {
                id
                createdAt
                body
                username
            }
            likes {
                username
            }
            likeCount
            commentCount
        }
    }
`;

export const FETCH_POSTS_QUERY = gql`
    {
        getPosts {
            id
            postId
            body
            createdAt
            username
            likeCount
            likes {
                username
            }
            commentCount
            comments {
                id
                username
                createdAt
                body
            }
        }
    }
`;

/*
    MUTATION
*/

export const CREATE_POST_MUTATION = gql`
    mutation createPost($body: String!) {
        createPost(body: $body) {
            id
            body
            createdAt
            username
            likes {
                id
                username
                createdAt
            }
            likeCount
            comments {
                id
                body
                username
                createdAt
            }
            commentCount
        }
    }
`;

export const CREATE_COMMENT_MUTATION = gql`
    mutation createComment($postId: ID!, $body: String!) {
        createComment(postId: $postId, body: $body) {
            id
            comments {
                id
                username
                createdAt
                body
            }
            commentCount
        }
    }
`;

export const DELETE_COMMENT_MUTATION = gql`
    mutation deleteComment($postId: ID!, $commentId: ID!) {
        deleteComment(postId: $postId, commentId: $commentId) {
            id
            comments {
                id
                username
                createdAt
                body
            }
            commentCount
        }
    }
`;

export const DELETE_POST_MUTATION = gql`
    mutation deletePost($postId: ID!) {
        deletePost(postId: $postId)
    }
`;

export const LIKE_POST_MUTATION = gql`
    mutation likePost($postId: ID!) {
        likePost(postId: $postId) {
            id
            likes {
                id
                username
            }
            likeCount
        }
    }
`;

/*
    SUBSCRIPTION
*/

export const FETCH_POSTS_SUBSCRIPTION = gql`
    subscription {
        posts {
            id
            postId
            body
            createdAt
            username
            comments {
                id
                body
                username
            }
            likes {
                id
                username
            }
            likeCount
            commentCount
        }
    }
`;

export const POSTS_SUBSCRIPTION = gql`
    subscription {
        newPost {
            id
            postId
            body
            createdAt
            username
            comments {
                id
                body
                username
            }
            likes {
                id
                username
            }
            likeCount
            commentCount
        }
    }
`;

export const DELETE_SUBSCRIPTION = gql`
    subscription {
        deletePost {
            id
            postId
            body
            createdAt
            username
            comments {
                id
                body
                username
            }
            likes {
                id
                username
            }
            likeCount
            commentCount
        }
    }
`;

export const CREATE_COMMENT_SUBSCRIPTION = gql`
    subscription {
        createComment {
            id
            postId
            body
            createdAt
            username
            comments {
                id
                body
                username
            }
            likes {
                id
                username
            }
            likeCount
            commentCount
        }
    }
`;

export const DELETE_COMMENT_SUBSCRIPTION = gql`
    subscription {
        deleteComment {
            id
            postId
            body
            createdAt
            username
            comments {
                id
                body
                username
            }
            likes {
                id
                username
            }
            likeCount
            commentCount
        }
    }
`;

export const LIKE_SUBSCRIPTION = gql`
    subscription {
        likePost {
            id
            postId
            body
            createdAt
            username
            comments {
                id
                body
                username
            }
            likes {
                id
                username
            }
            likeCount
            commentCount
        }
    }
`;
