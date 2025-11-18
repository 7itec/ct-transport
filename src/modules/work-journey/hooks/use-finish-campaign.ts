import useApiMutation from "hooks/use-api-mutations";
import useQueryHelpers from "hooks/use-query-helpers";
import { UserProps } from "../types";
import usersKeys from "modules/users/util/users-keys";

const useFinishCampaign = (eddsId: string) => {
  const { data: profile, setData } = useQueryHelpers<UserProps>(
    usersKeys.profile()
  );

  const onSuccess = () => {
    if (!profile?.currentWorkJourney) return;

    setData({ ...profile, pendingCampaign: undefined });
  };

  return useApiMutation({
    method: "PATCH",
    url: `/campaigns/${eddsId}/seen`,
    errorTitle: "Erro ao finalizar edds",
    onSuccess,
  });
};

export default useFinishCampaign;
