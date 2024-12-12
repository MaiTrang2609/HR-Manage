import React from "react";
import { useParams } from "react-router-dom";
import PayCheckForm from "../../components/PayCheck/PayCheckForm";

function PayCheckInfo() {
  const { action } = useParams();

  return (
    <div className="page-list">
      <div className="list_header">{action} paycheck</div>
      <PayCheckForm />
    </div>
  );
}

export default PayCheckInfo;
