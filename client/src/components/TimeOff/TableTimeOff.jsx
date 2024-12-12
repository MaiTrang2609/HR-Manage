import React, { useState } from "react";
import { Modal, Table } from "antd";
import moment from "moment";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { deleteDoc } from "../../api/commonApi";

function TableTimeOff({
  data,
  page,
  limit,
  handlePagination,
  loading,
  total,
  getListTimeOff,
  handleModal,
}) {
  const [isVisible, setIsVisible] = useState(false);
  const [isDisableButton, setIsDisableButton] = useState(false);
  const [timeOff, setTimeOff] = useState(null);

  const handleDelete = async () => {
    try {
      await deleteDoc("time-off", timeOff?._id);
      getListTimeOff();
      onCancel();
    } catch (error) {}
  };

  const onSubmitDelete = () => {
    setIsDisableButton(true);
    handleDelete();
  };
  const onCancel = () => {
    setIsVisible(false);
    setIsDisableButton(false);
  };

  const renderStatus = (status) => {
    let color;
    switch (status) {
      case "pending":
        color = "rgb(251 146 60)";
        break;
      case "accept":
        color = "rgb(22 163 74)";
        break;
      case "reject":
        color = "rgb(220 68 68)";
        break;
    }

    return (
      <div className="status-cv" style={{ backgroundColor: color }}>
        {status}
      </div>
    );
  };

  const columns = [
    {
      title: "Title",
      dataIndex: "title",
    },
    {
      title: "Day",
      dataIndex: "day",
      render: (text) => moment(text).format("DD-MM-YYYY"),
      width: "15%",
    },
    {
      title: "Time",
      dataIndex: "",
      render: (props) =>
        moment(props?.timeStart).format("HH:mm:ss") +
        "  -  " +
        moment(props?.timeEnd).format("HH:mm:ss"),
      width: "15%",
    },
    {
      title: "People Accept",
      dataIndex: "userAccept",
      render: (props) => <>{props?.name}</>,
      width: "20%",
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (text) => renderStatus(text),
      width: "8%",
    },
    {
      title: "Action",
      render: (props) => (
        <div className="action-button-table">
          <EditOutlined
            className="edit-button-table"
            onClick={(e) => {
              e.stopPropagation();
              handleModal("edit", props._id);
            }}
          />

          <DeleteOutlined
            className="delete-button-table"
            onClick={(e) => {
              e.stopPropagation();
              setTimeOff(props);
              setIsVisible(true);
            }}
          />
        </div>
      ),
      width: "5%",
    },
  ];
  return (
    <>
      <Modal
        title="Xóa phiếu nghỉ"
        visible={isVisible}
        onOk={() => onSubmitDelete()}
        onCancel={() => onCancel()}
        okButtonProps={{ disabled: isDisableButton }}
      >
        <p>
          Bạn muốn xóa phiểu nghỉ: <strong>{timeOff?.title}</strong>?
        </p>
      </Modal>
      <Table
        columns={columns}
        dataSource={data}
        pagination={{ current: page, pageSize: limit, total }}
        // loading={loading}
        loading={false}
        onChange={handlePagination}
        bordered
        scroll={{ x: "max-content" }}
        onRow={(data) => {
          return {
            onClick: (e) => {
              handleModal("edit", data._id);
            },
          };
        }}
      />
    </>
  );
}

export default TableTimeOff;
