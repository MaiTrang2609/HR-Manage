import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Button,
  Col,
  Form,
  Input,
  notification,
  Row,
  Select,
  Space,
} from "antd";
import { addDoc, getDoc, getListDoc, updateDoc } from "../../api/commonApi";
import Loading from "../Loading";
import { findDifferentProperties, isEmptyObject } from "../../utils/util";
import { getUser } from "../../utils/auth";

const listTypeUser = [
  {
    id: 1,
    label: "Outsite",
    value: "outsite",
  },
  {
    id: 2,
    label: "Staff",
    value: "staff",
  },
];

function UserForm() {
  const [form] = Form.useForm();
  const auth = getUser();

  const { id, action } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  const [typeUser, setTypeUser] = useState(null);

  const [listDivision, setListDivision] = useState([]);
  const [listPosition, setListPosition] = useState([]);

  const handleSubmit = (data) => {
    action === "add" ? handleAddUser(data) : handleEditUser(data);
  };

  const handleAddUser = async (data) => {
    await addDoc("user", data, navigate);
  };

  const handleEditUser = async (dataUpdate) => {
    if (isEmptyObject(findDifferentProperties(data, dataUpdate))) {
      notification.success({ message: "Nothing change" });
      return;
    }
    auth.role === "dm" && auth._id === id && delete dataUpdate.position;
    await updateDoc("user", id, dataUpdate);
    navigate("/user");
  };

  const getInfoUser = async () => {
    setLoading(true);
    try {
      const result = await getDoc("user", id);
      setData(result?.data?.data);
      setTypeUser(result?.data?.data?.type);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  const getListDivision = async () => {
    const result = await getListDoc("division");
    setListDivision(result?.data?.data);
  };
  const getListPosition = async () => {
    let result = await getListDoc("position");
    result = result?.data?.data;
    if (auth?.role === "dm") {
      const position = result.find((item) => item?._id === auth?.position);
      form.setFieldsValue({
        position: position?.title,
      });
      result = result.filter((item) => item?._id !== auth?.position);
    }
    setListPosition(result);
  };

  useEffect(() => {
    if (!id) return;
    getInfoUser();
  }, [id]);

  useEffect(() => {
    getListDivision();
    getListPosition();
  }, []);

  useEffect(() => {
    if (auth?.role === "dm") {
      form.setFieldsValue({
        division: auth?.division,
        type: auth?.type,
      });
      setTypeUser(auth?.type);
    }
  }, []);

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
              name="nickName"
              label="Nick name"
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
              name="email"
              label="Email"
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
            <Form.Item name="password" label="Password">
              <Input.Password disabled={action === "view"} />
            </Form.Item>
          </Col>
          <Col xs={24} lg={12}>
            <Form.Item name="phone" label="Phone">
              <Input disabled={action === "view"} />
            </Form.Item>
          </Col>
          <Col xs={24} lg={12}>
            <Form.Item name="address" label="Address">
              <Input disabled={action === "view"} />
            </Form.Item>
          </Col>
          <Col xs={24} lg={12}>
            <Form.Item
              name="type"
              label="Type"
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <Select
                disabled={action === "view" || auth?.role === "dm"}
                onChange={(data) => setTypeUser(data)}
              >
                {listTypeUser.map((item) => {
                  return (
                    <Select.Option key={item.id} value={item.value}>
                      {item.label}
                    </Select.Option>
                  );
                })}
              </Select>
            </Form.Item>
          </Col>

          {typeUser === "staff" && (
            <>
              <Col xs={24} lg={12}>
                <Form.Item
                  name="division"
                  label="Division"
                  rules={[
                    {
                      required: true,
                    },
                  ]}
                >
                  <Select disabled={action === "view" || auth?.role === "dm"}>
                    {listDivision.map((item) => {
                      return (
                        <Select.Option key={item._id} value={item._id}>
                          {item.name}
                        </Select.Option>
                      );
                    })}
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={24} lg={12}>
                <Form.Item
                  name="position"
                  label="Position"
                  rules={[
                    {
                      required: true,
                    },
                  ]}
                >
                  <Select disabled={action === "view" || auth?._id === id}>
                    {listPosition.map((item) => {
                      return (
                        <Select.Option key={item._id} value={item._id}>
                          {item.title}
                        </Select.Option>
                      );
                    })}
                  </Select>
                </Form.Item>
              </Col>
            </>
          )}
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
            <Button onClick={() => navigate(`/user/edit/${id}`)}>Edit</Button>
          )}
        </Form.Item>
      </Form>
    </>
  );
}

export default UserForm;
