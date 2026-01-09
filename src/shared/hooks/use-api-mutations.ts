import useApi from "./use-api";
import Toast from "react-native-toast-message";
import decodeError from "util/decode-error";
import { useState } from "react";
import useOfflineRequests from "modules/offline-processor/hooks/use-offline-requests";
import useServerConnection from "modules/offline-processor/hooks/use-server-connection";

interface Props {
  url: ((data: any) => string) | string;
  method: string;
  formatData?: (data: any) => any;
  headers?: ((data: any) => any) | any;
  errorTitle: string;
  successTitle?: string;
  successMessage?: string;
  onSuccess?: (data: any, variables: any) => void;
  offline?: boolean;
}

const useApiMutation = <T = any>({
  errorTitle,
  successTitle,
  successMessage,
  onSuccess,
  method,
  url,
  formatData,
  headers,
  offline = true,
}: Props) => {
  const api = useApi();
  const [isLoading, setIsLoading] = useState(false);
  const { createOfflineRequest, pendingRequests } = useOfflineRequests();
  const isServerConnection = useServerConnection();

  const handleOnSuccess = (response?: any, data?: T) => {
    if (onSuccess) onSuccess(response, data);

    if (successTitle && successMessage)
      Toast.show({
        type: "success",
        text1: successTitle,
        text2: successMessage,
      });
  };

  const handleRequest = async (data?: T) => {
    try {
      setIsLoading(true);
      const response = await api({
        method,
        url: typeof url === "function" ? url(data) : url,
        data: formatData ? formatData(data) : data,
        headers: typeof headers === "function" ? headers(data) : headers,
      });

      handleOnSuccess(response.data.data, data);

      return response.data.data;
    } catch (error) {
      const status = error?.response?.status;
      const responseError = error?.response?.data;
      console.log(responseError ?? error);
      Toast.show({
        type: "error",
        text1: errorTitle,
        text2:
          status === 504
            ? "O tempo de resposta do servidor excedeu o limite permitido."
            : decodeError(error),
      });
    } finally {
      setIsLoading(false);
    }
  };

  const mutate = async (data?: T) => {
    if (!offline) return await handleRequest(data);
    if (isServerConnection && pendingRequests?.length === 0)
      return await handleRequest(data);

    handleOnSuccess(undefined, data);

    createOfflineRequest({
      data,
      method,
      url: typeof url === "function" ? url(data) : url,
      headers: typeof headers === "function" ? headers(data) : headers,
    });

    return undefined;
  };

  return {
    mutate,
    isLoading,
  };
};

export default useApiMutation;
