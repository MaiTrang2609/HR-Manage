import React from "react";
import useTitle from "../../hook/useTitle";
import PageHeader from "../../components/PageHeader";
import EmailList from "../../components/Email/EmailList";

function Email() {
  useTitle("Email");

  return (
    <>
      <PageHeader title="Add Email" url="/email/add" />
      <EmailList />
    </>
  );
}

export default Email;
