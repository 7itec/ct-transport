import useApi from "./use-api";
import Toast from "react-native-toast-message";
import decodeError from "util/decode-error";
import { useMMKVStorage } from "react-native-mmkv-storage";
import { useCallback, useEffect, useState } from "react";
import storage from "util/storage";

interface Props {
  url: string;
  queryKey?: any;
  params?: any;
  enabled?: boolean;
  extractData?: boolean;
  refetchInterval?: number;
  errorTitle: string;
}

const useApiQuery = <T = any>({
  url,
  queryKey,
  params,
  enabled = true,
  errorTitle,
}: Props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isRefetching, setIsRefetching] = useState(false);

  const getQueryKey = () => {
    if (params) return queryKey ?? [url, params];
    return queryKey ?? [url];
  };

  const [data, setData] = useMMKVStorage<T>(
    JSON.stringify(getQueryKey()),
    storage
  );

  const api = useApi();

  const request = useCallback(async () => {
    try {
      const response = await api({
        method: "GET",
        url,
        params,
      });

      return setData(response.data.data);
    } catch (error) {
      console.log(url, decodeError(error));
      Toast.show({
        type: "error",
        text1: errorTitle,
        text2: decodeError(error),
      });
    }
  }, [url, params, errorTitle, setData]);

  const fetch = useCallback(async () => {
    setIsLoading(true);
    await request();
    setIsLoading(false);
  }, [request]);

  const refetch = useCallback(async () => {
    setIsRefetching(true);
    await request();
    setIsRefetching(false);
  }, [request]);

  useEffect(() => {
    if (
      (!data ||
        (!Array.isArray(data) &&
          typeof data === "object" &&
          Object.keys(data).length === 0)) &&
      enabled
    )
      fetch();
  }, [data, enabled, fetch]);

  return { data, isLoading, fetch, refetch, isRefetching };
};

export default useApiQuery;
