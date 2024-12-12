import React, { useEffect, useState } from "react";
import moment from "moment";
import useTitle from "../hook/useTitle";
import Calendar from "../components/DashBoard/Calendar";
import { useSelector } from "react-redux";
import { getMyEvent } from "../api/calendar";

function DashBoard() {
  useTitle("DashBoard");
  const { room, date } = useSelector((state) => state.calendar);
  const [data, setData] = useState([]);
  const [dateFilter, setDateFilter] = useState([]);
  const [loading, setLoading] = useState(false);

  const getListEvent = async (_) => {
    setLoading(true);
    const payload = {
      room,
      date: date || new Date().getUTCMilliseconds(),
    };

    try {
      let result = await getMyEvent(payload);
      result = result?.data?.data;
      result.map((item) => {
        item.start = moment(item.timeStart).toDate();
        item.end = moment(item.timeEnd).toDate();
      });
      setData(result);
      setDateFilter(result);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  const handleSetEvent = () => {
    if (room?.length === 0) {
      setDateFilter(data);
      return;
    }
    const eventFilter = data.filter((item) => room?.includes(item.room));
    setDateFilter(eventFilter);
  };

  useEffect(() => {
    getListEvent();
  }, [date]);

  useEffect(() => {
    handleSetEvent();
  }, [room]);

  return (
    <div style={{ marginTop: "6rem" }}>
      <Calendar data={dateFilter} getListEvent={getListEvent} />
    </div>
  );
}

export default DashBoard;
