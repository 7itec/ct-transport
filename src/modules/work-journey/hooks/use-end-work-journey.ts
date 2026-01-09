import useApiMutation from "hooks/use-api-mutations";
import { UserProps } from "../types";
import useQueryHelpers from "hooks/use-query-helpers";
import { router } from "expo-router";
import { Alert } from "react-native";
import dateFnsHelpers from "util/date-fns-helpers";
import usersKeys from "modules/users/util/users-keys";
import useConductorVehicleStorage from "modules/checklist/storage/use-conductor-vehicle-storage";
import useAttachedVehiclesStorage from "modules/checklist/storage/use-attached-vehicles-storage";

const useEndWorkJourney = () => {
  const { data: profile, setData } = useQueryHelpers<UserProps>(
    usersKeys.profile()
  );
  const { conductorVehicle, setConductorVehicle } =
    useConductorVehicleStorage();
  const { setAttachedVehicles } = useAttachedVehiclesStorage();

  const onSuccess = () => {
    if (!profile) return;

    if (conductorVehicle)
      setConductorVehicle({ ...conductorVehicle, canSkipChecklist: false });

    setAttachedVehicles((vehicles) =>
      vehicles.map((vehicle) => ({ ...vehicle, canSkipChecklist: false }))
    );

    profile.lastWorkJourneyEndedAt = new Date();

    const overtime =
      profile?.currentWorkJourney?.timing?.interjourney?.overtime?.pending
        ?.seconds ?? 0;
    const compensated =
      profile?.currentWorkJourney?.timing?.interjourney?.overtime?.compensated
        ?.seconds ?? 0;

    const additionalTime =
      overtime && overtime > 0
        ? overtime > compensated
          ? overtime - compensated
          : 0
        : 0;

    Alert.alert(
      "Jornada finalizada",
      `Obrigado! Bom descanso. Próxima Jornada ${dateFnsHelpers.defaultFormat(
        dateFnsHelpers.addSeconds(
          new Date(),
          11 * 60 * 60 + (additionalTime > 0 ? additionalTime : 0)
        )
      )}. Confirme com a Operação.`
    );

    setData({ ...profile, currentWorkJourney: undefined });

    router.replace("/");
  };

  return useApiMutation({
    method: "PATCH",
    url: "/work-journeys/end",
    errorTitle: "Erro ao finalizar jornada de trabalho",
    onSuccess,
  });
};

export default useEndWorkJourney;
