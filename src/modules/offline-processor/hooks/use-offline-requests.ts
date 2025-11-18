import useApi from "hooks/use-api";
import useStorage from "hooks/use-storage";

export interface OfflineRequestProps {
  id: string;
  method: string;
  url: string;
  data?: any;
  headers?: any;
  status: "pending" | "error" | "success" | "resolving";
  numberOfTries: number;
  createdAt: Date;
  updatedAt?: Date;
}

const useOfflineRequests = () => {
  const api = useApi();
  const [requests, setRequests] = useStorage<OfflineRequestProps[]>(
    "requests",
    []
  );

  const createOfflineRequest = (
    request: Omit<
      OfflineRequestProps,
      "id" | "status" | "numberOfTries" | "updatedAt" | "createdAt"
    >
  ) => {
    setRequests([
      ...requests,
      {
        ...request,
        status: "pending",
        numberOfTries: 0,
        id: String(new Date().getTime()),
        createdAt: new Date(),
      },
    ]);
  };

  const updateOfflineRequest = (request: OfflineRequestProps) => {
    const updatedRequests = requests.map((someRequest) =>
      someRequest.id === request.id
        ? {
            ...request,
            numberOfTries: request.numberOfTries + 1,
            updatedAt: new Date(),
          }
        : someRequest
    );

    setRequests(updatedRequests);
  };

  const resolveRequest = async (request: OfflineRequestProps) => {
    try {
      await api(request);
      updateOfflineRequest({ ...request, status: "success" });
    } catch (error) {
      updateOfflineRequest({
        ...request,
        numberOfTries: request.numberOfTries + 1,
        status: request.numberOfTries + 1 >= 3 ? "error" : "pending",
      });
    }
  };

  const pendingRequests = requests?.filter(
    (request) => !["success", "error"].includes(request.status)
  );

  return {
    requests,
    setRequests,
    createOfflineRequest,
    updateOfflineRequest,
    resolveRequest,
    pendingRequests,
  };
};

export default useOfflineRequests;
