import axios, { AxiosError } from "axios";

export function isAxiosError(error: unknown): error is AxiosError {
  return axios.isAxiosError(error);
}
