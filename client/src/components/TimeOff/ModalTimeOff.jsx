import React, { useEffect, useState } from "react";
import {
  Button,
  Col,
  DatePicker,
  Form,
  Input,
  Modal,
  notification,
  Row,
  Select,
  TimePicker,
} from "antd";
import TextArea from "antd/es/input/TextArea";
import locale from "antd/es/date-picker/locale/vi_VN";
import { addDoc, getDoc, getListDoc, updateDoc } from "../../api/commonApi";
import Loading from "../Loading";
import { findDifferentProperties, isEmptyObject } from "../../utils/util";
import { getUser } from "../../utils/auth";

import moment from "moment";

function ModalTimeOff({
  id,
  action,
  isModalOpen,
  handleModal,
  getListTimeOff,
}) {
  const [form] = Form.useForm();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [listUserRequest, setListUserRequest] = useState([]);
  const [listUserAccept, setListUserAccept] = useState([]);
  const [listUser, setListUser] = useState([]);

  const [idRequest, setIdRequest] = useState(null);

  const auth = getUser();

  const handleSubmit = () => {
    const data = form.getFieldsValue();

    if (!["admin"].includes(auth?.role)) {
      data.userRequest = auth?._id;
    }

    action === "add" ? handleAddTimeOff(data) : handleEditTimeOff(data);
    handleModal();
    getListTimeOff();
  };

  const handleAddTimeOff = async (data) => {
    await addDoc("time-off", data);
  };

  const handleEditTimeOff = async (dataUpdate) => {
    if (isEmptyObject(findDifferentProperties(data, dataUpdate))) {
      notification.success({ message: "Nothing change" });
      return;
    }

    await updateDoc("time-off", id, dataUpdate);
  };

  const handeChangeRequest = (type) => {
    const dataUpdate = {
      status: type,
      userRequest: data?.userRequest,
      timeStart: new Date(data?.timeStart?._i),
      timeEnd: new Date(data?.timeEnd?._i),
    };

    handleEditTimeOff(dataUpdate);
    handleModal();
    getInfoTimeOff();
  };

  const getInfoTimeOff = async () => {
    setLoading(true);
    try {
      const result = await getDoc("time-off", id);

      setData({
        ...result?.data?.data,
        day: moment(result?.data?.data?.day),
        timeStart: moment(result?.data?.data?.timeStart),
        timeEnd: moment(result?.data?.data?.timeEnd),
      });
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (!id) return;
    getInfoTimeOff();
  }, [id]);

  const getLitUser = async () => {
    const result = await getListDoc("user");
    setListUserRequest(result?.data?.data);
    setListUserAccept(result?.data?.data);
    setListUser(result?.data?.data);
  };

  const handleListUserAccept = async (idUser) => {
    let user = await getDoc("user", idUser);
    user = user?.data?.data;
    const userAccept = listUser?.filter((item) => {
      return (
        (item.division?._id === user?.division &&
          item.position?.title === "DM") ||
        item.position?.title === "Admin"
      );
    });
    setListUserAccept(userAccept);
  };

  useEffect(() => {
    getLitUser();
  }, []);

  useEffect(() => {
    if (!["admin"].includes(auth?.role)) {
      setIdRequest(auth?._id);
      form.setFieldValue("userRequest", auth?.name);
      listUser && handleListUserAccept(auth?._id);
    }
  }, [listUser]);

  const footer = () => {
    return (
      <>
        {id && ["accept", "reject"].includes(data?.status) ? (
          <></>
        ) : (
          <div className="flex justify-between">
            {["dm", "admin"].includes(auth?.role) && id ? (
              <div className="flex gap-1">
                <Button
                  key="submit"
                  type="primary"
                  onClick={() => handeChangeRequest("accept")}
                >
                  Accept
                </Button>
                <Button key="back" onClick={() => handeChangeRequest("reject")}>
                  Reject
                </Button>
              </div>
            ) : (
              <div className="flex gap-1" />
            )}
            <div className="flex gap-1">
              <Button onClick={handleModal}>Cancel</Button>
              <Button key="submit" type="primary" onClick={handleSubmit}>
                OK
              </Button>
            </div>
          </div>
        )}
      </>
    );
  };

  return (
    <Modal
      title={action === "add" ? "Add timeoff" : "Edit timeoff"}
      open={isModalOpen}
      onOk={handleSubmit}
      onCancel={handleModal}
      width={800}
      footer={footer}
    >
      {loading ? (
        <Loading />
      ) : (
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
                name="day"
                label="Day"
                rules={[
                  {
                    required: true,
                  },
                ]}
              >
                <DatePicker
                  disabled={action === "view"}
                  format="DD-MM-YYYY"
                  locale={locale}
                  className="w-100"
                  placement="bottomRight"
                />
              </Form.Item>
            </Col>
            <Col xs={24} lg={12}>
              <Form.Item
                name="timeStart"
                label="Time Start"
                rules={[
                  {
                    required: true,
                  },
                ]}
              >
                <TimePicker
                  format="HH:mm"
                  disabled={action === "view"}
                  className="w-100"
                />
              </Form.Item>
            </Col>
            <Col xs={24} lg={12}>
              <Form.Item
                name="timeEnd"
                label="Time End"
                rules={[
                  {
                    required: true,
                  },
                ]}
              >
                <TimePicker
                  format="HH:mm"
                  disabled={action === "view"}
                  className="w-100"
                />
              </Form.Item>
            </Col>

            <Col xs={24} lg={12}>
              <Form.Item
                label="People request"
                name="userRequest"
                rules={[
                  {
                    required: true,
                  },
                ]}
              >
                <Select
                  disabled={action !== "add" || !["admin"].includes(auth?.role)}
                  onChange={(data) => {
                    handleListUserAccept(data);
                    setIdRequest(data);
                  }}
                >
                  {listUserRequest
                    .filter((item) => item.type !== "outsite")
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
            <Col xs={24} lg={12}>
              <Form.Item
                label="People accept"
                name="userAccept"
                rules={[
                  {
                    required: true,
                  },
                ]}
              >
                <Select disabled={!idRequest}>
                  {listUserAccept.map((item) => {
                    return (
                      <Select.Option key={item._id} value={item._id}>
                        {item.name}
                      </Select.Option>
                    );
                  })}
                </Select>
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item name="desc" label="Desc">
                <TextArea rows={4} disabled={action === "view"} />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      )}
    </Modal>
  );
}

export default ModalTimeOff;
