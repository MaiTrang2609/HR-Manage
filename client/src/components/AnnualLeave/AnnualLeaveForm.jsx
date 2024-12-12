import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Col, DatePicker, Form, Input, Row, Select, Space } from "antd";
import Loading from "../Loading";
import { addDoc, getListDoc } from "../../api/commonApi";
import { getAnnualLeaveOfUser } from "../../api/timeOff";
import { getUser } from "../../utils/auth";
import moment from "moment";

function AnnualLeaveForm() {
  const [form] = Form.useForm();

  const { id, action } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [listUser, setListUser] = useState([]);

  const auth = getUser();

  const handleAddAnnualLeave = async (data) => {
    await addDoc("annual-leave", data, navigate);
  };

  const getInfo = async () => {
    setLoading(true);
    try {
      let result = await getAnnualLeaveOfUser(id ? id : auth?._id);
      result = result?.data?.data;
      setData(result);
      form.setFieldValue("user", result?.user?.name);
      form.setFieldValue("year", moment(result?.year, "YYYY"));
      form.setFieldValue("remaining", result.remaining.toFixed(2));
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  const getListUser = async () => {
    const result = await getListDoc("user");
    setListUser(result?.data?.data);
  };

  useEffect(() => {
    if (action && action === "add") return;
    getInfo();
  }, [action]);

  useEffect(() => {
    ["admin"]?.includes(auth?.role) && getListUser();
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <Form
      form={form}
      name="validateOnly"
      layout="vertical"
      autoComplete="off"
      onFinish={handleAddAnnualLeave}
      initialValues={data}
    >
      <Row gutter={24}>
        <Col xs={24} lg={12}>
          <Form.Item
            name="user"
            label="User"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Select disabled={action !== "add"}>
              {listUser
                ?.filter((item) => item.type !== "outsite")
                .map((item) => {
                  return (
                    <Select.Option key={item?._id} value={item?._id}>
                      {item?.name}
                    </Select.Option>
                  );
                })}
            </Select>
          </Form.Item>
        </Col>

        <Col xs={24} lg={12}>
          <Form.Item name="year" label="Year">
            <DatePicker
              disabled={action !== "add"}
              picker="year"
              className="w-100"
            />
          </Form.Item>
        </Col>
        <Col xs={24} lg={12}>
          <Form.Item name="total" label="Total">
            <Input disabled={action !== "add"} />
          </Form.Item>
        </Col>
        <Col xs={24} lg={12}>
          <Form.Item name="remaining" label="Remaining">
            <Input disabled={action !== "add"} />
          </Form.Item>
        </Col>
      </Row>

      <Form.Item>
        <Space>
          {action === "add" && (
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          )}
        </Space>
      </Form.Item>
    </Form>
  );
}

export default AnnualLeaveForm;
