import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Col, Form, Input, notification, Row, Space } from "antd";
import { addDoc, getDoc, updateDoc } from "../../api/commonApi";
import Loading from "../Loading";
import {
  findDifferentProperties,
  isEmptyObject,
  stripHtml,
} from "../../utils/util";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

function UserForm() {
  const [form] = Form.useForm();

  const { id, action } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  const [editorData, setEditorData] = useState("");

  const handleEditorChange = (event, editor) => {
    const data = editor.getData();
    setEditorData(data);
  };

  const handleSubmit = (data) => {
    action === "add" ? handleAddEmail(data) : handleEditEmail(data);
  };

  const handleAddEmail = async (data) => {
    data.desc = editorData;
    await addDoc("email", data, navigate);
  };

  const handleEditEmail = async (dataUpdate) => {
    if (isEmptyObject(findDifferentProperties(data, dataUpdate))) {
      notification.success({ message: "Nothing change" });
      return;
    }
    dataUpdate.desc = editorData;
    await updateDoc("email", id, dataUpdate);
    navigate("/email");
  };

  const getInfoEmail = async () => {
    setLoading(true);
    try {
      const result = await getDoc("email", id);
      setData(result?.data?.data);
      setEditorData(stripHtml(result?.data?.data?.desc));
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!id) return;
    getInfoEmail();
  }, [id]);

  if (loading) {
    return <Loading />;
  }

  return (
    <>
      <Form
        form={form}
        name="validateOnly"
        layout="vertical"
        autoComplete="off"
        onFinish={handleSubmit}
        initialValues={data}
      >
        <Row gutter={24}>
          <Col xs={24} lg={12}>
            <Form.Item
              name="title"
              label="Title"
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <Input disabled={action === "view"} />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              name="desc"
              label="Desc"
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <CKEditor
                editor={ClassicEditor}
                config={{
                  height: 1000, // Set the height here
                }}
                onChange={handleEditorChange}
                data={editorData}
                debug={true}
                readOnly={action !== "view"}
              />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item>
          <Space>
            {action !== "view" && (
              <Button type="primary" htmlType="submit">
                Submit
              </Button>
            )}
          </Space>

          {action === "view" && (
            <Button onClick={() => navigate(`/email/edit/${id}`)}>Edit</Button>
          )}
        </Form.Item>
      </Form>
    </>
  );
}

export default UserForm;
