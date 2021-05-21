import React, { useContext, useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { Link } from "react-router-dom";
import {
  Card,
  Grid,
  Image,
  Button,
  Icon,
  Label,
  Transition,
  Form,
  TextArea,
} from "semantic-ui-react";
import moment from "moment";

import { AuthContext } from "../context/auth";
import { FETCH_POST_QUERY, CREATE_COMMENT_MUTATION } from "../util/graphql";

import MenuBar from "../components/MenuBar";
import PostLikeButton from "../components/PostLikeButton";
import PostDeleteButton from "../components/PostDeleteButton";

function SinglePost(props) {
  const { user } = useContext(AuthContext);
  const postId = props.match.params.postId;

  const [comment, setComment] = useState("");
  // const [error, setError] = useState("");

  const {
    loading,
    data: {
      getPost: {
        id,
        body,
        createdAt,
        username,
        likes,
        likeCount,
        comments,
        commentCount,
      } = {},
    } = {},
  } = useQuery(FETCH_POST_QUERY, {
    variables: {
      postId,
    },
  });

  const [createComment, { loading: commentCreating }] = useMutation(
    CREATE_COMMENT_MUTATION,
    {
      update() {
        setComment("");
      },
      variables: {
        postId,
        body: comment,
      },
      // onError(err) {
      //   console.dir(err)
      //   setError(err);
      // },
    }
  );

  const onInputKeyDown = (event) => {
    if(!(comment.trim() !== "" && event.key === "Enter" && !event.shiftKey)) return; 
    createComment();
    event.target.blur();
  };

  return (
    <>
      <MenuBar />
      {loading ? (
        <h1>Loading post...</h1>
      ) : id ? (
        <Grid>
          <Grid.Row>
            <Grid.Column width={2}>
              <Image
                floated="right"
                size="small"
                src="https://react.semantic-ui.com/images/avatar/large/jenny.jpg"
              />
            </Grid.Column>
            <Grid.Column width={10}>
              <Card fluid>
                <Card.Content>
                  <Card.Header>{username}</Card.Header>
                  <Card.Meta>{moment(createdAt).fromNow()}</Card.Meta>
                  <Card.Description>{body}</Card.Description>
                </Card.Content>
                <hr />
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

                  {user && user.username === username && (
                    <PostDeleteButton postId={id} />
                  )}
                </Card.Content>
              </Card>
              {user && (
                <Card fluid>
                  <Card.Content>
                    <Card.Description>Post a comment</Card.Description>
                  </Card.Content>
                  <Card.Content>
                    <Form>
                      <Form.Input
                        placeholder="Comment..."
                        name="comment"
                        type="textarea"
                        control={TextArea}
                        onChange={(event) => setComment(event.target.value)}
                        onKeyDown={onInputKeyDown}
                        value={comment}
                        // error={error ? true : false}
                      />
                      <Button
                        type="submit"
                        color="teal"
                        disabled={comment.trim() === ""}
                        onClick={createComment}
                        loading={commentCreating}
                      >
                        Submit
                      </Button>
                    </Form>
                  </Card.Content>
                </Card>
              )}
              <Transition.Group>
                {comments.map((comment) => (
                  <Card key={comment.id} fluid>
                    <Card.Content>
                      {user && user.username === comment.username && (
                        <PostDeleteButton postId={id} commentId={comment.id} />
                      )}
                      <Card.Header>{comment.username}</Card.Header>
                      <Card.Meta>
                        {moment(comment.createdAt).fromNow()}
                      </Card.Meta>
                      <Card.Description>{comment.body}</Card.Description>
                    </Card.Content>
                  </Card>
                ))}
              </Transition.Group>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      ) : (
        <>
          <h1>Post not found</h1>

          <Button color="teal" as={Link} to={"/"}>
            Return to home page
          </Button>
        </>
      )}
    </>
  );
}

export default SinglePost;
