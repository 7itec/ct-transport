import { ProtocolNamesEnum } from "../types";
import useAlerts from "./use-alerts";

const useIsWorkJourneyEndingAlert = () => {
  const alertsQuery = useAlerts();

  return alertsQuery.data?.find(
    ({ protocol, validated }) =>
      protocol.name === ProtocolNamesEnum.AVISO_PREVIO_ENCERRAMENTO_JORNADA &&
      !validated
  );
};

export default useIsWorkJourneyEndingAlert;
