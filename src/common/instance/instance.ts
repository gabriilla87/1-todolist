import axios from "axios";

export const instance = axios.create({
  baseURL: "https://social-network.samuraijs.com/api/1.1/",
  withCredentials: true,
  headers: {
    "API-KEY": "51762684-c56c-44ab-a28d-b3e9baf8a66e",
  },
});
