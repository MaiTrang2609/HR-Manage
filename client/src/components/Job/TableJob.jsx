import React, { useState } from "react";
import { Modal, Table } from "antd";
import { useNavigate } from "react-router-dom";
import {
  DeleteOutlined,
  EditOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import moment from "moment";
import { deleteDoc } from "../../api/commonApi";
import { getUser } from "../../utils/auth";

function TableJob({
  data,
  page,
  limit,
  handlePagination,
  loading,
  total,
  getLitJob,
}) {
  const navigate = useNavigate();

  const role = getUser()?.role;

  const [isVisible, setIsVisible] = useState(false);
  const [isDisableButton, setIsDisableButton] = useState(false);
  const [job, setJob] = useState(null);

  const handleActionJob = (id, action) => {
    role === "candidate"
      ? navigate(`/job-candidate/${action}/${id}`)
      : navigate(`/job/${action}/${id}`);
  };

  const handleDelete = async () => {
    try {
      await deleteDoc("job", job?._id);
      getLitJob();
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
      title: "Title",
      dataIndex: "title",
    },
    {
      title: "Offer",
      dataIndex: "offer",
    },
    {
      title: "Experience",
      dataIndex: "experience",
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
    },
    {
      title: "Deadline",
      dataIndex: "deadline",
      render: (text) => <>{moment(text).format("DD-MM-YYYY")}</>,
    },
    {
      title: "Action",
      render: (props) => (
        <div className="action-button-table">
          {role !== "candidate" && (
            <>
              <EditOutlined
                className="edit-button-table"
                onClick={(e) => {
                  e.stopPropagation();
                  handleActionJob(props._id, "edit");
                }}
              />

              <DeleteOutlined
                className="delete-button-table mr-1"
                onClick={(e) => {
                  e.stopPropagation();
                  setJob(props);
                  setIsVisible(true);
                }}
              />
            </>
          )}
          <UploadOutlined
            onClick={(e) => {
              e.stopPropagation();
              role === "candidate"
                ? navigate(`/job-candidate/view/${props._id}`, {
                    state: { key: 2, title: props?.title },
                  })
                : navigate(`/job/view/${props._id}`, {
                    state: { key: 3, title: props?.title },
                  });
            }}
          />
          {/* <MenuOutlined
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/cv/${props._id}`);
            }}
          /> */}
        </div>
      ),
      width: "10%",
    },
  ];

  return (
    <>
      <Modal
        title="Xóa công việc"
        visible={isVisible}
        onOk={() => onSubmitDelete()}
        onCancel={() => onCancel()}
        okButtonProps={{ disabled: isDisableButton }}
      >
        <p>
          Bạn muốn xóa công việc: <strong>{job?.name}</strong>?
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
              handleActionJob(data._id, "view");
            },
          };
        }}
      />
    </>
  );
}

export default TableJob;
