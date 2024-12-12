import { createSlice } from "@reduxjs/toolkit";

const calendarSlice = createSlice({
  name: "calendar",
  initialState: {
    id: null,
    isOpenModal: false,
    action: null,
    listRoom: [],
    date: new Date(),
    view: "month",
  },
  reducers: {
    SetIdEvent: (state, action) => {
      return { ...state, id: action.payload };
    },
    SetTypeModal: (state, action) => {
      return { ...state, action: action.payload };
    },
    SetListRoom: (state, action) => {
      return { ...state, room: action.payload };
    },
    SetDateCalendar: (state, action) => {
      return { ...state, date: action.payload };
    },
    SetViewCalendar: (state, action) => {
      return { ...state, view: action.payload };
    },
    HandleModal: (state, action) => {
      return {
        ...state,
        isOpenModal: !state.isOpenModal,
        action: action.payload,
      };
    },
  },
});

export const {
  SetIdEvent,
  SetTypeModal,
  SetListRoom,
  SetDateCalendar,
  SetViewCalendar,
  HandleModal,
} = calendarSlice.actions;

export default calendarSlice.reducer;
