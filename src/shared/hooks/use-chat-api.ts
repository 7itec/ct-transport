import axios from "axios";
import useToken from "modules/authentication/storage/use-token";

export const chatBaseApiURL = "https://cicm-chat-ms.azurewebsites.net";

export default () => {
  const { token } = useToken();

  const chatApi = axios.create({
    baseURL: chatBaseApiURL,
    headers: {
      "origin-platform": "Transports App",
    },
  });

  chatApi.interceptors.request.use(async (req) => {
    if (token) req.headers.Authorization = `Bearer ${token}`;

    return req;
  });

  return chatApi;
};
