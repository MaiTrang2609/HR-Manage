import React, { useState, useEffect } from "react";
import { Modal, Table, Switch } from "antd";
import { useNavigate } from "react-router-dom";
import {
  DeleteOutlined,
  EditOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import moment from "moment";
import { deleteDoc, updateDoc } from "../../api/commonApi";
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
  const [jobData, setJobData] = useState([]);

  useEffect(() => {
    if (data) {
      const updatedData = data.map((job) => ({
        ...job,
        status: isJobExpired(job.deadline)
          ? "expired"
          : job.status || "notExpired",
      }));
      setJobData(updatedData);
    }
  }, [data]);

  const isJobExpired = (deadline) => {
    return moment(deadline).isBefore(moment(), "day");
  };

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
    } catch (error) {
      console.error("Error deleting job:", error);
    }
  };

  const handleStatusChange = async (checked, record) => {
    const newStatus = checked ? "notExpired" : "expired";
    try {
      await updateDoc("job", record._id, { status: newStatus });
      const updatedData = jobData.map((item) =>
        item._id === record._id ? { ...item, status: newStatus } : item
      );
      setJobData(updatedData);
      getLitJob();
    } catch (error) {
      console.error("Error updating job status:", error);
    }
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
    const color = status === "expired" ? "rgb(220 68 68)" : "rgb(22 163 74)";
    return (
      <div
        className="status-job"
        style={{
          backgroundColor: color,
          textAlign: "center",
          borderRadius: "4px",
          color: "white",
          textTransform: "capitalize",
          fontWeight: "600",
          padding: "0.35rem 1rem",
          width: "100%",
        }}
      >
        {status === "expired" ? "Expired" : "Active"}
      </div>
    );
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
      title: "Status",
      dataIndex: "status",
      render: (text, record) => renderStatus(text),
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
        </div>
      ),
      width: "15%",
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
          Bạn muốn xóa công việc: <strong>{job?.title}</strong>?
        </p>
      </Modal>
      <Table
        columns={columns}
        dataSource={jobData}
        pagination={{ current: page, pageSize: limit, total }}
        loading={loading}
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
