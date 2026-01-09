import useApiQuery from "hooks/use-api-query";
import { UserProps } from "../types";
import useOfflineRequests from "modules/offline-processor/hooks/use-offline-requests";
import useToken from "modules/authentication/storage/use-token";
import usersKeys from "modules/users/util/users-keys";

const useCurrentWorkJourney = () => {
  const { pendingRequests } = useOfflineRequests();
  const { token } = useToken();

  return useApiQuery<UserProps | undefined>({
    url: "/users/me",
    queryKey: usersKeys.profile(),
    enabled: !pendingRequests?.length && !!token,
    errorTitle: "Erro ao atualizar dados da jornada atual",
    refetchInterval: 60 * 1,
  });
};

export default useCurrentWorkJourney;
