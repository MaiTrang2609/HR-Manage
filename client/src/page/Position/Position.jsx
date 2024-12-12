import React from "react";
import useTitle from "../../hook/useTitle";
import PositionList from "../../components/Position/PositionList";
import PageHeader from "../../components/PageHeader";
function Position() {
  useTitle("Position");

  return (
    <>
      <PageHeader title="Add position" url="/position/add" />
      <PositionList />
    </>
  );
}

export default Position;
