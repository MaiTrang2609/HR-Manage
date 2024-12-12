import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Form, Input, notification } from "antd";
import styled from "styled-components";
import useTitle from "../hook/useTitle";
import wrapper from "../assets/image/login.jpg";
import { getUser, setUser } from "../utils/auth";
import { signUp } from "../api/auth";

function SignUp() {
  useTitle("Sign up");
  const navigate = useNavigate();
  const auth = getUser();
  useEffect(() => {
    if (auth) {
      navigate("/");
    }
  }, [auth, navigate]);

  const handleSignUp = async (values) => {
    const { password, passwordConfirm } = values;

    if (password !== passwordConfirm) {
      return notification.error({ message: "Password not same" });
    }

    const res = await signUp(values);
    setUser(res.data);
    notification.success({ message: res.data?.message });
    navigate("/");
  };

  return (
    <Wrapper
      style={{
        background: `url(${wrapper}) no-repeat center/cover`,
      }}
      className="vh-100 vw-100 d-flex-center"
    >
      <div className="container">
        <div className="title">Sign Up</div>
        <Form
          name="basic"
          layout="vertical"
          onFinish={handleSignUp}
          autoComplete="off"
        >
          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Please input your email!" },
              { type: "email", message: "Invalid email" },
            ]}
            className="login-item"
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: "Please input your name!" }]}
            className="login-item"
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Phone"
            name="phone"
            rules={[{ required: true, message: "Please input your phone!" }]}
            className="login-item"
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: "Please input your password!" }]}
            className="login-item"
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            label="Password Confirm"
            name="passwordConfirm"
            rules={[
              {
                required: true,
                message: "Please input your password confirm!",
              },
            ]}
            className="login-item"
          >
            <Input.Password />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" className="d-flex-center">
              Sign up
            </Button>
          </Form.Item>
        </Form>
        <div className="footer">
          Already have an account?{" "}
          <span onClick={() => navigate("/login")}>Login</span>
        </div>
      </div>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  .container {
    padding: 1.5rem 2.5rem 0rem 2.5rem;
    background-color: white;
    opacity: 0.9;
    border-radius: 0.5rem;
    width: 24rem;
  }
  .title {
    font-size: 1.5rem;
    font-weight: 700;
    color: #01509a;
    margin-bottom: 1rem;
  }
  .login-item {
    margin-bottom: 1.5rem;
    label {
      font-size: 1rem;
      color: #1677ff;
      font-weight: 400;
    }
    input {
      font-size: 1rem;
    }
  }
  button {
    background-color: #01509a;
    font-size: 1.25rem;
    padding: 1.25rem;
    width: 100%;
    margin-top: 1rem;
  }
  .footer {
    text-align: center;
    margin: 1rem 0rem;
    color: #01509a;
    span {
      color: red;
      cursor: pointer;
    }
  }
`;

export default SignUp;
