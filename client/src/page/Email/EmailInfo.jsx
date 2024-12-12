import React from "react";
import { useParams } from "react-router-dom";
import EmailForm from "../../components/Email/EmailForm";

function EmailInfo() {
  const { action } = useParams();

  return (
    <div className="page-list">
      <div className="list_header">{action} email</div>
      <EmailForm />
    </div>
  );
}

export default EmailInfo;
