import React from "react";
import useTitle from "../../hook/useTitle";
import PageHeader from "../../components/PageHeader";
import CvList from "../../components/CV/CvList";

function CvManage() {
  useTitle("CV");

  return (
    <>
      {/* <PageHeader title="Add CV" url="/cv/add" /> */}
      <CvList />
    </>
  );
}

export default CvManage;
