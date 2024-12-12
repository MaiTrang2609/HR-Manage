import React from "react";
import { useParams } from "react-router-dom";
import PositionForm from "../../components/Position/PositionForm";

function PositionInfo() {
  const { action } = useParams();

  return (
    <div className="page-list">
      <div className="list_header">{action} position</div>
      <PositionForm />
    </div>
  );
}

export default PositionInfo;
