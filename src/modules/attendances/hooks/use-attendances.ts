import { AttendanceProps } from "modules/attendances/types";
import attendancesKeys from "modules/attendances/util/attendances-keys";
import useProfileStorage from "modules/users/storage/use-profile-storage";
import useApiQuery from "shared/hooks/use-api-query";

const useAttendances = (vehicleId?: string) => {
  const { profile } = useProfileStorage();

  return useApiQuery<AttendanceProps[]>({
    url: `/jobs/me?${vehicleId ? `vehicleId=${vehicleId}` : ""}`,
    queryKey: attendancesKeys.list(),
    errorTitle: "Erro ao buscar atendimentos",
    enabled: !!profile?.currentWorkJourney?.conductorVehicle || !!vehicleId,
    refetchInterval: 60 * 2,
  });
};

export default useAttendances;
