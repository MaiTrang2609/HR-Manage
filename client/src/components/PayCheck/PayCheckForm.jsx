import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Button,
  Col,
  Form,
  DatePicker,
  Input,
  notification,
  Row,
  Select,
  Space,
} from "antd";
import locale from "antd/es/date-picker/locale/vi_VN";
import moment from "moment";
import { addDoc, getDoc, getListDoc, updateDoc } from "../../api/commonApi";
import Loading from "../Loading";
import { findDifferentProperties, isEmptyObject } from "../../utils/util";
import { getUser } from "../../utils/auth";

function PayCheckForm() {
  const [form] = Form.useForm();

  const auth = getUser();

  const isAction = ["admin"]?.includes(auth?.role);

  const { id, action } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  const [listUser, setListUser] = useState([]);

  const handleSubmit = (data) => {
    data.net = data.gross - data.tax - data.insurance;
    action === "add" ? handleAddPayCheck(data) : handleEditPayCheck(data);
  };

  const handleAddPayCheck = async (data) => {
    await addDoc("pay-check", data, navigate);
  };

  const handleEditPayCheck = async (dataUpdate) => {
    if (isEmptyObject(findDifferentProperties(data, dataUpdate))) {
      notification.success({ message: "Nothing change" });
      return;
    }

    await updateDoc("pay-check", id, dataUpdate);
    navigate("/pay-check");
  };

  const getInfo = async () => {
    setLoading(true);
    try {
      const result = await getDoc("pay-check", id);
      setData({
        ...result?.data?.data,
        day: moment(result?.data?.data?.day),
      });
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  const getLitUser = async () => {
    const result = await getListDoc("user");
    setListUser(result?.data?.data);
  };

  useEffect(() => {
    if (!id) return;
    getInfo();
  }, [id]);

  useEffect(() => {
    getLitUser();
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
      onFinish={handleSubmit}
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
            <Select disabled={action === "view" || !isAction}>
              {listUser
                ?.filter((item) => item.type !== "outsite")
                .map((item) => {
                  return (
                    <Select.Option key={item?._id} value={item?._id}>
                      {item.name}
                    </Select.Option>
                  );
                })}
            </Select>
          </Form.Item>
        </Col>

        <Col xs={24} lg={12}>
          <Form.Item name="day" label="Day">
            <DatePicker
              disabled={action === "view" || !isAction}
              format="DD-MM-YYYY"
              locale={locale}
              className="w-100"
            />
          </Form.Item>
        </Col>
        <Col xs={24} lg={12}>
          <Form.Item name="gross" label="Gross">
            <Input disabled={action === "view" || !isAction} />
          </Form.Item>
        </Col>
        <Col xs={24} lg={12}>
          <Form.Item name="insurance" label="Insurance">
            <Input disabled={action === "view" || !isAction} />
          </Form.Item>
        </Col>
        <Col xs={24} lg={12}>
          <Form.Item name="tax" label="Tax">
            <Input disabled={action === "view" || !isAction} />
          </Form.Item>
        </Col>
        {id && (
          <Col xs={24} lg={12}>
            <Form.Item name="net" label="Net">
              <Input disabled />
            </Form.Item>
          </Col>
        )}
      </Row>

      {isAction && (
        <Form.Item>
          <Space>
            {action !== "view" && (
              <Button type="primary" htmlType="submit">
                Submit
              </Button>
            )}
          </Space>

          {action === "view" && (
            <Button onClick={() => navigate(`/pay-check/edit/${id}`)}>
              Edit
            </Button>
          )}
        </Form.Item>
      )}
    </Form>
  );
}

export default PayCheckForm;
