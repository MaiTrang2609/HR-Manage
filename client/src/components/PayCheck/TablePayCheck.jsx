import React, { useState } from "react";
import { Modal, Table } from "antd";
import { useNavigate } from "react-router-dom";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { deleteDoc } from "../../api/commonApi";
import moment from "moment";
import { getUser } from "../../utils/auth";

function TablePayCheck({
  data,
  page,
  limit,
  handlePagination,
  loading,
  total,
  getListPayCheck,
}) {
  const navigate = useNavigate();

  const auth = getUser();

  const [isVisible, setIsVisible] = useState(false);
  const [isDisableButton, setIsDisableButton] = useState(false);
  const [payCheck, setPayCheck] = useState(null);

  const handleActionPayCheck = (id, action) => {
    ["admin"]?.includes(auth?.role)
      ? navigate(`/pay-check/${action}/${id}`)
      : navigate(`/my-pay-check/view/${id}`);
  };

  const onSubmitDelete = () => {
    setIsDisableButton(true);
    handleDelete();
  };
  const onCancel = () => {
    setIsVisible(false);
    setIsDisableButton(false);
  };

  const handleDelete = async () => {
    try {
      await deleteDoc("pay-check", payCheck?._id);
      getListPayCheck();
      onCancel();
    } catch (error) {}
  };

  const columns = [
    {
      title: "User",
      dataIndex: "user",
      render: (props) => <>{props?.name}</>,
    },
    {
      title: "Division",
      dataIndex: "user",
      render: (props) => <>{props?.division?.name}</>,
    },
    {
      title: "Gross",
      dataIndex: "gross",
    },
    {
      title: "Net",
      dataIndex: "net",
    },
    {
      title: "Day",
      dataIndex: "day",
      render: (text) => <>{moment(text).format("DD-MM-YYYY")}</>,
    },
    {
      title: "Action",
      render: (props) => (
        <div className="action-button-table">
          {["admin"]?.includes(auth?.role) && (
            <>
              <EditOutlined
                className="edit-button-table"
                onClick={(e) => {
                  e.stopPropagation();
                  handleActionPayCheck(props._id, "edit");
                }}
              />
              <DeleteOutlined
                className="delete-button-table"
                onClick={(e) => {
                  e.stopPropagation();
                  setPayCheck(props);
                  setIsVisible(true);
                }}
              />
            </>
          )}
        </div>
      ),
      width: "10%",
    },
  ];

  return (
    <>
      <Modal
        title="Xóa phiếu lương"
        visible={isVisible}
        onOk={() => onSubmitDelete()}
        onCancel={() => onCancel()}
        okButtonProps={{ disabled: isDisableButton }}
      >
        <p>
          Bạn muốn xóa phiếu lương: <strong>{payCheck?.user?.name}</strong>?
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
        onRow={(data) => {
          return {
            onClick: (e) => {
              handleActionPayCheck(data._id, "view");
            },
          };
        }}
      />
    </>
  );
}

export default TablePayCheck;
