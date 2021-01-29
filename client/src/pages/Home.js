import React, { useContext, useState, useEffect, useCallback } from "react";
import {
    gql,
    useQuery,
    useSubscription,
    NetworkStatus,
    useApolloClient,
} from "@apollo/client";

import { Grid, Transition } from "semantic-ui-react";

import PostCard from "../components/PostCard";
import PostForm from "../components/PostForm";
import { AuthContext } from "../context/auth";
import {
    CREATE_COMMENT_SUBSCRIPTION,
    DELETE_COMMENT_SUBSCRIPTION,
    DELETE_SUBSCRIPTION,
    FETCH_POSTS_QUERY,
    FETCH_POSTS_SUBSCRIPTION,
    LIKE_SUBSCRIPTION,
    POSTS_SUBSCRIPTION,
} from "../util/graphql";

const Posts = (props) => {
    // const [posts, setPosts] = useState();

    const { subscribeToMore, data, error, refetch } = useQuery(
        FETCH_POSTS_QUERY
    );

    useEffect(() => {
        refetch();
    }, [refetch]);

    /*
        NEW POST SUBSCRIPTIONS
    */
    const subscribeToNewPost = useCallback(
        () =>
            subscribeToMore({
                document: POSTS_SUBSCRIPTION,
                updateQuery: (prevData, { subscriptionData }) => {
                    return {
                        getPosts: [
                            subscriptionData.data.newPost,
                            ...prevData.getPosts,
                        ],
                    };
                },
            }),
        [subscribeToMore]
    );

    /*
        FETCH POSTS SUBSCRIPTIONS
    */
    // const subscribeToFetchPosts = useCallback(
    //     () =>
    //         subscribeToMore({
    //             document: FETCH_POSTS_SUBSCRIPTION,
    //         }),
    //     [subscribeToMore]
    // );

    /*
        LIKE POST SUBSCRIPTIONS
    */
    const subscribeToLikePost = useCallback(
        () =>
            subscribeToMore({
                document: LIKE_SUBSCRIPTION,
            }),
        [subscribeToMore]
    );

    /*
        DELETE POST SUBSCRIPTIONS
    */
    const subscribeToDeletePost = useCallback(
        () =>
            subscribeToMore({
                document: DELETE_SUBSCRIPTION,
                updateQuery: (prevData, { subscriptionData }) => {
                    return {
                        getPosts: [
                            ...prevData.getPosts.filter(
                                (post) =>
                                    post.id !==
                                    subscriptionData.data.deletePost.id
                            ),
                        ],
                    };
                },
            }),
        [subscribeToMore]
    );

    /*
        NEW COMMENT SUBSCRIPTIONS
    */
    const subscribeToNewComment = useCallback(
        () =>
            subscribeToMore({
                document: CREATE_COMMENT_SUBSCRIPTION,
            }),
        [subscribeToMore]
    );

    /*
        DELETE COMMENT SUBSCRIPTIONS
    */
    const subscribeToDeleteComment = useCallback(
        () =>
            subscribeToMore({
                document: DELETE_COMMENT_SUBSCRIPTION,
            }),
        [subscribeToMore]
    );

    useEffect(() => {
        // subscribeToFetchPosts();
        subscribeToDeletePost();
        subscribeToNewPost();
        subscribeToLikePost();
        subscribeToNewComment();
        subscribeToDeleteComment();
    }, [
        // subscribeToFetchPosts,
        subscribeToDeletePost,
        subscribeToNewPost,
        subscribeToLikePost,
        subscribeToNewComment,
        subscribeToDeleteComment,
    ]);

    if (error) {
        return `Error ${error}`;
    }

    return (
        <>
            <Grid columns={3}>
                <Grid.Row>
                    <Transition.Group>
                        {data &&
                            data.getPosts.map((post) => (
                                <Grid.Column
                                    key={post.postId}
                                    style={{ marginBottom: 20 }}
                                >
                                    <PostCard post={post} />
                                </Grid.Column>
                            ))}
                    </Transition.Group>
                </Grid.Row>
            </Grid>
        </>
    );
};

const Home = () => {
    const { user } = useContext(AuthContext);
    return (
        <Grid.Row>
            <Grid.Row className="page-title">
                <h1>Recent Posts</h1>
            </Grid.Row>
            <Grid.Row>
                {user && (
                    <Grid.Column>
                        <PostForm />
                    </Grid.Column>
                )}
                <Posts />
            </Grid.Row>
        </Grid.Row>
    );
};

export default Home;
