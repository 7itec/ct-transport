import useApiQuery from "hooks/use-api-query";
import { VehicleProps } from "../types";

const useAttachedVehicles = () => {
  return useApiQuery<Pick<VehicleProps, "_id" | "plate">[]>({
    url: "/vehicles/plates?onlyAvailable=true&type=ATTACHED",
    queryKey: ["vehicles", "attacheds"],
    errorTitle: "Erro ao buscar veículos acoplados",
  });
};

export default useAttachedVehicles;
