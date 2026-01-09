import useStorage from "hooks/use-storage";
import { AlertProps, ProtocolNamesEnum } from "../types";
import alertsKeys from "../util/alerts-keys";

const useIsWorkJourneyEndingAlert = () => {
  const [alerts] = useStorage<AlertProps[]>(alertsKeys.list());

  return alerts?.find(
    ({ protocol, validated }) =>
      protocol.name === ProtocolNamesEnum.AVISO_PREVIO_ENCERRAMENTO_JORNADA &&
      !validated
  );
};

export default useIsWorkJourneyEndingAlert;
