import { endOfDay } from "date-fns";
import useApiQuery from "hooks/use-api-query";
import dateFnsHelpers from "util/date-fns-helpers";
import { WorkRecordProps } from "../types";
import useProfileStorage from "modules/users/storage/use-profile-storage";

const useWorkRecords = () => {
  const { profile } = useProfileStorage();

  const startDate = profile?.currentWorkJourney
    ? dateFnsHelpers.format(
        profile?.currentWorkJourney?.registrationDate,
        "yyyy-MM-dd"
      )
    : null;

  const endDate = dateFnsHelpers.format(endOfDay(new Date()), "yyyy-MM-dd");

  return useApiQuery<WorkRecordProps[]>({
    url: "/work-records/me",
    errorTitle: "Erro ao buscar registros de trabalho",
    params: {
      registrationDate: JSON.stringify([
        { value: { date: startDate, time: "00:00" }, operator: ">=" },
        { value: { date: endDate, time: "23:59" }, operator: "<=" },
      ]),
    },
    enabled: !!profile,
  });
};

export default useWorkRecords;
