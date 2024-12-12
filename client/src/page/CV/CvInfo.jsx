import React from "react";
import { useParams } from "react-router-dom";
import CvForm from "../../components/CV/CvForm";

function CvInfo() {
  const { action } = useParams();

  return (
    <div className="page-list">
      <div className="list_header">{action} CV</div>
      <CvForm />
    </div>
  );
}

export default CvInfo;
