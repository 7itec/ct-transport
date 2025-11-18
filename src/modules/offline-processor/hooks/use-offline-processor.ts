import useOfflineRequests from "./use-offline-requests";
import { useEffect } from "react";
import dateFnsHelpers from "util/date-fns-helpers";
import useStorage from "hooks/use-storage";

const useOfflineProcessor = () => {
  const { requests, updateOfflineRequest, resolveRequest } =
    useOfflineRequests();

  const isServerConnection = useStorage("serverConnection");

  const canResolveRequest = async () => {
    const isResolving = requests.find(
      (someRequest) => someRequest.status === "resolving"
    );

    const request = requests.find(
      (someRequest) => someRequest.status === "pending"
    );

    if (
      isResolving?.updatedAt &&
      dateFnsHelpers.differenceInMinutesFromNow(isResolving.updatedAt) >= 1
    )
      return resolveRequest(isResolving);

    if (!request || !isServerConnection || isResolving) return;

    updateOfflineRequest({ ...request, status: "resolving" });
    resolveRequest(request);
  };

  useEffect(() => {
    const interval = setInterval(canResolveRequest, 1000 * 10);

    return () => clearInterval(interval);
  }, [requests, isServerConnection]);
};

export default useOfflineProcessor;
