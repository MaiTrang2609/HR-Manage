import React from "react";
import { useParams } from "react-router-dom";
import DivisionForm from "../../components/Division/DivisionForm";

function DivisionInfo() {
  const { action } = useParams();

  return (
    <div className="page-list">
      <div className="list_header">{action} division</div>
      <DivisionForm />
    </div>
  );
}

export default DivisionInfo;
