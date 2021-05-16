import React, { useState } from "react";
import { Form, Button, Message, List } from "semantic-ui-react";
import { useMutation } from "@apollo/client";

import { useForm } from "../util/hooks";
import { CREATE_POST_MUTATION, FETCH_POSTS_QUERY } from "../util/graphql";

function PostForm() {
  const [error, setError] = useState('');
  const { values, onChange, onSubmit } = useForm(createPostCallback, {
    body: "",
  });

  const [createPost, { loading }] = useMutation(CREATE_POST_MUTATION, {
    variables: values,
    update(proxy, result) {
      const data = {
        ...proxy.readQuery({
          query: FETCH_POSTS_QUERY,
        }),
        writable: true,
      };

      data.getPosts = [result.data.createPost, ...data.getPosts];
      proxy.writeQuery({ query: FETCH_POSTS_QUERY, data });
      values.body = "";
    },
    onError(err) {
      setError(err.graphQLErrors[0].message);
    },
  });

  function createPostCallback() {
    setError();
    createPost();
  }

  return (
    <Form onSubmit={onSubmit} className={loading ? "loading" : ""}>
      <h2>Create a post:</h2>
      <Form.Field>
        <Form.Input
          placeholder="Hi world"
          name="body"
          onChange={onChange}
          value={values.body}
          error={error ? true : false}
        />
        <Button type="submit" color="teal">
          Submit
        </Button>
      </Form.Field>

      {error && (
        <Message negative style={{ marginBottom: "20px" }}>
          <Message.Header>Errors</Message.Header>
          <List bulleted>
            <List.Item>{error}</List.Item>
          </List>
        </Message>
      )}
    </Form>
  );
}

export default PostForm;
