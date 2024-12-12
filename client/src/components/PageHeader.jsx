import { PlusOutlined } from "@ant-design/icons";
import { Button } from "antd";
import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
function PageHeader({ title, url }) {
  return (
    <Wrapper>
      <Link to={`${url}`}>
        <Button type="primary">
          {title}
          <PlusOutlined />
        </Button>
      </Link>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  padding: 10px 1rem;
  background: white;
  font-size: 16px;
  font-weight: 500;
  border-radius: 5px;
  margin-bottom: 1rem;
  button {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.125rem;
    padding: 1.25rem 0.5rem;
    font-weight: 600;
  }
`;

export default PageHeader;
