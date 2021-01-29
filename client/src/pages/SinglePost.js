import React, {
    useCallback,
    useContext,
    useEffect,
    useState,
    useRef,
} from "react";
import { gql, useMutation, useQuery } from "@apollo/client";
import {
    Button,
    Card,
    Form,
    Grid,
    Icon,
    Image,
    Input,
    Label,
} from "semantic-ui-react";
import LikeButton from "../components/LikeButton";
import { AuthContext } from "../context/auth";
import moment from "moment";
import DeleteButton from "../components/DeleteButton";
import { Redirect } from "react-router-dom";
import {
    CREATE_COMMENT_MUTATION,
    CREATE_COMMENT_SUBSCRIPTION,
    DELETE_COMMENT_SUBSCRIPTION,
    DELETE_SUBSCRIPTION,
    FETCH_POST_QUERY,
    LIKE_SUBSCRIPTION,
} from "../util/graphql";
import MyPopup from "../util/MyPopup";

const SinglePost = (props) => {
    const postId = props.match.params.postId;
    const { user } = useContext(AuthContext);
    const [redirect, setRedirect] = useState();
    const [comment, setComment] = useState("");

    const [createComment] = useMutation(CREATE_COMMENT_MUTATION, {
        update() {
            setComment("");
        },
        variables: {
            postId,
            body: comment,
        },
    });

    const { subscribeToMore, data, loading, error } = useQuery(
        FETCH_POST_QUERY,
        {
            variables: { postId },
        }
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

    useEffect(() => {
        subscribeToNewComment();
        subscribeToDeleteComment();
        subscribeToLikePost();
    }, [subscribeToNewComment, subscribeToDeleteComment, subscribeToLikePost]);

    const callbackDelete = () => {
        setRedirect(true);
    };

    if (loading) return "Loading...";
    if (error) return `Error! ${error.message}`;

    return data ? (
        <>
            {redirect && <Redirect to="/" />}
            <Grid>
                <Grid.Row>
                    <Grid.Column width={2}>
                        <Image
                            src="https://react.semantic-ui.com/images/avatar/large/elliot.jpg"
                            size="small"
                            floated="right"
                        />
                    </Grid.Column>
                    <Grid.Column width={8}>
                        <Card fluid>
                            <Card.Content>
                                <Card.Header>
                                    {data.getPost.username}
                                </Card.Header>
                                <Card.Meta>
                                    {moment(data.getPost.createdAt).fromNow()}
                                </Card.Meta>
                                <Card.Description>
                                    {data.getPost.body}
                                </Card.Description>
                            </Card.Content>
                            <hr />
                            <Card.Content>
                                <LikeButton
                                    user={user}
                                    post={{
                                        id: data.getPost.id,
                                        likeCount: data.getPost.likeCount,
                                        likes: data.getPost.likes,
                                    }}
                                />
                                <MyPopup content="Comment on post">
                                    <Button
                                        basic
                                        color="blue"
                                        as="div"
                                        labelPosition="right"
                                        onClick={() =>
                                            console.log("Comment on post")
                                        }
                                    >
                                        <Button color="teal" basic>
                                            <Icon
                                                name="comments"
                                                style={{ margin: 0 }}
                                            />
                                        </Button>
                                        <Label
                                            basic
                                            color="blue"
                                            pointing="left"
                                        >
                                            {data.getPost.commentCount}
                                        </Label>
                                    </Button>
                                </MyPopup>
                                {user &&
                                    user.username === data.getPost.username && (
                                        <DeleteButton
                                            postId={data.getPost.id}
                                            callback={callbackDelete}
                                        />
                                    )}
                            </Card.Content>
                        </Card>
                        {user && (
                            <Card fluid>
                                <Card.Content>
                                    <p>Post a comment</p>
                                    <Form>
                                        <div className="ui action input fluid">
                                            <input
                                                type="text"
                                                placeholder="Comment..."
                                                name="comment"
                                                value={comment}
                                                onChange={(e) =>
                                                    setComment(e.target.value)
                                                }
                                            />
                                            <button
                                                type="submit"
                                                className="ui button teal"
                                                disabled={comment.trim() === ""}
                                                onClick={createComment}
                                            >
                                                Submit
                                            </button>
                                        </div>
                                    </Form>
                                </Card.Content>
                            </Card>
                        )}
                        {data.getPost.comments.map((comment) => (
                            <Card fluid key={comment.id}>
                                <Card.Content>
                                    {user &&
                                        user.username === comment.username && (
                                            <DeleteButton
                                                postId={data.getPost.id}
                                                commentId={comment.id}
                                            />
                                        )}
                                    <Card.Header>
                                        {comment.username}
                                    </Card.Header>
                                    <Card.Meta>
                                        {moment(comment.createdAt).fromNow()}
                                    </Card.Meta>
                                    <Card.Description>
                                        {comment.body}
                                    </Card.Description>
                                </Card.Content>
                            </Card>
                        ))}
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        </>
    ) : (
        <p>Loading...</p>
    );
};

export default SinglePost;
