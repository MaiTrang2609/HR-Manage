import React, { useState } from "react";
import { Modal, Table } from "antd";
import { useNavigate } from "react-router-dom";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { deleteDoc } from "../../api/commonApi";

function TableEmail({
  data,
  page,
  limit,
  handlePagination,
  loading,
  total,
  getListEmail,
}) {
  const navigate = useNavigate();

  const [isVisible, setIsVisible] = useState(false);
  const [isDisableButton, setIsDisableButton] = useState(false);
  const [email, setEmail] = useState(null);

  const handleActionEmail = (id, action) => {
    navigate(`/email/${action}/${id}`);
  };

  const handleDelete = async () => {
    try {
      await deleteDoc("email", email._id);
      getListEmail();
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

  const columns = [
    {
      title: "Name",
      dataIndex: "title",
    },

    {
      title: "Action",
      render: (props) => (
        <div className="action-button-table">
          <EditOutlined
            className="edit-button-table"
            onClick={(e) => {
              e.stopPropagation();
              handleActionEmail(props._id, "edit");
            }}
          />

          <DeleteOutlined
            className="delete-button-table"
            onClick={(e) => {
              e.stopPropagation();
              setEmail(props);
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
        title="Xóa email"
        visible={isVisible}
        onOk={() => onSubmitDelete()}
        onCancel={() => onCancel()}
        okButtonProps={{ disabled: isDisableButton }}
      >
        <p>
          Bạn muốn xóa email: <strong>{email?.title}</strong>?
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
              handleActionEmail(data._id, "view");
            },
          };
        }}
      />
    </>
  );
}

export default TableEmail;
