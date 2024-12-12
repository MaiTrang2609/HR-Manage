import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import moment from "moment";
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
} from "antd";
import TextArea from "antd/es/input/TextArea";
import locale from "antd/es/date-picker/locale/vi_VN";
import Loading from "../Loading";
import {
  findDifferentProperties,
  isEmptyObject,
  setRangeDate,
} from "../../utils/util";
import { typeCalendar } from "../../utils/contain";
import {
  addDoc,
  deleteDoc,
  getDoc,
  getListDoc,
  updateDoc,
} from "../../api/commonApi";
import { HandleModal, SetIdEvent } from "../../redux/calendarSlice";
import {
  pencil,
  userPlus,
  userConfig,
  clock,
  repeat,
  location,
  desc,
  arrowRight,
} from "../../assets/icon";
import { getUser } from "../../utils/auth";

function ModalEvent({ getListEvent }) {
  const dispatch = useDispatch();
  const { id, isOpenModal, action } = useSelector((state) => state.calendar);
  const user = getUser();
  const [form] = Form.useForm();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [listRoom, setListRoom] = useState([]);
  const [periodTime, setPeriodTime] = useState("60m");
  const [type, setType] = useState("add");

  const [listUserRequired, setListUserRequired] = useState([]);
  const [listUserOptional, setListUserOptional] = useState([]);
  const [listUser, setListUser] = useState([]);

  const handleSubmit = () => {
    const data = form.getFieldsValue();
    action === "add" ? handleAddEvent(data) : handleEditEvent(data);
    closeModal();
    form.resetFields();
    getListEvent();
  };

  const closeModal = () => {
    dispatch(HandleModal());
    dispatch(SetIdEvent(null));
    setData(null);
    form.resetFields();
  };

  const handleDeleteEvent = async () => {
    await deleteDoc("event", id);
    closeModal();
    getListEvent();
  };

  const handleAddEvent = async (data) => {
    await addDoc("event", data);
  };

  const handleEditEvent = async (dataUpdate) => {
    if (isEmptyObject(findDifferentProperties(data, dataUpdate))) {
      notification.success({ message: "Nothing change" });
      return;
    }
    await updateDoc("event", id, dataUpdate);
  };

  const getInfoTimeOff = async () => {
    setLoading(true);
    try {
      let result = await getDoc("event", id);
      result = result?.data?.data;
      setData({
        ...result,
        timeStart: moment(result?.timeStart, "YYYY-MM-DD HH:mm"),
        timeEnd: moment(result?.timeEnd, "YYYY-MM-DD HH:mm"),
      });
      form.setFieldsValue({
        timeStart: moment(result?.timeStart, "YYYY-MM-DD HH:mm"),
        timeEnd: moment(result?.timeEnd, "YYYY-MM-DD HH:mm"),
      });

      setPeriodTime(setRangeDate(result?.timeStart, result?.timeEnd));

      handleTypeEvent(result?.host);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  const handleTypeEvent = (host) => {
    const typeEvent =
      action === "add" ? "add" : host === user?._id ? "edit" : "view";
    setType(typeEvent);
  };

  useEffect(() => {
    setData(null);
    form.resetFields();
    if (!id) {
      setType("add");
      form.setFieldsValue({
        timeStart: moment(),
        timeEnd: moment().add(1, "hours"),
      });
      return;
    }
    getInfoTimeOff();
  }, [id, isOpenModal]);

  const getListUser = async () => {
    let result = await getListDoc("user");
    result = result?.data?.data;
    setListUser(result);
    setListUserRequired(result);
    setListUserOptional(result);
  };

  const handleChangeUserRequired = () => {
    const selectedOptions = listUser.filter(
      (item) => !form.getFieldsValue().usersRequired.includes(item._id)
    );
    setListUserOptional(selectedOptions);
  };

  const handleChangeUserOptional = () => {
    const selectedRequired = listUser.filter(
      (item) => !form.getFieldsValue().usersOptional.includes(item._id)
    );
    setListUserRequired(selectedRequired);
  };

  const handleChangeDate = () => {
    setPeriodTime(
      setRangeDate(
        form.getFieldsValue()?.timeStart,
        form.getFieldsValue()?.timeEnd
      )
    );
  };

  const getListRoom = async () => {
    let result = await getListDoc("room");
    result = result?.data?.data;
    setListRoom(result);
  };

  useEffect(() => {
    getListUser();
    getListRoom();
  }, []);

  const footer = () => {
    return (
      <div className="flex flex-end">
        {type !== "view" ? (
          <div className="flex gap-1">
            {id ? (
              <Button onClick={handleDeleteEvent}>Delete</Button>
            ) : (
              <Button onClick={closeModal}>Cancel</Button>
            )}
            <Button key="submit" type="primary" onClick={handleSubmit}>
              OK
            </Button>
          </div>
        ) : (
          <></>
        )}
      </div>
    );
  };

  return (
    isOpenModal && (
      <Modal
        title={
          type === "add"
            ? "Add event"
            : type === "edit"
            ? "Edit event"
            : "Detail event"
        }
        open={isOpenModal}
        onOk={handleSubmit}
        onCancel={closeModal}
        width={900}
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
              <Col span={24} className="flex align-center gap-16">
                <div className="mb-24">{pencil}</div>
                <Form.Item
                  name="title"
                  rules={[
                    {
                      required: true,
                    },
                  ]}
                  className="w-100"
                >
                  <Input
                    disabled={type === "view"}
                    placeholder="Thêm tiêu đè"
                  />
                </Form.Item>
              </Col>
              <Col span={24} className="flex align-center gap-16">
                <div className="mb-24">{userPlus}</div>
                <Form.Item
                  name="usersRequired"
                  rules={[
                    {
                      required: true,
                    },
                  ]}
                  className="w-100"
                >
                  <Select
                    mode="multiple"
                    allowClear
                    disabled={type === "view"}
                    placeholder="Thêm người dự bắt buộc"
                    onChange={() => handleChangeUserRequired()}
                  >
                    {listUserRequired.map((item) => {
                      return (
                        <Select.Option key={item._id} value={item._id}>
                          {item.name}
                        </Select.Option>
                      );
                    })}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={24} className="flex align-center gap-16">
                <div className="mb-24">{userConfig}</div>
                <Form.Item name="usersOptional" className="w-100">
                  <Select
                    mode="multiple"
                    allowClear
                    disabled={type === "view"}
                    placeholder="Thêm người dự tùy chọn"
                    onChange={() => handleChangeUserOptional()}
                  >
                    {listUserOptional.map((item) => {
                      return (
                        <Select.Option key={item._id} value={item._id}>
                          {item.name}
                        </Select.Option>
                      );
                    })}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={24} className="flex align-center gap-16">
                <div className="mb-24">{clock}</div>
                <div className="flex align-center" style={{ gap: "1.5rem" }}>
                  <Form.Item
                    name="timeStart"
                    rules={[
                      {
                        required: true,
                      },
                    ]}
                  >
                    <DatePicker
                      disabled={type === "view"}
                      format="YYYY-MM-DD HH:mm"
                      locale={locale}
                      showTime
                      className="w-100"
                      placement="bottomRight"
                      allowClear={true}
                      onChange={() => handleChangeDate()}
                    />
                  </Form.Item>

                  {arrowRight}

                  <Form.Item
                    name="timeEnd"
                    rules={[
                      {
                        required: true,
                      },
                    ]}
                  >
                    <DatePicker
                      disabled={type === "view"}
                      format="YYYY-MM-DD HH:mm"
                      locale={locale}
                      showTime
                      className="w-100"
                      placement="bottomRight"
                      allowClear={true}
                      onChange={() => handleChangeDate()}
                    />
                  </Form.Item>

                  <div className="d-flex-center">
                    <div
                      style={{
                        marginBottom: "1.5rem",
                        marginLeft: "1rem",
                      }}
                    >
                      {periodTime}
                    </div>

                    {/* <Form.Item
                      name="allDay"
                      rules={[
                        {
                          required: true,
                        },
                      ]}
                    >
                      <Switch
                        defaultChecked
                        disabled={type === "view"}
                        className="w-100"
                      />
                    </Form.Item> */}
                    {/* <div
                      style={{
                        marginBottom: "24px",
                        // fontWeight: "600",
                        marginLeft: "8px",
                      }}
                    >
                      All day
                    </div> */}
                  </div>
                </div>
              </Col>

              <Col span={24} className="flex align-center gap-16">
                <div className="mb-24">{location}</div>

                <Form.Item name="room" className="w-100">
                  <Select
                    allowClear
                    disabled={type === "view"}
                    placeholder="Thêm phòng"
                  >
                    {listRoom.map((item) => {
                      return (
                        <Select.Option key={item._id} value={item._id}>
                          {item.name}
                        </Select.Option>
                      );
                    })}
                  </Select>
                </Form.Item>
              </Col>

              <Col span={24} className="flex align-center gap-16">
                <div className="mb-24">{repeat}</div>

                <Form.Item name="type" className="w-100">
                  <Select defaultValue="1" disabled={type === "view"}>
                    {typeCalendar.map((item) => {
                      return (
                        <Select.Option key={item.id} value={item.value}>
                          {item.label}
                        </Select.Option>
                      );
                    })}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={24} className="flex gap-16">
                <div className="mb-24">{desc}</div>
                <Form.Item name="desc" className="w-100">
                  <TextArea
                    rows={6}
                    disabled={type === "view"}
                    placeholder="Thêm chi tiết cuộc họp"
                  />
                </Form.Item>
              </Col>
            </Row>
          </Form>
        )}
      </Modal>
    )
  );
}

export default ModalEvent;
