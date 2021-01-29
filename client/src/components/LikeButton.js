import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useMutation, gql } from "@apollo/client";
import { Button, Icon, Label } from "semantic-ui-react";
import { LIKE_POST_MUTATION } from "../util/graphql";
import MyPopup from "../util/MyPopup";

const LikeButton = ({ user, post: { id, likeCount, likes } }) => {
    const [liked, setLiked] = useState(false);

    useEffect(() => {
        if (user && likes.find((like) => like.username === user.username)) {
            setLiked(true);
        } else {
            setLiked(false);
        }
    }, [user, likes]);

    const [likePost] = useMutation(LIKE_POST_MUTATION, {
        variables: { postId: id },
    });

    const likeButton = user ? (
        liked ? (
            <Button color="teal">
                <Icon name="heart" style={{ margin: 0 }} />
            </Button>
        ) : (
            <Button color="teal" basic>
                <Icon name="heart" style={{ margin: 0 }} />
            </Button>
        )
    ) : (
        <Button as={Link} to={`/login`} color="teal" basic>
            <Icon name="heart" style={{ margin: 0 }} />
        </Button>
    );

    return (
        <Button as="div" labelPosition="right" onClick={likePost}>
            <MyPopup content="Like on post">{likeButton}</MyPopup>
            <Label basic color="teal" pointing="left">
                {likeCount}
            </Label>
        </Button>
    );
};

export default LikeButton;
