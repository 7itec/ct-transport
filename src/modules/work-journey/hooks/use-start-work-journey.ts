import useApiMutation from "hooks/use-api-mutations";
import {
  CurrentWorkJourneyProps,
  DriverStatus,
  LastWorkRecordProps,
  UserProps,
} from "../types";
import useQueryHelpers from "hooks/use-query-helpers";
import { router } from "expo-router";
import usersKeys from "modules/users/util/users-keys";

const useStartWorkJourney = () => {
  const { data: profile, setData } = useQueryHelpers<UserProps>(
    usersKeys.profile()
  );

  const onSuccess = (data: CurrentWorkJourneyProps, { _id }: any) => {
    if (!profile) return;

    setData({
      ...profile,
      currentWorkJourney: {
        _id,
        driverStatus: DriverStatus.IDLE,
        lastWorkRecord: {} as LastWorkRecordProps,
        timing: { stops: { lunch: { minutes: 0 } } } as any,
        stopCounts: { lunch: 0 },
        registrationDate: new Date(),
        totalStopTimeInMinutes: 0,
      } as any,
    });
    router.push("/");
  };

  return useApiMutation({
    method: "POST",
    url: `/work-journeys`,
    errorTitle: "Erro ao iniciar jornada de trabalho",
    onSuccess,
  });
};

export default useStartWorkJourney;
