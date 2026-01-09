import useApiMutation from "hooks/use-api-mutations";
import useQueryHelpers from "hooks/use-query-helpers";
import { UserProps } from "../types";
import { router } from "expo-router";
import usersKeys from "modules/users/util/users-keys";

const useConfirmVehicle = () => {
  const { data: profile, setData } = useQueryHelpers<UserProps>(
    usersKeys.profile()
  );

  const onSuccess = (_: any, { workJourneyVehicles }: any) => {
    if (!profile?.currentWorkJourney) return;

    setData({
      ...profile,
      currentWorkJourney: {
        ...profile.currentWorkJourney,
        ...workJourneyVehicles,
      },
    });

    router.dismissAll();
    router.replace("/");
  };

  return useApiMutation({
    method: "POST",
    url: "/vehicles-history",
    errorTitle: "Erro ao confirmar veículo",
    onSuccess,
  });
};

export default useConfirmVehicle;
