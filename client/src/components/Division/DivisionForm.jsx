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
import TextArea from "antd/es/input/TextArea";
import { addDoc, getDoc, getListDoc, updateDoc } from "../../api/commonApi";
import Loading from "../Loading";
import { findDifferentProperties, isEmptyObject } from "../../utils/util";

function DivisionForm() {
  const [form] = Form.useForm();
  const { id, action } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [listUser, setListUser] = useState([]);
  const [divisionUsers, setDivisionUsers] = useState([]);
  const [userCount, setUserCount] = useState(0);

  const handleSubmit = (data) => {
    action === "add" ? handleAddDivision(data) : handleEditDivision(data);
  };

  const handleAddDivision = async (data) => {
    await addDoc("division", data, navigate);
  };

  const handleEditDivision = async (dataUpdate) => {
    if (isEmptyObject(findDifferentProperties(data, dataUpdate))) {
      notification.success({ message: "Nothing change" });
      return;
    }
    await updateDoc("division", id, dataUpdate);
    navigate("/division");
  };

  const getInfoDivision = async () => {
    setLoading(true);
    try {
      const result = await getDoc("division", id);
      setData(result?.data?.data);
      form.setFieldValue("leader", result?.data?.data?.leader?._id);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  const getLitUser = async (id) => {
    const payload = {
      page: 1,
      limit: 99999,
      search: ''
    };

    try {
      const result = await getListDoc("user", payload);
      const users = result?.data?.data;
      setListUser(users);

      if (id) {
        const usersInDivision = users.filter(user => user?.division?._id === id);
        console.log(usersInDivision)
        setDivisionUsers(usersInDivision);
        setUserCount(usersInDivision.length);
        form.setFieldValue("quantity", usersInDivision.length);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    if (!id) return;
    getInfoDivision();
  }, [id]);

  useEffect(() => {
    getLitUser(id);
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
        initialValues={{ ...data, quantity: userCount }}
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
            <Form.Item name="leader" label="Leader">
              <Select disabled={action === "view"}>
                {listUser
                  ?.filter((item) => item?.position?.role === "dm")
                  .map((item) => {
                    return (
                      <Select.Option key={item._id} value={item._id}>
                        {item.name}
                      </Select.Option>
                    );
                  })}
              </Select>
            </Form.Item>
          </Col>
          {action === "view" && (
            <Col xs={24} lg={12}>
              <Form.Item
                name="quantity"
                label="Quantity"
              >
                <Input 
                  disabled 
                  value={userCount}
                />
              </Form.Item>
            </Col>
          )}

          <Col xs={24} lg={12}>
            <Form.Item name="desc" label="Desc">
              <TextArea disabled={action === "view"} rows={4} />
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
            <Button onClick={() => navigate(`/division/edit/${id}`)}>
              Edit
            </Button>
          )}
        </Form.Item>
      </Form>
    </>
  );
}

export default DivisionForm;