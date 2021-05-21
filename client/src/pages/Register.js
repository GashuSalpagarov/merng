import React, { useContext, useState } from "react";
import { useMutation } from "@apollo/client";
import { Form, Button, Message, List } from "semantic-ui-react";

import { AuthContext } from "../context/auth";
import { useForm } from "../util/hooks";
import { REGISTER_USER_MUTATION } from "../util/graphql";

import MenuBar from "../components/MenuBar";

function Register(props) {
  const context = useContext(AuthContext);
  const { onChange, onSubmit, values } = useForm(registerUser, {
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});

  const [addUser, { loading }] = useMutation(REGISTER_USER_MUTATION, {
    update(_, { data: { register: userData } }) {
      context.login(userData);
      props.history.push("/");
    },
    onError(err) {
      setErrors(err.graphQLErrors[0].extensions.exception.errors);
    },
    variables: values,
  });

  function registerUser() {
    setErrors({});
    addUser();
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
          <h1>Register</h1>

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
            label="Email"
            placeholder="Email..."
            name="email"
            type="email"
            error={errors.email ? true : false}
            value={values.email}
            onChange={onChange}
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
          <Form.Input
            label="Confirm Password"
            placeholder="Confirm Password..."
            name="confirmPassword"
            type="password"
            value={values.confirmPassword}
            error={errors.password ? true : false}
            onChange={onChange}
          />
          <Button type="submit" primary>
            Register
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

export default Register;
