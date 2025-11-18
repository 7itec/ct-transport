import { AttendanceProps } from "modules/attendances/types";
import attendancesKeys from "modules/attendances/util/attendances-keys";
import useCurrentWorkJourney from "modules/work-journey/hooks/use-current-work-journey";
import useApiQuery from "shared/hooks/use-api-query";

const useAttendances = (vehicleId?: string) => {
  const { data } = useCurrentWorkJourney();

  return useApiQuery<AttendanceProps[]>({
    url: `/jobs/me?${vehicleId ? `vehicleId=${vehicleId}` : ""}`,
    queryKey: attendancesKeys.list(),
    errorTitle: "Erro ao buscar atendimentos",
    enabled: !!data?.currentWorkJourney?.conductorVehicle || !!vehicleId,
  });
};

export default useAttendances;
