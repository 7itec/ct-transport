import useApiMutation from "hooks/use-api-mutations";
import { DriverStatus, UserProps } from "../types";
import useQueryHelpers from "hooks/use-query-helpers";
import usersKeys from "modules/users/util/users-keys";

const useCancelStop = () => {
  const { data: profile, setData } = useQueryHelpers<UserProps>(
    usersKeys.profile()
  );

  const onSuccess = () => {
    if (!profile?.currentWorkJourney) return;

    const { currentWorkJourney } = profile;

    if (
      currentWorkJourney.lastWorkRecord.previousDriverStatus ===
      DriverStatus.IN_DISPLACEMENT
    ) {
      currentWorkJourney.displacement =
        currentWorkJourney.lastWorkRecord.payload.displacement;
    }
    currentWorkJourney.driverStatus =
      currentWorkJourney.lastWorkRecord.previousDriverStatus;

    currentWorkJourney.lastWorkRecord.payload.workStopId = undefined;

    setData({ ...profile, currentWorkJourney });
  };

  return useApiMutation({
    method: "POST",
    url: "/work-records/cancel-stop",
    errorTitle: "Erro ao cancelar parada",
    onSuccess,
  });
};

export default useCancelStop;
