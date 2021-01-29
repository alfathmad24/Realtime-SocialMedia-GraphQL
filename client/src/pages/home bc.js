import React, { useContext, useState, useEffect, useCallback } from "react";
import {
    gql,
    useQuery,
    useSubscription,
    useApolloClient,
} from "@apollo/client";

import { Grid, Image } from "semantic-ui-react";

import PostCard from "../components/PostCard";
import PostForm from "../components/PostForm";
import { AuthContext } from "../context/auth";
import { FETCH_POSTS_QUERY } from "../util/graphql";

const Posts = (props) => {
    const [state, setState] = useState({
        olderPostAvailable: props.latestPost ? true : false,
        newPostCount: 0,
        posts: [],
    });

    let numPosts = state.posts.length;
    let oldestPostId = numPosts
        ? state.posts[numPosts - 1].id
        : props.latestPost
        ? props.latestPost.id + 1
        : 0;
    let newestPostId = numPosts
        ? state.posts[0].id
        : props.latestPost
        ? props.latestPost.id
        : 0;

    const client = useApolloClient();

    useEffect(() => {
        loadPosts();
    }, [loadPosts]);

    useEffect(() => {
        if (props.latestPost && props.latestPost.id > newestPostId) {
            setState((prevState) => {
                return {
                    ...prevState,
                    newPostCount: prevState.newPostCount + 1,
                };
            });
            newestPostId = props.latestPost.id;
        }
    }, [props.latestPost]);

    const loadPosts = useCallback(async () => {
        const { data } = await client.query({
            query: FETCH_POSTS_QUERY,
        });

        if (data.getPosts.length) {
            setState((prevState) => {
                return {
                    ...prevState,
                    posts: [...prevState.posts, ...data.getPosts],
                };
            });
            oldestPostId = data.getPosts[data.getPosts.length - 1].id;
        }
    });

    const loadNew = async () => {
        const GET_NEW_POST = gql`
            {
                getLatestPost {
                    id
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

        const { data } = await client.query({
            query: GET_NEW_POST,
        });

        if (data) {
            setState((prevState) => {
                return {
                    ...prevState,
                    posts: [...data.getLatestPost, ...prevState.posts],
                    newPostCount: 0,
                };
            });
            newestPostId = data.getLatestPost[0].id;
        }
    };

    return (
        <>
            {state.newPostCount !== 0 && (
                <div className={"loadMoreSection"} onClick={loadNew}>
                    New tasks have arrived! ({state.newPostCount.toString()})
                </div>
            )}
            {state.posts &&
                state.posts.map((post) => (
                    <Grid.Column key={post.id} style={{ marginBottom: 20 }}>
                        <PostCard post={post} />
                    </Grid.Column>
                ))}
        </>
    );
};

const PostSubscription = () => {
    const { user } = useContext(AuthContext);
    const { loading, error, data } = useSubscription(POSTS_SUBSCRIPTION);

    if (loading) {
        return <span>Loading...</span>;
    }
    if (error) {
        return <span>Error</span>;
    }
    return <Posts latestPost={data.newPost.length ? data.newPost[0] : null} />;
};

const Home = () => {
    return (
        <Grid.Row columns={3}>
            <Grid.Row className="page-title">
                <h1>Recent Posts</h1>
            </Grid.Row>
            <Grid.Row>
                <Grid.Column>
                    <PostForm />
                </Grid.Column>
                <PostSubscription />
            </Grid.Row>
        </Grid.Row>
    );
};

const POSTS_SUBSCRIPTION = gql`
    subscription {
        newPost {
            id
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

export default Home;
