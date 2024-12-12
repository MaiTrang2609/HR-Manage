import React, { useMemo } from "react";
import { useDispatch } from "react-redux";
import {
  Calendar as CalendarBig,
  momentLocalizer,
  Views,
} from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import moment from "moment";
import Header from "./Header";
import ModalEvent from "./ModalEvent";
import {
  HandleModal,
  SetDateCalendar,
  SetIdEvent,
} from "../../redux/calendarSlice";
const localizer = momentLocalizer(moment);

let allViews = Object.keys(Views).map((k) => Views[k]);

function Calendar({ data, getListEvent }) {
  const dispatch = useDispatch();

  const handleEdit = (item) => {
    dispatch(HandleModal("edit"));
    dispatch(SetIdEvent(item._id));
  };

  const handleAdd = (item) => {
    console.log(item);
    dispatch(HandleModal("add"));
  };

  const handleRangeChange = (range) => {
    let date;
    if (range.length === 1) {
      date = new Date(range[0]);
      dispatch(SetDateCalendar(date));
      return;
    }
    if (range.length > 2) {
      date = new Date(range[3]);
      dispatch(SetDateCalendar(date));
      return;
    }
    let { start, end } = range;
    start = new Date(start).getTime();
    end = new Date(end).getTime();
    date = new Date((start + end) / 2);
    dispatch(SetDateCalendar(date));
  };

  const onNavigate = (data) => {
    console.log(data);
  };

  const { components } = useMemo(
    () => ({
      components: {
        toolbar: Header,
      },
    }),
    []
  );

  return (
    <>
      <ModalEvent getListEvent={getListEvent} />
      <CalendarBig
        localizer={localizer}
        events={data || []}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 800 }}
        views={allViews}
        step={60}
        eventPropGetter={(event) => {
          const backgroundColor = event?.room?.color
            ? event?.room?.color
            : "black";
          const color = "white";
          return { style: { backgroundColor, color } };
        }}
        onSelectEvent={handleEdit}
        onSelectSlot={handleAdd}
        onRangeChange={handleRangeChange}
        onNavigate={onNavigate}
        selectable
        components={components}
      />
    </>
  );
}

export default Calendar;
