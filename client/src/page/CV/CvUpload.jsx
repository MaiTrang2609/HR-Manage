import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { notification, Select, Upload } from "antd";
import { InboxOutlined } from "@ant-design/icons";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { addDoc, getListDoc } from "../../api/commonApi";
import { storage } from "../../utils/firebase";
import { getUser } from "../../utils/auth";

const { Dragger } = Upload;

function CvUpload({ title }) {
  const auth = getUser();
  const navigate = useNavigate();
  const { id } = useParams();

  const [listUser, setListUser] = useState([]);
  const [user, setUser] = useState(null);

  const getListUser = async () => {
    const result = await getListDoc("user");
    setListUser(result?.data?.data);
  };

  useEffect(() => {
    if (auth && (auth?.role === "admin" || auth?.role === "hr")) {
      getListUser();
    }
  }, [auth?.role]);

  const handleLinkCv = (options) => {
    const { onSuccess, onError, file, onProgress } = options;
    const today = new Date().toISOString();

    if (file == null) return;
    if (file.type !== "application/pdf") {
      onError("Only PDF file");
      notification.error({ message: "Only PDF file" });
    } else {
      const imageRef = ref(
        storage,
        "cv" + `/${title}` + `/${today.slice(0, 10) + "-" + file.name}`
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
      job: id,
      user: auth?.role === "admin" || auth?.role === "hr" ? user : auth._id,
    };
    auth?.role !== "candidate"
      ? await addDoc("cv", data, navigate)
      : await addDoc("cv", data);

    auth?.role === "candidate" && navigate("/my-cv");
  };

  return (
    <div className="page-list">
      {(auth?.role === "admin" || auth?.role === "hr") && (
        <Select
          placeholder="Select a user"
          style={{ width: "16rem" }}
          onChange={(value) => setUser(value)}
          allowClear
        >
          {listUser
            ?.filter((item) => item.type === "outsite")
            ?.map((item) => {
              return (
                <Select.Option key={item?._id} value={item?._id}>
                  {item?.name}
                </Select.Option>
              );
            })}
        </Select>
      )}

      <Dragger
        customRequest={handleLinkCv}
        disabled={auth?.role === "Admin" && !user}
      >
        <p className="ant-upload-drag-icon">
          <InboxOutlined />
        </p>
        <p className="ant-upload-text">
          Click or drag file to this area to upload
        </p>
      </Dragger>
    </div>
  );
}

export default CvUpload;
