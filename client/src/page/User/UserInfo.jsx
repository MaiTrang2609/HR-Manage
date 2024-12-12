import React from "react";
import { useParams } from "react-router-dom";
import UserForm from "../../components/User/UserForm";

function UserInfo() {
  const { action } = useParams();

  return (
    <div className="page-list">
      <div className="list_header">{action} user</div>
      <UserForm />
    </div>
  );
}

export default UserInfo;
