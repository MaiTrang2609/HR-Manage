import { callApi } from "./config";
import { notification } from "antd";
import queryString from "query-string";

const link = process.env.REACT_APP_API_LINK;

export const getMyEvent = async (payload) => {
  try {
    const url = `${link}/api/event/my-event?${queryString.stringify(payload)}`;
    const res = await callApi.get(url);
    return res;
  } catch (error) {
    notification.error({
      message: error?.response?.data?.message || "Có lỗi xảy ra",
    });
  }
};
