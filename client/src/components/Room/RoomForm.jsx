import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Button,
  Col,
  ColorPicker,
  Form,
  Input,
  notification,
  Row,
  Space,
} from "antd";
import { addDoc, getDoc, updateDoc } from "../../api/commonApi";
import Loading from "../Loading";
import { findDifferentProperties, isEmptyObject } from "../../utils/util";

function RoomForm() {
  const [form] = Form.useForm();
  const { id, action } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (data) => {
    data.color =
      typeof data.color === "string" ? data.color : data.color.toHexString();
    action === "add" ? handleAddRoom(data) : handleEditRoom(data);
  };

  const handleAddRoom = async (data) => {
    await addDoc("room", data, navigate);
  };

  const handleEditRoom = async (dataUpdate) => {
    if (isEmptyObject(findDifferentProperties(data, dataUpdate))) {
      notification.success({ message: "Nothing change" });
      return;
    }
    await updateDoc("room", id, dataUpdate);
    navigate("/room");
  };

  const getInfoRoom = async () => {
    setLoading(true);
    try {
      const result = await getDoc("room", id);
      setData(result?.data?.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!id) return;
    getInfoRoom();
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
              name="name"
              label="Name"
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <Input disabled={action === "view"} />
            </Form.Item>
          </Col>

          <Col xs={24} lg={12}>
            <Form.Item
              name="quantity"
              label="Quantity"
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <Input disabled={action === "view"} />
            </Form.Item>
          </Col>

          <Col xs={24} lg={12}>
            <Form.Item
              name="color"
              label="Color"
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <ColorPicker
                showText={(color) => <span>Hex: ({color.toHexString()})</span>}
                disabled={action === "view"}
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
            <Button onClick={() => navigate(`/room/edit/${id}`)}>Edit</Button>
          )}
        </Form.Item>
      </Form>
    </>
  );
}

export default RoomForm;
