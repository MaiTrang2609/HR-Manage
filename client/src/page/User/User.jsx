import React from "react";
import useTitle from "../../hook/useTitle";
import UserList from "../../components/User/UserList";
import PageHeader from "../../components/PageHeader";
import { getUser } from "../../utils/auth";
function User() {
  useTitle("User");
  const auth = getUser();

  return (
    <>
      {["admin", "hr"]?.includes(auth?.role) && (
        <PageHeader title="Add user" url="/user/add" />
      )}
      <UserList />
    </>
  );
}

export default User;
