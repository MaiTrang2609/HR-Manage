import React from "react";
import { Table } from "antd";
import { useNavigate } from "react-router-dom";
import { EditOutlined } from "@ant-design/icons";

function TableUser({
  data,
  page,
  limit,
  handlePagination,
  loading,
  total,
  getListPosition,
}) {
  const navigate = useNavigate();

  const handleActionPosition = (id, action) => {
    navigate(`/position/${action}/${id}`);
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
    },
    {
      title: "Title",
      dataIndex: "title",
    },
    {
      title: "Role",
      dataIndex: "role",
    },
    {
      title: "Desc",
      dataIndex: "desc",
    },

    {
      title: "Action",
      render: (props) => (
        <div className="action-button-table">
          <EditOutlined
            className="edit-button-table"
            onClick={(e) => {
              e.stopPropagation();
              handleActionPosition(props._id, "edit");
            }}
          />
        </div>
      ),
      width: "5%",
    },
  ];
  return (
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
            handleActionPosition(data._id, "view");
          },
        };
      }}
    />
  );
}

export default TableUser;
