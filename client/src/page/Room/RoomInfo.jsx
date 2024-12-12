import React from "react";
import { useParams } from "react-router-dom";
import RoomForm from "../../components/Room/RoomForm";

function RoomInfo() {
  const { action } = useParams();

  return (
    <div className="page-list">
      <div className="list_header">{action} room</div>
      <RoomForm />
    </div>
  );
}

export default RoomInfo;
