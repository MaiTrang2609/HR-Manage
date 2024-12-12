import React, { useState } from "react";
import { Modal, Table } from "antd";
import { useNavigate } from "react-router-dom";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { getUser } from "../../utils/auth";
import { deleteDoc } from "../../api/commonApi";

function TableUser({
  data,
  page,
  limit,
  handlePagination,
  loading,
  total,
  getLitUser,
}) {
  const navigate = useNavigate();

  const auth = getUser();

  const [isVisible, setIsVisible] = useState(false);
  const [isDisableButton, setIsDisableButton] = useState(false);
  const [user, setUser] = useState(null);

  const handleActionUser = (id, action) => {
    navigate(`/user/${action}/${id}`);
  };

  const handleDelete = async () => {
    try {
      await deleteDoc("user", user._id);
      getLitUser();
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
      dataIndex: "name",
    },
    {
      title: "Nick name",
      dataIndex: "nickName",
    },
    {
      title: "Division",
      dataIndex: "division",
      render: (props) => <>{props?.name}</>,
    },
    {
      title: "Email",
      dataIndex: "email",
    },
    {
      title: "Phone",
      dataIndex: "phone",
    },
    {
      title: "Position",
      dataIndex: "position",
      render: (props) => <>{props?.title}</>,
    },
    {
      title: "Action",
      render: (props) => (
        <div className="action-button-table">
          <EditOutlined
            className="edit-button-table"
            onClick={(e) => {
              e.stopPropagation();
              handleActionUser(props._id, "edit");
            }}
          />
          {auth._id !== props._id && (
            <DeleteOutlined
              className="delete-button-table"
              onClick={(e) => {
                e.stopPropagation();
                setUser(props);
                setIsVisible(true);
              }}
            />
          )}
        </div>
      ),
      width: "5%",
    },
  ];
  return (
    <>
      <Modal
        title="Xóa người dùng"
        visible={isVisible}
        onOk={() => onSubmitDelete()}
        onCancel={() => onCancel()}
        okButtonProps={{ disabled: isDisableButton }}
      >
        <p>
          Bạn muốn xóa người dùng: <strong>{user?.name}</strong>?
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
              handleActionUser(data._id, "view");
            },
          };
        }}
      />
    </>
  );
}

export default TableUser;
