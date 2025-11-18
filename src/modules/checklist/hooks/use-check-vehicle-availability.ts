import useApiMutation from "hooks/use-api-mutations";
import { VehicleProps } from "../types";

const useCheckVehicleAvailability = (type: VehicleProps["type"]) => {
  return useApiMutation({
    method: "GET",
    url: (vehicleId) =>
      `/vehicles/${vehicleId}/check-availability?type=${type}`,
    errorTitle: "Erro ao buscar detalhes do veículo",
    offline: false,
  });
};

export default useCheckVehicleAvailability;
