import React, { useState, useEffect } from "react";
import { Button, Confirm, Icon, Popup } from "semantic-ui-react";
import { Link, Redirect } from "react-router-dom";
import { useMutation, gql } from "@apollo/client";
import { DELETE_COMMENT_MUTATION, DELETE_POST_MUTATION } from "../util/graphql";
import MyPopup from "../util/MyPopup";

const DeleteButton = ({ postId, commentId, callback }) => {
    const [confirmOpen, setConfirmOpen] = useState(false);

    const mutation = commentId ? DELETE_COMMENT_MUTATION : DELETE_POST_MUTATION;

    const [deletePostOrComment] = useMutation(mutation, {
        update() {
            setConfirmOpen(false);
            if (!commentId) {
            }
            if (callback) {
                callback();
            }
        },
        variables: {
            postId,
            commentId,
        },
    });

    return (
        <>
            <MyPopup content={commentId ? "Delete comment" : "Delete post"}>
                <Button
                    as="div"
                    color="red"
                    floated="right"
                    onClick={() => setConfirmOpen(true)}
                >
                    <Icon name="trash" style={{ margin: 0 }} />
                </Button>
            </MyPopup>

            <Confirm
                open={confirmOpen}
                onCancel={() => setConfirmOpen(false)}
                onConfirm={deletePostOrComment}
            />
        </>
    );
};

export default DeleteButton;
