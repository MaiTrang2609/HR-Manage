import React from "react";
import { Dropdown, Space } from "antd";
import { DownOutlined } from "@ant-design/icons";
import styled from "styled-components";
import { getUser } from "../utils/auth";
import { Link } from "react-router-dom";
import avatar from "../assets/image/avatar.jpg";
import { logOut } from "../api/auth";

function Header() {
  const auth = getUser();
  const items = [
    {
      key: "1",
      label: <Link to={"/profile"}>Profile</Link>,
    },

    {
      key: "2",
      label: <Link onClick={() => logOut()}>Logout</Link>,
    },
  ];
  return (
    <Wrapper>
      <div className="header_left">
        Xin chào <span>{auth?.name}</span>
      </div>
      <div className="header_right">
        <Dropdown menu={{ items }}>
          <Space>
            <img src={auth?.img || avatar} alt="" className="header_img" />
            <span>{auth?.name}</span>
            <DownOutlined />
          </Space>
        </Dropdown>
      </div>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  position: fixed;
  width: -webkit-fill-available;
  z-index: 99;
  background: white;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 2rem;
  font-size: 1.25rem;
  .header_left {
    span {
      font-weight: 600;
      color: red;
    }
  }
  .header_right {
    cursor: pointer;
  }
  .header_img {
    width: 4rem;
    height: 4rem;
    border-radius: 4rem;
  }
`;

export default Header;
