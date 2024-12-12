import React, { useState } from "react";
import { Modal, Switch, Table } from "antd";
import { useNavigate } from "react-router-dom";
import {
  DeleteOutlined,
  DownloadOutlined,
  EditOutlined,
  FileOutlined,
} from "@ant-design/icons";
import { deleteDoc, updateDoc } from "../../api/commonApi";
import moment from "moment";
import { getUser } from "../../utils/auth";

function TableCv({
  data,
  page,
  limit,
  handlePagination,
  loading,
  total,
  getLitCv,
}) {
  const navigate = useNavigate();

  const role = getUser()?.role;

  const [isVisible, setIsVisible] = useState(false);
  const [isDisableButton, setIsDisableButton] = useState(false);
  const [cv, setCv] = useState(null);

  const handleDelete = async () => {
    try {
      await deleteDoc("cv", cv?._id);
      getLitCv();
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

  const handleUpdate = async (data) => {
    let status = data.status;
    switch (status) {
      case "pending":
        status = "viewed";
        break;
      case "passed":
        status = "failed";
        break;
      case "failed":
      case "viewed":
        status = "passed";
        break;
    }
    const dataUpdate = {
      status,
    };

    try {
      await updateDoc("cv", data?._id, dataUpdate);
      getLitCv();
    } catch (error) {}
  };

  const renderStatus = (status) => {
    let color;
    switch (status) {
      case "pending":
        color = "rgb(113 113 122)";
        break;
      case "viewed":
        color = "rgb(251 146 60)";
        break;
      case "passed":
        color = "rgb(22 163 74)";
        break;
      case "failed":
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
      title: "Name",
      dataIndex: "user",
      render: (props) => <>{props?.name}</>,
    },
    {
      title: "Email",
      dataIndex: "user",
      render: (props) => <>{props?.email}</>,
    },
    {
      title: "Phone",
      dataIndex: "user",
      render: (props) => <>{props?.phone}</>,
    },
    {
      title: "Job",
      dataIndex: "job",
      render: (props) => <>{props?.title}</>,
    },
    {
      title: "Deadline",
      dataIndex: "job",
      render: (props) => <>{moment(props?.deadline).format("DD-MM-YYYY")}</>,
    },
    {
      title: "Date of submission",
      dataIndex: "createdAt",
      render: (text) => <>{moment(text).format("DD-MM-YYYY")}</>,
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (text) => renderStatus(text),
      width: "5%",
    },
    {
      title: "Action",
      render: (props) => (
        <div className="action-button-table">
          {role !== "candidate" && (
            <>
              <Switch
                defaultChecked={props.status === "passed"}
                onChange={() => handleUpdate(props)}
                className="edit-button-table"
                size="small"
              />
              <DeleteOutlined
                className="delete-button-table mr-1"
                onClick={(e) => {
                  e.stopPropagation();
                  setCv(props);
                  setIsVisible(true);
                }}
              />
            </>
          )}

          <FileOutlined
            className="edit-button-table"
            style={{ marginRight: "0rem" }}
            onClick={(e) => {
              e.stopPropagation();
              window.open(props.url, "_blank");
              handleUpdate(props);
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
        title="Xóa cv"
        visible={isVisible}
        onOk={() => onSubmitDelete()}
        onCancel={() => onCancel()}
        okButtonProps={{ disabled: isDisableButton }}
      >
        <p>
          Bạn muốn xóa cv: <strong>{cv?.user?.name}</strong>?
        </p>
      </Modal>
      <Table
        columns={columns}
        dataSource={data}
        pagination={{ current: page, pageSize: limit, total }}
        loading={false}
        onChange={handlePagination}
        bordered
        scroll={{ x: "max-content" }}
      />
    </>
  );
}

export default TableCv;
