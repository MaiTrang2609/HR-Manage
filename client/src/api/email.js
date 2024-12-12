import { callApi } from "./config";
import { notification } from "antd";

const link = process.env.REACT_APP_API_LINK;

export const sendEmail = async (data) => {
  try {
    const url = `${link}/api/email/send-email`;
    const res = await callApi.post(url, data);
    return res;
  } catch (error) {
    notification.error({
      message: error?.response?.data?.message || "Có lỗi xảy ra",
    });
  }
};
