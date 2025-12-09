import axios from "axios";
import useToken from "modules/authentication/storage/use-token";
import { useMemo } from "react";

export const baseURL = "https://api-ct.koepe.com.br";

export default (customUrl?: string) => {
  const { token } = useToken();

  const api = useMemo(() => {
    const instance = axios.create({
      baseURL: customUrl ?? baseURL,
      headers: {
        "origin-platform": "Transports App",
      },
    });

    instance.interceptors.request.use(async (req) => {
      if (token) req.headers.Authorization = `Bearer ${token}`;

      return req;
    });

    return instance;
  }, [token]);

  return api;
};
