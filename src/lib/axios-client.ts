import axios from "axios";

export const apiClient = axios.create({
  baseURL: "/api",
  withCredentials: true,
  headers: {
    apikey: "da357bc3-5594-40c8-adcc-2819a3b01ed1",
  },
});
