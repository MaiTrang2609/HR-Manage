import React, { useState } from "react";
import { Modal, Table } from "antd";
import { useNavigate } from "react-router-dom";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { deleteDoc } from "../../api/commonApi";

function TableRoom({
  data,
  page,
  limit,
  handlePagination,
  loading,
  total,
  getListRoom,
}) {
  const navigate = useNavigate();

  const [isVisible, setIsVisible] = useState(false);
  const [isDisableButton, setIsDisableButton] = useState(false);
  const [room, setRoom] = useState(null);

  const handleActionRoom = (id, action) => {
    navigate(`/room/${action}/${id}`);
  };

  const handleDelete = async () => {
    try {
      await deleteDoc("room", room._id);
      getListRoom();
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
      title: "Color",
      dataIndex: "color",
      render: (props) => (
        <div
          style={{
            width: "1.6rem",
            backgroundColor: `${props}`,
            height: "1.6rem",
            borderRadius: "4px",
          }}
        ></div>
      ),
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
    },
    {
      title: "Action",
      render: (props) => (
        <div className="action-button-table">
          <EditOutlined
            className="edit-button-table"
            onClick={(e) => {
              e.stopPropagation();
              handleActionRoom(props._id, "edit");
            }}
          />

          <DeleteOutlined
            className="delete-button-table"
            onClick={(e) => {
              e.stopPropagation();
              setRoom(props);
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
        title="Xóa phòng họp"
        visible={isVisible}
        onOk={() => onSubmitDelete()}
        onCancel={() => onCancel()}
        okButtonProps={{ disabled: isDisableButton }}
      >
        <p>
          Bạn muốn xóa phòng họp: <strong>{room?.name}</strong>?
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
              handleActionRoom(data._id, "view");
            },
          };
        }}
      />
    </>
  );
}

export default TableRoom;
