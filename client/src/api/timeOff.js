import { callApi } from "./config";
import { notification } from "antd";

const link = process.env.REACT_APP_API_LINK;

export const getAnnualLeaveOfUser = async (id) => {
  try {
    const url = `${link}/api/annual-leave/user/${id}`;
    const res = await callApi.get(url);
    return res;
  } catch (error) {
    notification.error({
      message: error?.response?.data?.message || "Có lỗi xảy ra",
    });
  }
};

export const getListTimeOffUser = async (id) => {
  try {
    const url = `${link}/api/time-off/user/${id}`;
    const res = await callApi.get(url);
    return res;
  } catch (error) {
    notification.error({
      message: error?.response?.data?.message || "Có lỗi xảy ra",
    });
  }
};

export const getListTimeOffRequest = async () => {
  try {
    const url = `${link}/api/time-off/division/request`;
    const res = await callApi.get(url);
    return res;
  } catch (error) {
    notification.error({
      message: error?.response?.data?.message || "Có lỗi xảy ra",
    });
  }
};
