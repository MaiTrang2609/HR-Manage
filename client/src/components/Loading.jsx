import React from "react";
import { LoadingOutlined } from "@ant-design/icons";
import { Spin } from "antd";
import styled from "styled-components";
function Loading() {
  return (
    <Wrapper>
      <Spin indicator={<LoadingOutlined style={{ fontSize: 84 }} spin />} />;
    </Wrapper>
  );
}

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  padding-top: 8rem;
  justify-content: center;
  height: calc(100vh - 28rem);
`;
export default Loading;
