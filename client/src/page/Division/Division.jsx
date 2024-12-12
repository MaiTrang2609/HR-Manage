import React from "react";
import useTitle from "../../hook/useTitle";
import DivisionList from "../../components/Division/DivisionList";
import PageHeader from "../../components/PageHeader";

function Division() {
  useTitle("Division");

  return (
    <>
      <PageHeader title="Add division" url="/division/add" />
      <DivisionList />
    </>
  );
}

export default Division;
