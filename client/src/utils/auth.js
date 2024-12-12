export const getUser = () => {
  let user = localStorage.getItem("auth");
  return JSON.parse(user);
};

export const setUser = (data) => {
  localStorage.setItem("auth", JSON.stringify(data));
};

export const clearUser = () => {
  localStorage.removeItem("auth");
};
