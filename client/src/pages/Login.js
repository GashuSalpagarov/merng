import React, { useContext, useState } from "react";
import { useMutation } from "@apollo/client";
import { Form, Button, Message, List } from "semantic-ui-react";

import { AuthContext } from "../context/auth";
import { useForm } from "../util/hooks";
import { LOGIN_USER_MUTATION } from "../util/graphql";

import MenuBar from "../components/MenuBar";

function Login(props) {
  const context = useContext(AuthContext);
  const { onChange, onSubmit, values } = useForm(loginUserCallback, {
    username: "",
    password: "",
  });

  const [errors, setErrors] = useState({});

  const [loginUser, { loading }] = useMutation(LOGIN_USER_MUTATION, {
    update(_, { data: { login: userData } }) {
      context.login(userData);
      props.history.push("/");
    },
    onError(err) {
      setErrors(err.graphQLErrors[0].extensions.exception.errors);
    },
    variables: values,
  });

  function loginUserCallback() {
    setErrors({});
    loginUser();
  }

  return (
    <>
      <MenuBar />

      <div className="form-container">
        <Form
          onSubmit={onSubmit}
          noValidate
          className={loading ? "loading" : ""}
          autoComplete="off"
        >
          <h1>Login</h1>

          <Form.Input
            label="Username"
            placeholder="Username..."
            name="username"
            type="text"
            value={values.username}
            onChange={onChange}
            error={errors.username ? true : false}
          />
          <Form.Input
            label="Password"
            placeholder="Password..."
            name="password"
            type="password"
            value={values.password}
            error={errors.password ? true : false}
            onChange={onChange}
          />
          <Button type="submit" primary>
            Login
          </Button>
        </Form>

        {Object.keys(errors).length > 0 && (
          <Message negative>
            <Message.Header>Errors</Message.Header>
            <List bulleted>
              {Object.values(errors).map((value, index) => (
                <List.Item key={index}>{value}</List.Item>
              ))}
            </List>
          </Message>
        )}
      </div>
    </>
  );
}

export default Login;
