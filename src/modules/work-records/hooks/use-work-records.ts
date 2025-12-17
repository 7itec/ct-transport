import { endOfDay } from "date-fns";
import useApiQuery from "hooks/use-api-query";
import useCurrentWorkJourney from "modules/work-journey/hooks/use-current-work-journey";
import dateFnsHelpers from "util/date-fns-helpers";
import { WorkRecordProps } from "../types";

const useWorkRecords = () => {
  const { data } = useCurrentWorkJourney();

  const startDate = data?.currentWorkJourney
    ? dateFnsHelpers.format(
        data?.currentWorkJourney?.registrationDate,
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
    enabled: !!data,
  });
};

export default useWorkRecords;
