"use server";

import axios from "axios";

export const api = axios.create({
  baseURL: process.env.API_URL,
  withCredentials: true,
  headers: {
    apikey: process.env.NEXT_PUBLIC_API_KEY,
  },
});
