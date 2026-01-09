import useApiMutation from "hooks/use-api-mutations";
import formatChecklist from "../util/format-checklist";
import useConductorVehicleStorage from "../storage/use-conductor-vehicle-storage";
import { VehicleProps } from "../types";
import useAttachedVehiclesStorage from "../storage/use-attached-vehicles-storage";

interface RequestProps {
  vehicle: VehicleProps;
}

const useAnswerChecklist = () => {
  const { setConductorVehicle } = useConductorVehicleStorage();
  const { setAttachedVehicles } = useAttachedVehiclesStorage();

  const onSuccess = (response: any, { vehicle }: RequestProps) => {
    if (vehicle.type === "CONDUCTOR")
      setConductorVehicle({ ...vehicle, canSkipChecklist: true });
    else
      setAttachedVehicles((items) => [
        ...items,
        { ...vehicle, canSkipChecklist: true },
      ]);
  };

  return useApiMutation({
    method: "POST",
    url: "/checklists",
    formatData: formatChecklist,
    headers: { "Content-Type": "multipart/form-data" },
    errorTitle: "Erro ao enviar checklist",
    onSuccess,
  });
};

export default useAnswerChecklist;
