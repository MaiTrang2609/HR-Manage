import React from "react";
import useTitle from "../../hook/useTitle";
import PageHeader from "../../components/PageHeader";
import JobList from "../../components/Job/JobList";

function Job() {
  useTitle("Job");

  return (
    <>
      <PageHeader title="Add job" url="/job/add" />
      <JobList />
    </>
  );
}

export default Job;
