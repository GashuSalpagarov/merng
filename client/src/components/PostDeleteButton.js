import { useState } from "react";
import { useMutation } from "@apollo/client";
import { useHistory } from "react-router-dom";
import { Button, Icon, Confirm } from "semantic-ui-react";

import {
  FETCH_POSTS_QUERY,
  DELETE_POST_MUTATION,
  DELETE_COMMENT_MUTATION,
} from "../util/graphql";

function PostDeleteButton({ postId, commentId }) {
  const history = useHistory();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const mutation = commentId ? DELETE_COMMENT_MUTATION : DELETE_POST_MUTATION;
  const [deleteFunction, { loading: deleteLoading }] = useMutation(mutation, {
    update(proxy) {
      if (!commentId) {
        const data = {
          ...proxy.readQuery({
            query: FETCH_POSTS_QUERY,
          }),
          writable: true,
        };
        
        if(data.getPosts) data.getPosts = data.getPosts.filter((p) => p.id !== postId);
        proxy.writeQuery({ query: FETCH_POSTS_QUERY, data });

        history.push("/");
      }
    },
    variables: { postId, commentId },
  });

  //   onDelete
  const deleteHandle = () => {
    setConfirmOpen(false);
    deleteFunction();
  };

  return (
    <>
      <Button
        color="red"
        basic
        onClick={deleteLoading ? null : () => setConfirmOpen(true)}
        floated="right"
        loading={deleteLoading}
      >
        <Icon name="trash" style={{ margin: 0 }} />
      </Button>
      <Confirm
        open={confirmOpen}
        onCancel={() => setConfirmOpen(false)}
        onConfirm={deleteHandle}
      />
    </>
  );
}

export default PostDeleteButton;
