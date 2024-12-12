import React, { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { Tabs } from "antd";
import JobForm from "../../components/Job/JobForm";
import CvList from "../../components/CV/CvList";
import CvUpload from "../CV/CvUpload";
import { getUser } from "../../utils/auth";

function JobInfo() {
  const { state } = useLocation();
  const { action } = useParams();

  const [key, setKey] = useState(null);
  const role = getUser()?.role;

  const items = [
    {
      key: "1",
      label: "Info of Job",
      children: <JobForm />,
    },
    {
      key: "2",
      label: "Cv of Job",
      children: <CvList />,
    },
    {
      key: "3",
      label: "Upload CV",
      children: <CvUpload title={state?.title} />,
    },
  ];

  const itemCandidates = [
    {
      key: "1",
      label: "Info of Job",
      children: <JobForm />,
    },
    {
      key: "2",
      label: "Upload CV",
      children: <CvUpload title={state?.title} />,
    },
  ];

  useEffect(() => {
    setKey(state?.key + "" || "1");
  }, [state]);

  if (!key) {
    return <></>;
  }

  return (
    <div className="page-list">
      <div className="list_header">{action} job</div>
      {action === "add" ? (
        <JobForm />
      ) : (
        <Tabs
          defaultActiveKey={key}
          items={role === "candidate" ? itemCandidates : items}
          size="large"
          onChange={(value) => setKey(value)}
        />
      )}
    </div>
  );
}

export default JobInfo;
