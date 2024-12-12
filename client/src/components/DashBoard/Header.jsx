import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Button, Select } from "antd";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import styled from "styled-components";
import { getListDoc } from "../../api/commonApi";
import {
  HandleModal,
  SetListRoom,
  SetViewCalendar,
} from "../../redux/calendarSlice";
import { getUser } from "../../utils/auth";

const Header = (props) => {
  const dispatch = useDispatch();

  const auth = getUser();

  const [listRoom, setListRoom] = useState([]);

  const getListRoom = async () => {
    const payload = {
      page: 1,
      limit: 1024,
      search: "",
    };
    try {
      const result = await getListDoc("room", payload);
      setListRoom(result?.data?.data);
    } catch (error) {}
  };

  useEffect(() => {
    getListRoom();
  }, []);

  const goToBack = () => {
    props.onNavigate("PREV");
  };

  const goToNext = () => {
    props.onNavigate("NEXT");
  };

  const goToCurrent = () => {
    props.onNavigate("TODAY");
  };

  const label = () => {
    const date = props.date;
    const view = props.view;
    let label = "";

    switch (view) {
      case "month":
      case "week":
      case "work_week":
        label =
          date.toLocaleString("default", { month: "long" }) +
          " - " +
          date.getFullYear();
        break;

      case "day":
        label = date.toLocaleString("vi-VN", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        });
        break;
      default:
        label = date.toDateString();
    }

    return label;
  };

  const handleChange = (value) => {
    dispatch(SetViewCalendar(value));
    props.onView(value);
  };

  return (
    <Wrapper>
      <div className="header_left">
        {!auth?.role ||
          (auth?.role !== "candidate" && (
            <Button
              type="primary"
              className="button_add"
              onClick={() => dispatch(HandleModal("add"))}
            >
              Add event
            </Button>
          ))}
        <Button className="button_today" onClick={goToCurrent}>
          Today
        </Button>

        <LeftOutlined className="button_back" onClick={goToBack} />
        <RightOutlined className="button_next" onClick={goToNext} />
      </div>
      <span className="rbc-toolbar-label">{label()}</span>

      {!auth?.role || auth?.role !== "candidate" ? (
        <div className="header_right">
          <Select
            mode="multiple"
            allowClear
            placeholder="Please select room"
            style={{ width: 280 }}
            onChange={(value) => dispatch(SetListRoom(value))}
            className="room-big"
          >
            {listRoom.map((item) => {
              return (
                <Select.Option key={item._id} value={item._id}>
                  {item.name}
                </Select.Option>
              );
            })}
          </Select>

          <Select
            value={props.view}
            style={{ width: 160 }}
            onChange={handleChange}
            options={[
              { value: "day", label: "Ngày" },
              { value: "week", label: "Tuần" },
              { value: "work_week", label: "Tuần làm việc" },
              { value: "month", label: "Tháng" },
            ]}
          />
        </div>
      ) : (
        <div />
      )}
    </Wrapper>
  );
};

export const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
  flex-wrap: wrap;

  .header_left,
  .header_right {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .header_right {
    gap: 2rem;
    font-weight: 600;
  }
  .rbc-toolbar-label {
    font-size: 1.6rem;
  }
  .button_today {
    font-weight: 600;
    margin-right: 2rem;
  }
  .button_add {
    font-weight: 600;
    margin-right: 1rem;
  }
  .button_next {
    margin-right: 2rem;
    margin-left: 1.25rem;
  }
  @media only screen and (max-width: 1200px) {
    .header_right {
      margin: 1rem 0rem 1rem 0rem;
    }
  }
`;

export default Header;
