import React from "react";
import useTitle from "../../hook/useTitle";
import AnnualLeaveList from "../../components/AnnualLeave/AnnualLeaveList";
import PageHeader from "../../components/PageHeader";

function AnnualLeave() {
  useTitle("Annual Leave");

  return (
    <>
      <PageHeader title="Add annual leave" url="/annual-leave/add" />
      <AnnualLeaveList />
    </>
  );
}

export default AnnualLeave;
