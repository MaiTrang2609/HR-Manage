import axios from "axios";
import { callApi } from "./config";

import { notification } from "antd";
import { clearUser, setUser } from "../utils/auth";
import { signInWithPopup, signOut } from "firebase/auth";
import { auth, provider } from "../utils/firebase";
const linkApi = process.env.REACT_APP_API_LINK;

export const apiRefreshToken = async () => {
  try {
    const res = await axios.post(
      `${linkApi}/api/user/refresh`,
      {},
      {
        withCredentials: true,
      }
    );
    return res.data;
  } catch (error) {
    notification.error({
      message: error?.response?.data?.message || "Có lỗi xảy ra",
    });
  }
};

export const logIn = async (data) => {
  try {
    const url = `${linkApi}/api/user/login`;
    const res = await axios.post(url, data);
    return res;
  } catch (error) {
    notification.error({
      message: error?.response?.data?.message || "Có lỗi xảy ra",
    });
  }
};
export const signUp = async (data) => {
  try {
    const url = `${linkApi}/api/user/signup`;
    const res = await axios.post(url, data);
    return res;
  } catch (error) {
    notification.error({
      message: error?.response?.data?.message || "Có lỗi xảy ra",
    });
  }
};
export const signInWithGoogle = async () => {
  signInWithPopup(auth, provider)
    .then((result) => {
      console.log(result);
      const data = {
        name: result.user.displayName,
        email: result.user.email,
        accessToken: result.user.accessToken,
      };
      axios
        .post(`${linkApi}/api/user/login-google`, data)
        .then((res) => {
          setUser(res.data);
          notification.success({ message: res.data?.message });
          window.location.replace("/");
        })
        .catch((error) => {
          notification.error({
            message: error?.response?.data?.message || "Có lỗi xảy ra",
          });
        });
    })
    .catch((error) => {
      notification.error({
        message: error?.response?.data?.message || "Có lỗi xảy ra",
      });
    });
};

export const logOut = async () => {
  try {
    const url = `${linkApi}/api/user/logout`;
    const res = await axios.get(url);
    clearUser();
    signOut(auth);
    notification.success({ message: res.data?.message });
    window.location.replace("/login");
  } catch (error) {
    notification.error({
      message: error?.response?.data?.message || "Có lỗi xảy ra",
    });
  }
};

export const getMyProfile = async () => {
  try {
    const url = `${linkApi}/api/user/auth/profile`;
    const res = await callApi.get(url);
    return res;
  } catch (error) {
    notification.error({
      message: error?.response?.data?.message || "Có lỗi xảy ra",
    });
  }
};

export const updateProfile = async (data) => {
  try {
    const url = `${linkApi}/api/user/auth/updateMyProfile`;
    const res = await callApi.patch(url, data);
    notification.success({ message: res.data?.message });
    return res;
  } catch (error) {
    notification.error({
      message: error?.response?.data?.message || "Có lỗi xảy ra",
    });
  }
};

export const updatePassword = async (data) => {
  try {
    const url = `${linkApi}/api/user/auth/updateMyPassword`;
    const res = await callApi.patch(url, data);
    notification.success({ message: res.data?.message });

    return res;
  } catch (error) {
    notification.error({
      message: error?.response?.data?.message || "Có lỗi xảy ra",
    });
  }
};
