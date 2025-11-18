import useApiMutation from "hooks/use-api-mutations";
import useQueryHelpers from "hooks/use-query-helpers";
import { UserProps } from "../types";
import attendancesKeys from "modules/attendances/util/attendances-keys";
import usersKeys from "modules/users/util/users-keys";
import { AttendanceProps } from "modules/attendances/types";

const useRemoveVehicle = () => {
  const { data: profile, setData } = useQueryHelpers<UserProps>(
    usersKeys.profile()
  );
  const attendancesQuery = useQueryHelpers<AttendanceProps[]>(
    attendancesKeys.list()
  );

  const onSuccess = () => {
    if (!profile?.currentWorkJourney) return;

    setData({
      ...profile,
      currentWorkJourney: {
        ...profile.currentWorkJourney,
        conductorVehicle: null,
      },
    });
    attendancesQuery.setData([]);
  };

  return useApiMutation({
    method: "PATCH",
    url: "/vehicles-history/me/clear",
    errorTitle: "Erro ao remover veículo",
    onSuccess,
  });
};

export default useRemoveVehicle;
