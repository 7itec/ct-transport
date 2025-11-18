import axios from "axios";
import useToken from "modules/authentication/storage/use-token";

export const baseURL = "https://api-ct.koepe.com.br";

export default (customUrl?: string) => {
  const { token } = useToken();

  const api = axios.create({
    baseURL: customUrl ?? baseURL,
    headers: {
      "origin-platform": "Transports App",
    },
  });

  api.interceptors.request.use(async (req) => {
    if (token) req.headers.Authorization = `Bearer ${token}`;

    return req;
  });

  return api;
};
