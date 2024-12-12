import axios from "axios";

export const apiClient = axios.create({
  baseURL: "/api",
  withCredentials: true,
  headers: {
    apikey: process.env.NEXT_PUBLIC_API_KEY,
  },
});
