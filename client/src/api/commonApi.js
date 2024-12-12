import { callApi } from "./config";
import { notification } from "antd";
import queryString from "query-string";

const link = process.env.REACT_APP_API_LINK;

export const getListDoc = async (type, payload) => {
  try {
    const url = `${link}/api/${type}?${queryString.stringify(payload)}`;
    const res = await callApi.get(url);
    return res;
  } catch (error) {
    notification.error({
      message: error?.response?.data?.message || "Có lỗi xảy ra",
    });
  }
};
export const getDoc = async (type, id) => {
  try {
    const url = `${link}/api/${type}/${id}`;
    const res = await callApi.get(url);
    return res;
  } catch (error) {
    notification.error({
      message: error?.response?.data?.message || "Có lỗi xảy ra",
    });
  }
};
export const addDoc = async (type, data, navigate) => {
  try {
    const url = `${link}/api/${type}`;
    const res = await callApi.post(url, data);
    notification.success({ message: res.data?.message });
    navigate && navigate(`/${type}`);
  } catch (error) {
    notification.error({
      message: error?.response?.data?.message || "Có lỗi xảy ra",
    });
  }
};

export const deleteDoc = async (type, id) => {
  try {
    const url = `${link}/api/${type}/${id}`;
    const res = await callApi.delete(url);
    notification.success({ message: res.data?.message });
  } catch (error) {
    notification.error({
      message: error?.response?.data?.message || "Có lỗi xảy ra",
    });
  }
};

export const updateDoc = async (type, id, data) => {
  try {
    const url = `${link}/api/${type}/${id}`;
    const res = await callApi.patch(url, data);
    notification.success({ message: res.data?.message });
  } catch (error) {
    notification.error({
      message: error?.response?.data?.message || "Có lỗi xảy ra",
    });
  }
};
