import React, { useState } from "react";
import { Button, Form } from "semantic-ui-react";
import { useForm } from "../util/hooks";
import { useMutation } from "@apollo/client";
import gql from "graphql-tag";
import { CREATE_POST_MUTATION, FETCH_POSTS_QUERY } from "../util/graphql";

const PostForm = () => {
    const [errors, setErrors] = useState({});

    const { values, onChange, onSubmit } = useForm(createPostCallback, {
        body: "",
    });

    const [createPost, { error }] = useMutation(CREATE_POST_MUTATION, {
        variables: values,
        update(proxy, result) {
            // const data = proxy.readQuery({
            //     query: FETCH_POSTS_QUERY,
            // });
            // let newData = [...data.getPosts];
            // newData = [result.data.createPost, ...newData];
            // proxy.writeQuery({
            //     query: FETCH_POSTS_QUERY,
            //     data: {
            //         ...data,
            //         getPosts: {
            //             newData,
            //         },
            //     },
            // });
            values.body = "";
        },
        onError(err) {
            setErrors(err.graphQLErrors[0].extensions.exception.errors);
        },
    });

    function createPostCallback() {
        createPost();
    }

    return (
        <>
            <Form onSubmit={onSubmit}>
                <h2>Create a post: </h2>
                <Form.Field>
                    <Form.Input
                        placeholder="Hi World"
                        name="body"
                        onChange={onChange}
                        value={values.body}
                        error={errors.body ? true : false}
                    />
                    <Button type="submit" color="teal">
                        Submit
                    </Button>
                </Form.Field>
            </Form>
            {Object.keys(errors).length > 0 && (
                <div className="ui error message">
                    <ul className="list">
                        {Object.values(errors).map((error) => (
                            <li key={error}>{error}</li>
                        ))}
                    </ul>
                </div>
            )}
        </>
    );
};

export default PostForm;
