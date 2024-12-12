import React, { useState } from "react";
import { Modal, Table } from "antd";
import { useNavigate } from "react-router-dom";
import { DeleteOutlined, EditOutlined, MenuOutlined } from "@ant-design/icons";
import { deleteDoc } from "../../api/commonApi";

function TableAnnualLeave({
  data,
  page,
  limit,
  handlePagination,
  loading,
  total,
  getLitAnnualLeave,
}) {
  const navigate = useNavigate();

  const [isVisible, setIsVisible] = useState(false);
  const [isDisableButton, setIsDisableButton] = useState(false);
  const [annualLeave, setAnnualLeave] = useState(null);

  const handleAction = (id, action) => {
    navigate(`/annual-leave/${action}/${id}`);
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
      await deleteDoc("annual-leave", annualLeave?._id);
      getLitAnnualLeave();
      onCancel();
    } catch (error) {}
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "user",
      render: (props) => <>{props?.name}</>,
    },
    {
      title: "Nick name",
      dataIndex: "user",
      render: (props) => <>{props?.nickName}</>,
    },
    {
      title: "Division",
      dataIndex: "user",
      render: (props) => <>{props?.division?.name}</>,
    },
    {
      title: "Remaining",
      dataIndex: "remaining",
      render: (props) => <>{props?.toFixed(2)}</>,
    },
    {
      title: "Total",
      dataIndex: "total",
    },
    {
      title: "Action",
      render: (props) => (
        <div className="action-button-table">
          <EditOutlined
            className="edit-button-table"
            onClick={(e) => {
              e.stopPropagation();
              handleAction(props?.user?._id, "edit");
            }}
          />

          <DeleteOutlined
            className="delete-button-table"
            onClick={(e) => {
              e.stopPropagation();
              setAnnualLeave(props);
              setIsVisible(true);
            }}
          />
        </div>
      ),
      width: "10%",
    },
  ];

  return (
    <>
      <Modal
        title="Xóa bảng thông tin nghỉ"
        visible={isVisible}
        onOk={() => onSubmitDelete()}
        onCancel={() => onCancel()}
        okButtonProps={{ disabled: isDisableButton }}
      >
        <p>
          Bạn muốn xóa bảng thông tin nghỉ:{" "}
          <strong>{annualLeave?.user?.name}</strong>?
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
              handleAction(data?.user?._id, "view");
            },
          };
        }}
      />
    </>
  );
}

export default TableAnnualLeave;
