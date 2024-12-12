import React from "react";
import { useParams } from "react-router-dom";
import { Tabs } from "antd";
import AnnualLeaveForm from "../../components/AnnualLeave/AnnualLeaveForm";
import TimeOffList from "../../components/TimeOff/TimeOffList";

function AnnualLeaveInfo() {
  const { action } = useParams();

  const items = [
    {
      key: "1",
      label: "Info of Annual leave",
      children: <AnnualLeaveForm />,
    },
    {
      key: "2",
      label: "List Timeoff",
      children: <TimeOffList />,
    },
  ];

  return (
    <div className="page-list">
      <div className="list_header">{action} annual leave</div>

      {action === "add" ? (
        <AnnualLeaveForm />
      ) : (
        <Tabs defaultActiveKey="1" items={items} size="large" />
      )}
    </div>
  );
}

export default AnnualLeaveInfo;
