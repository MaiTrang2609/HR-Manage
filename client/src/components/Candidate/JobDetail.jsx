import { Button, Modal } from "antd";
import React, { useEffect, useState } from "react";
import { getDoc } from "../../api/commonApi";
import styled from "styled-components";
import UploadCv from "./UploadCv";

function JobDetail({ id }) {
  const [isOpen, setIsOpen] = useState(false);
  const [data, setData] = useState(null);
  const getInfoJob = async () => {
   
      const result = await getDoc("job", id);
      setData({
        ...result?.data?.data,
      });
   
  };
  useEffect(() => {
    if (!id || !isOpen) return;
    getInfoJob();
  }, [id, isOpen]);

  const handleCancel = () => {
    setIsOpen(false);
  };
  const handleOk = () => {
    setIsOpen(false);
  };

  return (
    <>
      <Button key="submit" type="primary" onClick={() => setIsOpen(true)}>
        Detail
      </Button>
      {isOpen && (
        <Modal
          open={isOpen}
          onOk={handleOk}
          onCancel={handleCancel}
          footer={[
            <Button key="back" onClick={handleCancel}>
              Close
            </Button>,

            <UploadCv job={data} />,
          ]}
        >
          <Wrapper>
            <div className="title">{data?.title}</div>
            <div className="flex justify-between mt-1">
              <div>Số lượng tuyển : {data?.quantity}</div>
              <div>
                Hình thức : <span>{data?.type}</span>
              </div>
            </div>
            <div className="flex justify-between mt-1">
              <div>Kinh nghiệm : {data?.experience}</div>
              <div>Lương : {data?.offer}</div>
            </div>

            <div className="mt-1">Mô tả công việc : {data?.desc}</div>
            <div className="mt-1">Yêu cầu : {data?.require}</div>
          </Wrapper>
        </Modal>
      )}
    </>
  );
}

export default JobDetail;

const Wrapper = styled.div`
  padding: 1rem;
  font-weight: 600;
  font-size: 1rem;
  line-height: 1.5;
  .title {
    font-size: 1.75rem;
    text-align: center;
    margin-bottom: 1rem;
  }
`;
