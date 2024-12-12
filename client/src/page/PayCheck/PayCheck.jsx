import React from "react";
import PageHeader from "../../components/PageHeader";
import PayCheckList from "../../components/PayCheck/PayCheckList";
import useTitle from "../../hook/useTitle";
import { getUser } from "../../utils/auth";

function PayCheck() {
  useTitle("PayCheck");

  const auth = getUser();

  return (
    <>
      {["admin"]?.includes(auth?.role) && (
        <PageHeader title="Add paycheck " url="/pay-check/add" />
      )}
      <PayCheckList auth={auth} />
    </>
  );
}

export default PayCheck;
