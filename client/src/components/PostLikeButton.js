import { useState, useEffect } from "react";
import { useMutation } from "@apollo/client";
import { useHistory } from "react-router-dom";
import { Button, Icon, Label } from "semantic-ui-react";

import { LIKE_POST_MUTATION } from "../util/graphql";

function PostLikeButton({ post: { id, likes, likeCount, user } }) {
  const [liked, setLiked] = useState(false);
  const [likePost, { loading: likeLoading }] = useMutation(LIKE_POST_MUTATION, {
    variables: { postId: id },
  });

  const history = useHistory();

  const handleLike = () => {
    if (user) {
      likePost();
    } else {
      history.push("/login");
    }
  };

  useEffect(() => {
    if (
      user &&
      likes &&
      likes.find((like) => like.username === user.username)
    ) {
      setLiked(true);
    } else setLiked(false);
  }, [user, likes]);
  return (
    <Button
      as="div"
      labelPosition="right"
      onClick={likeLoading ? null : handleLike}
    >
      <Button color="teal" basic={liked ? false : true} loading={likeLoading}>
        <Icon name="heart" />
      </Button>
      <Label basic color="teal" pointing="left">
        {likeCount}
      </Label>
    </Button>
  );
}

export default PostLikeButton;
