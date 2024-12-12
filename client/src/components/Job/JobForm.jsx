import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Button,
  Col,
  DatePicker,
  Form,
  Input,
  notification,
  Row,
  Select,
  Space,
} from "antd";
import locale from "antd/es/date-picker/locale/vi_VN";
import moment from "moment";

import { addDoc, getDoc, updateDoc } from "../../api/commonApi";
import Loading from "../Loading";
import { findDifferentProperties, isEmptyObject } from "../../utils/util";
import { getUser } from "../../utils/auth";

const { TextArea } = Input;

const typeOfEmployment = [
  {
    id: 1,
    value: "fulltime",
    label: "Fulltime",
  },
  {
    id: 2,
    value: "parttime",
    label: "Parttime",
  },
  {
    id: 3,
    value: "remote",
    label: "Remote",
  },
];

function JobForm() {
  const [form] = Form.useForm();

  const { id, action } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  const role = getUser()?.role;

  const handleSubmit = (data) => {
    action === "add" ? handleAddJob(data) : handleEditJob(data);
  };

  const handleAddJob = async (data) => {
    await addDoc("job", data, navigate);
  };

  const handleEditJob = async (dataUpdate) => {
    if (isEmptyObject(findDifferentProperties(data, dataUpdate))) {
      notification.success({ message: "Nothing change" });
      return;
    }

    await updateDoc("job", id, dataUpdate);
    navigate("/job");
  };

  const getInfoJob = async () => {
    setLoading(true);
    try {
      const result = await getDoc("job", id);
      setData({
        ...result?.data?.data,
        deadline: moment(result?.data?.data?.deadline),
      });
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (!id) return;
    getInfoJob();
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
          <Col xs={24} lg={12}>
            <Form.Item
              name="offer"
              label="Offer"
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
            <Form.Item name="experience" label="Experience">
              <Input disabled={action === "view"} />
            </Form.Item>
          </Col>
          <Col xs={24} lg={12}>
            <Form.Item name="deadline" label="Deadline">
              <DatePicker
                disabled={action === "view"}
                format="DD-MM-YYYY"
                locale={locale}
                className="w-100"
              />
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
              <Select disabled={action === "view"}>
                {typeOfEmployment.map((item) => {
                  return (
                    <Select.Option key={item.id} value={item.value}>
                      {item.label}
                    </Select.Option>
                  );
                })}
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} lg={12}>
            <Form.Item name="quantity" label="Quantity">
              <Input disabled={action === "view"} />
            </Form.Item>
          </Col>
          <Col xs={24} lg={12}>
            <Form.Item name="desc" label="Desc">
              <TextArea rows={6} disabled={action === "view"} />
            </Form.Item>
          </Col>
          <Col xs={24} lg={12}>
            <Form.Item name="require" label="Require">
              <TextArea rows={6} disabled={action === "view"} />
            </Form.Item>
          </Col>
          <Col xs={24} lg={12}>
            <Form.Item
              name="address"
              label="Address"
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <Input disabled={action === "view"} />
            </Form.Item>
          </Col>
        </Row>

        {role !== "candidate" && (
          <Form.Item>
            <Space>
              {action !== "view" && (
                <Button type="primary" htmlType="submit">
                  Submit
                </Button>
              )}
            </Space>

            {action === "view" && (
              <Button onClick={() => navigate(`/job/edit/${id}`)}>Edit</Button>
            )}
          </Form.Item>
        )}
      </Form>
    </>
  );
}

export default JobForm;
