import useApiMutation from "hooks/use-api-mutations";
import useQueryHelpers from "hooks/use-query-helpers";
import {
  DriverStatus,
  LastWorkRecordProps,
  UserProps,
  WorkStopProps,
} from "../types";
import { router, useLocalSearchParams } from "expo-router";
import usersKeys from "modules/users/util/users-keys";

const useStop = () => {
  const { redirect } = useLocalSearchParams<{ redirect: string }>();
  const { data: user, setData } = useQueryHelpers<UserProps>(
    usersKeys.profile()
  );
  const { data: workStops } = useQueryHelpers<WorkStopProps[]>(
    usersKeys.workStops()
  );

  const onSuccess = (data: any, { workStopId }: any) => {
    if (!user?.currentWorkJourney) return;

    const { currentWorkJourney } = user;

    const stopReason = workStops?.find(
      (workStop) => workStop._id === workStopId
    )?.name;

    const lastWorkRecord = {
      registrationDate: new Date(),
      previousDriverStatus: currentWorkJourney?.driverStatus,
      payload: {
        workStopId,
        stopReason,
        workStopName: stopReason,
        displacement: currentWorkJourney?.displacement,
      },
    } as LastWorkRecordProps;

    setData({
      ...user,
      currentWorkJourney: {
        ...currentWorkJourney,
        driverStatus: DriverStatus.STOPPED,
        lastWorkRecord,
      },
    });

    if (redirect !== "home") return router.back();

    router.dismissAll();
    router.replace("/");
  };

  return useApiMutation({
    method: "POST",
    url: "/work-records/stopped",
    errorTitle: "Erro ao realizar parada",
    onSuccess,
  });
};

export default useStop;
