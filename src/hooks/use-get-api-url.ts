import { DEFAULT_DEV_URL } from "../assets/config";

export const useGetApiUrl = () => {
  const backendAttachedURL = window?.env?.API_URL;
  return backendAttachedURL?.includes("https")
    ? backendAttachedURL
    : DEFAULT_DEV_URL;
};
