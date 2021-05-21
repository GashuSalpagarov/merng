import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { Card, Icon, Label, Image, Button } from "semantic-ui-react";
import moment from "moment";
// import 'moment/locale/ru'
// moment.locale("ru");

import { AuthContext } from "../context/auth";

import PostLikeButton from "../components/PostLikeButton";
import PostDeleteButton from "../components/PostDeleteButton";

function PostCard({
  post: { body, createdAt, id, username, likeCount, commentCount, likes },
}) {
  const { user } = useContext(AuthContext);

  return (
    <Card style={{ width: "100%" }}>
      <Card.Content as={Link} to={`/posts/${id}`} title="Go to post page">
        <Image
          floated="right"
          size="mini"
          src="https://react.semantic-ui.com/images/avatar/large/jenny.jpg"
        />
        <Card.Header>{username}</Card.Header>
        <Card.Meta>{moment(createdAt).fromNow()}</Card.Meta>
        <Card.Description>{body}</Card.Description>
      </Card.Content>
      <Card.Content extra>
        <PostLikeButton post={{ id, likes, likeCount, user }} />
        <Button labelPosition="right" as={Link} to={`/posts/${id}`}>
          <Button color="blue" basic>
            <Icon name="comments" />
          </Button>
          <Label basic color="blue" pointing="left">
            {commentCount}
          </Label>
        </Button>

        {user && user.username === username && <PostDeleteButton postId={id} />}
      </Card.Content>
    </Card>
  );
}

export default PostCard;
