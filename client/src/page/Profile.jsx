import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Col, Form, Input, notification, Row, Select } from "antd";
import Loading from "../components/Loading";
import { getUser } from "../utils/auth";
import { getMyProfile, updateProfile, updatePassword } from "../api/auth";

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

function Profile() {
  const [formProfile, formPassword] = Form.useForm();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  const [typeUser, setTypeUser] = useState(null);

  const listDivision = [];
  const listPosition = [];

  const handleUpdateProfile = async (data) => {
    data = {
      address: data.address ?? "",
      phone: data.phone ?? "",
    };
    await updateProfile(data);
    getInfoUser();
  };

  const handleUpdatePassword = async (data) => {
    data = {
      password: data.password ?? "",
      passwordConfirm: data.passwordConfirm ?? "",
    };
    if (data.password !== data.passwordConfirm) {
      return notification.error({
        message: "Password and confirm password do not match.",
      });
    }
    await updatePassword(data);
    getInfoUser();
  };

  const getInfoUser = async () => {
    setLoading(true);
    try {
      const result = await getMyProfile();
      setData(result?.data?.data);
      setTypeUser(result?.data?.data?.type);

      formProfile.setFieldsValue({
        division: result?.data?.data?.division?.name,
        position: result?.data?.data?.position?.title,
        type: result?.data?.data?.type,
      });

      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  useEffect(() => {
    getInfoUser();
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="page-list">
      <div className="list_header">Profile</div>
      <Form
        form={formProfile}
        name="validateOnly"
        layout="vertical"
        autoComplete="off"
        onFinish={handleUpdateProfile}
        initialValues={data}
      >
        <Row gutter={24}>
          <Col xs={24} lg={12}>
            <Form.Item name="name" label="Name">
              <Input disabled />
            </Form.Item>
          </Col>
          <Col xs={24} lg={12}>
            <Form.Item name="nickName" label="Nick name">
              <Input disabled />
            </Form.Item>
          </Col>
          <Col xs={24} lg={12}>
            <Form.Item name="email" label="Email">
              <Input disabled />
            </Form.Item>
          </Col>
          <Col xs={24} lg={12}>
            <Form.Item name="phone" label="Phone">
              <Input />
            </Form.Item>
          </Col>
          <Col xs={24} lg={12}>
            <Form.Item name="address" label="Address">
              <Input />
            </Form.Item>
          </Col>
          <Col xs={24} lg={12}>
            <Form.Item name="type" label="Type">
              <Select disabled onChange={(data) => setTypeUser(data)}>
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
                <Form.Item name="division" label="Division">
                  <Select disabled>
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
                <Form.Item name="position" label="Position">
                  <Select disabled>
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
          <Button type="primary" htmlType="submit">
            Update profile
          </Button>
        </Form.Item>
      </Form>

      <div className="list_header">Password</div>
      <Form
        form={formPassword}
        name="validateOnly"
        layout="vertical"
        autoComplete="off"
        onFinish={handleUpdatePassword}
      >
        <Row gutter={24}>
          <Col xs={24} lg={12}>
            <Form.Item name="password" label="Password">
              <Input.Password required />
            </Form.Item>
          </Col>
          <Col xs={24} lg={12}>
            <Form.Item name="passwordConfirm" label="Password confirm">
              <Input.Password required />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            Update password
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}

export default Profile;
