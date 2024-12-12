import React from "react";
import useTitle from "../../hook/useTitle";
import RoomList from "../../components/Room/RoomList";
import PageHeader from "../../components/PageHeader";

function Room() {
  useTitle("Room");

  return (
    <>
      <PageHeader title="Add room" url="/room/add" />
      <RoomList />
    </>
  );
}

export default Room;
