import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { notification } from "antd";
import { clearUser, getUser, setUser } from "../utils/auth";
import { apiRefreshToken } from "./auth";

// const linkApi = " http://localhost:3000";
const linkApi = "http://172.16.13.165:3000/";
// const linkLive = process.env.REACT_APP_LIVE_LINK;

axios.defaults.withCredentials = true;

export const callApi = axios.create();

callApi.interceptors.request.use(
  async (config) => {
    const user = getUser();
    let date = new Date();

    if (!user?.accessToken) {
      window.location.replace(`${linkApi}/login`);
      notification.error({ message: "Login again" });
      return;
    }

    const decodedToken = jwtDecode(user?.accessToken);

    if (decodedToken.exp < date.getTime() / 1000) {
      const data = await apiRefreshToken();
      if (!data) {
        window.location.replace(`${linkApi}/login`);
        return;
      }
      const refreshUser = {
        ...user,
        accessToken: data?.accessToken,
      };
      setUser(refreshUser);
      config.headers["token"] = "Bearer " + data.accessToken;
    } else {
      config.headers["token"] = "Bearer " + user.accessToken;
    }
    config.headers["Access-Control-Allow-Origin"] = "*";
    return config;
  },
  (err) => {
    return Promise.reject(err);
  }
);

callApi.interceptors.response.use(
  (config) => {
    return config;
  },
  (error) => {
    console.log(error);
    if (error?.response?.status === 403 || error?.response?.status === 401) {
      clearUser();
      window.location.replace(`${linkApi}/login`);
      notification.error({ message: "Login again" });
      return;
    }
    if (error && error?.response?.status?.toString()?.startsWith(5)) {
      clearUser();
      window.location.replace(`${linkApi}/login`);
      notification.error({ message: "Internal Server Error" });
      return;
    }
    return Promise.reject(error);
  }
);
