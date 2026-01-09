import useApi from "./use-api";
import Toast from "react-native-toast-message";
import decodeError from "util/decode-error";
import { useCallback, useEffect, useRef, useState } from "react";
import useLogs from "./use-logs";
import useServerConnection from "modules/offline-processor/hooks/use-server-connection";
import useStorage from "./use-storage";

let __runnerActive: Record<string, boolean | null> = {};

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
  refetchInterval = 60 * 5,
}: Props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isRefetching, setIsRefetching] = useState(false);
  const trackEvent = useLogs();
  const isServerConnection = useServerConnection();

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const getQueryKey = () => {
    if (params) return queryKey ?? [url, params];
    return queryKey ?? [url];
  };

  const stringifiedQueryKey = JSON.stringify(getQueryKey());

  const [data, setData] = useStorage<T>(stringifiedQueryKey);

  const api = useApi();

  const request = useCallback(async () => {
    try {
      // console.log("request - start", url);
      const response = await api({
        method: "GET",
        url,
        params,
      });
      // console.log("request - end", url);

      if (url === "/users/me")
        trackEvent("Refresh User Data", { data: response.data.data });

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
  }, [request, isServerConnection]);

  const refetch = useCallback(async () => {
    setIsRefetching(true);
    await request();
    setIsRefetching(false);
  }, [request, isServerConnection]);

  const clearCurrentInterval = () => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const startLoop = useCallback(() => {
    clearCurrentInterval();

    request();

    intervalRef.current = setInterval(() => {
      request();
    }, refetchInterval * 1000);
  }, [request]);

  useEffect(() => {
    const isRunnerActive = __runnerActive[stringifiedQueryKey];

    if (!isRunnerActive && enabled) {
      __runnerActive[stringifiedQueryKey] = true;
      startLoop();
    }

    return () => {
      if (!isRunnerActive) __runnerActive[stringifiedQueryKey] = null;
      clearCurrentInterval();
    };
  }, [enabled]);

  return { data, isLoading, fetch, refetch, isRefetching };
};

export default useApiQuery;
