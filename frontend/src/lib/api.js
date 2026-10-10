import axios from "axios";

export const BACKEND_URL = "";
export const API = `${BACKEND_URL}/api`;

export const api = axios.create({ baseURL: API, withCredentials: true });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("sq_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const fileUrl = (fid) => {
  const token = localStorage.getItem("sq_token");
  return `${API}/files/${fid}?auth=${encodeURIComponent(token || "")}`;
};
