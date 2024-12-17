import React, { useState, useEffect } from "react";
import { Modal, Table } from "antd";
import { useNavigate } from "react-router-dom";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { deleteDoc, getListDoc } from "../../api/commonApi";

function TableDivision({
  data,
  page,
  limit,
  handlePagination,
  loading,
  total,
  getLitDivision,
}) {
  const navigate = useNavigate();

  const [isVisible, setIsVisible] = useState(false);
  const [isDisableButton, setIsDisableButton] = useState(false);
  const [division, setDivision] = useState(null);
  const [users, setUsers] = useState([]);

  const handleActionDivision = (id, action) => {
    navigate(`/division/${action}/${id}`);
  };

  const handleDelete = async () => {
    try {
      await deleteDoc("division", division._id);
      getLitDivision();
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
  useEffect(() => {
    const payload = {
      page: 1,
      limit: 99999,
      search: ''
    };

    const fetchUsers = async () => {
      try {
        const fetchedUsers = await getListDoc("user", payload);
        setUsers(fetchedUsers?.data?.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
    },
    {
      title: "Leader",
      dataIndex: "leader",
      render: (props) => <>{props?.name}</>,
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      render: (_, record) => {
        // Lọc users có division khớp với id của division
        const userCount = users?.filter(user => user.division?._id === record?._id).length;
        return <>{userCount}</>;
      },
    },
    {
      title: "Action",
      render: (props) => (
        <div className="action-button-table">
          <EditOutlined
            className="edit-button-table"
            onClick={(e) => {
              e.stopPropagation();
              handleActionDivision(props._id, "edit");
            }}
          />

          <DeleteOutlined
            className="delete-button-table"
            onClick={(e) => {
              e.stopPropagation();
              setDivision(props);
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
        title="Xóa phòng ban"
        visible={isVisible}
        onOk={() => onSubmitDelete()}
        onCancel={() => onCancel()}
        okButtonProps={{ disabled: isDisableButton }}
      >
        <p>
          Bạn muốn xóa phòng ban: <strong>{division?.name}</strong>?
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
              handleActionDivision(data._id, "view");
            },
          };
        }}
      />
    </>
  );
}

export default TableDivision;
