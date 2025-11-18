import useApiQuery from "hooks/use-api-query";
import { VehicleProps } from "../types";

const useVehicleDetails = (vehicleId: string) => {
  const { data, ...query } = useApiQuery({
    url: `/vehicles/${vehicleId}`,
    queryKey: ["vehicles", vehicleId],
    enabled: !!vehicleId,
    errorTitle: "Erro ao buscar detalhes do veículo",
  });

  return {
    ...query,
    data: data ? ({ ...data, ...data.vehicle } as VehicleProps) : undefined,
  };
};

export default useVehicleDetails;
