import { callApi } from "./config";
import { notification } from "antd";

const link = process.env.REACT_APP_API_LINK;

export const getListUserByDivision = async () => {
  try {
    const url = `${link}/api/user/division/${"dm"}`;
    const res = await callApi.get(url);
    return res;
  } catch (error) {
    notification.error({
      message: error?.response?.data?.message || "Có lỗi xảy ra",
    });
  }
};

export const getListUserOfAnnualLeave = async (id) => {
  try {
    const url = `${link}/api/user/annual-leave`;
    const res = await callApi.get(url);
    return res;
  } catch (error) {
    notification.error({
      message: error?.response?.data?.message || "Có lỗi xảy ra",
    });
  }
};
