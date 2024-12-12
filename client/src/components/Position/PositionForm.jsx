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
import { addDoc, getDoc, updateDoc } from "../../api/commonApi";
import Loading from "../Loading";
import { findDifferentProperties, isEmptyObject } from "../../utils/util";
import TextArea from "antd/es/input/TextArea";
import { listRole } from "../../utils/contain";

function PositionForm() {
  const [form] = Form.useForm();

  const { id, action } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  // const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (value) => {
    action === "add" ? handleAddPosition(value) : handleEditPosition(value);
  };

  const handleAddPosition = async (data) => {
    await addDoc("position", data, navigate);
  };

  const handleEditPosition = async (dataUpdate) => {
    if (isEmptyObject(findDifferentProperties(data, dataUpdate))) {
      notification.success({ message: "Nothing change" });
      return;
    }

    await updateDoc("position", id, dataUpdate);
    navigate("/position");
  };

  const getInfoPosition = async () => {
    setLoading(true);
    try {
      const result = await getDoc("position", id);
      setData(result?.data?.data);
      // setRoles(result?.data?.data?.roles);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!id) return;
    getInfoPosition();
  }, [id]);

  if (loading) {
    return <Loading />;
  }

  // const handleSetRole = (type, value) => {
  //   if (value) {
  //     setRoles([...roles, type]);
  //     return;
  //   }
  //   let index = roles.indexOf(type);
  //   if (index !== -1) {
  //     roles.splice(index, 1);
  //   }
  //   setRoles(roles);
  // };

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
            <Form.Item name="title" label="Title">
              <Input disabled={action === "view"} />
            </Form.Item>
          </Col>

          <Col xs={24} lg={12}>
            <Form.Item name="name" label="Name">
              <Input disabled={action === "view"} />
            </Form.Item>
          </Col>
          <Col xs={24} lg={12}>
            <Form.Item name="role" label="Role">
              <Select disabled={action === "view"}>
                {listRole.map((item) => {
                  return (
                    <Select.Option key={item.id} value={item.value}>
                      {item.name}
                    </Select.Option>
                  );
                })}
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} lg={12}>
            <Form.Item name="desc" label="Desc">
              <TextArea rows={4} disabled={action === "view"} />
            </Form.Item>
          </Col>

          {/* <Col xs={6} lg={4}>
            <Form.Item name="user" label="User">
              <Switch
                disabled={action === "view"}
                defaultChecked={roles?.includes("user")}
                onChange={(data) => handleSetRole("user", data)}
              />
            </Form.Item>
          </Col>
          <Col xs={6} lg={4}>
            <Form.Item name="division" label="Division">
              <Switch
                disabled={action === "view"}
                defaultChecked={roles?.includes("division")}
                onChange={(data) => handleSetRole("division", data)}
              />
            </Form.Item>
          </Col>
          <Col xs={6} lg={4}>
            <Form.Item name="job" label="Job">
              <Switch
                disabled={action === "view"}
                defaultChecked={roles?.includes("job")}
                onChange={(data) => handleSetRole("job", data)}
              />
            </Form.Item>
          </Col>
          <Col xs={6} lg={4}>
            <Form.Item name="cv" label="CV">
              <Switch
                disabled={action === "view"}
                defaultChecked={roles?.includes("cv")}
                onChange={(data) => handleSetRole("cv", data)}
              />
            </Form.Item>
          </Col>
          <Col xs={6} lg={4}>
            <Form.Item name="annualLeave" label="Annual Leave">
              <Switch
                disabled={action === "view"}
                defaultChecked={roles?.includes("annualLeave")}
                onChange={(data) => handleSetRole("annualLeave", data)}
              />
            </Form.Item>
          </Col>
          <Col xs={6} lg={4}>
            <Form.Item name="payCheck" label="Pay check">
              <Switch
                disabled={action === "view"}
                defaultChecked={roles?.includes("payCheck")}
                onChange={(data) => handleSetRole("payCheck", data)}
              />
            </Form.Item>
          </Col> */}
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
            <Button onClick={() => navigate(`/position/edit/${id}`)}>
              Edit
            </Button>
          )}
        </Form.Item>
      </Form>
    </>
  );
}

export default PositionForm;
