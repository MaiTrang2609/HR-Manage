import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, message, Modal, Upload, notification } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { getUser } from "../../utils/auth";
import { addDoc } from "../../api/commonApi";
import { storage } from "../../utils/firebase";
import styled from "styled-components";

function UploadCv({ job }) {
  const auth = getUser();
  const [isOpen, setIsOpen] = useState(false);

  const handleLinkCv = (options) => {
    const { onSuccess, onError, file } = options;
    const today = new Date().toISOString();

    if (file == null) return;
    if (file.type !== "application/pdf") {
      onError("Only PDF file");
      notification.error({ message: "Only PDF file" });
    } else {
      const imageRef = ref(
        storage,
        "cv" + `/${job?.title}` + `/${today.slice(0, 10) + "-" + file.name}`
      );
      uploadBytes(imageRef, file).then((snapshot) => {
        getDownloadURL(snapshot.ref)
          .then((url) => {
            onSuccess("Upload success");
            handleAddCv(url);
          })
          .catch((error) => {
            onError({ event: error });
          });
      });
    }
    return;
  };

  const handleAddCv = async (url) => {
    let data = {
      url,
      status: "pending",
      job: job?._id,
      user: auth._id,
    };

    await addDoc("cv", data);

    setIsOpen(false);
  };

  const handleCancel = () => {
    setIsOpen(false);
  };
  const handleOk = () => {
    setIsOpen(false);
  };

  return (
    <>
      <Button key="submit" type="primary" onClick={() => setIsOpen(true)}>
        Upload
      </Button>

      {isOpen && (
        <Modal
          open={isOpen}
          onOk={handleOk}
          onCancel={handleCancel}
          footer={[]}
        >
          <Wrapper>
            <div className="title">{job?.title}</div>

            <Upload customRequest={handleLinkCv} className="d-flex-center">
              <Button icon={<UploadOutlined />}>Click to Upload</Button>
            </Upload>
          </Wrapper>
        </Modal>
      )}
    </>
  );
}

export default UploadCv;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 1rem;
  .title {
    font-size: 1.5rem;
    line-height: 1.25;
    text-align: center;
    font-weight: 600;
  }
`;
