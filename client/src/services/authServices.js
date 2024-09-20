const baseURL = "http://localhost:8000/auth";
const endpoints = {
  register: "/register",
  login: "/login",
  logout: "/logout",
  getSession: "/get-session",
};

export const registerUser = async (userData) => {
  let resp = await fetch(`${baseURL}${endpoints.register}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
    credentials: "include",
  });
  return resp;
};

export const loginUser = async (userData) => {
  let resp = await fetch(`${baseURL}${endpoints.login}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
    credentials: "include",
  });
  return resp;
};

export const getSessionInfo = async (property) => {
  let resp = await fetch(`${baseURL}${endpoints.getSession}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ property }),
    credentials: "include",
  });
  return resp;
};

export const logOut = async () => {
  let resp = await fetch(`${baseURL}${endpoints.logout}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });
  return resp;
};
