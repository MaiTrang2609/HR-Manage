import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Form, Input, notification } from "antd";
import styled from "styled-components";
import useTitle from "../hook/useTitle";
import wrapper from "../assets/image/login.jpg";
import google from "../assets/image/google.png";

import { getUser, setUser } from "../utils/auth";
import { logIn, signInWithGoogle } from "../api/auth";

function Login() {
  useTitle("Login");
  const navigate = useNavigate();
  const auth = getUser();
  useEffect(() => {
    if (auth) {
      navigate("/");
    }
  }, [auth, navigate]);

  const handleLogin = async (values) => {
    try {
      const res = await logIn(values);
      setUser(res.data);
      notification.success({ message: res.data?.message });
      navigate("/");
    } catch (error) {}
  };

  return (
    <Wrapper
      style={{
        background: `url(${wrapper}) no-repeat center/cover`,
      }}
      className="vh-100 vw-100 d-flex-center"
    >
      <div className="container">
        <div className="title">Login</div>
        <Form
          name="basic"
          layout="vertical"
          onFinish={handleLogin}
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
            label="Password"
            name="password"
            rules={[{ required: true, message: "Please input your password!" }]}
            className="login-item"
          >
            <Input.Password />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" className="d-flex-center">
              Login
            </Button>
          </Form.Item>
        </Form>

        <div className="login-other">Or</div>
        <div
          className="flex align-center justify-center"
          onClick={() => signInWithGoogle(navigate)}
        >
          <img src={google} alt="" className="login-google" />
        </div>

        <div className="footer">
          No account? <span onClick={() => navigate("/sign-up")}>Sign up</span>
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
    margin-bottom: 2rem;
    label {
      font-size: 1rem;
      color: #1677ff;
      font-weight: 400;
    }
    input {
      /* padding: 0.25rem 0rem; */
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
  .login-google {
    width: 2rem;
    height: 2rem;
    cursor: pointer;
  }
  .login-other {
    text-align: center;
    transform: translateY(-10px);
    color: red;
  }
`;

export default Login;
