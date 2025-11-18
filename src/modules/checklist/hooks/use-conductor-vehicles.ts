import useApiQuery from "hooks/use-api-query";
import { VehicleProps } from "../types";

const useConductorVehicles = () => {
  const { data = [], ...query } = useApiQuery<
    Pick<VehicleProps, "_id" | "plate">[]
  >({
    url: "/vehicles/plates?onlyAvailable=true&type=CONDUCTOR",
    queryKey: ["vehicles", "conductors"],
    errorTitle: "Erro ao buscar veículos condutores",
  });

  return { ...query, data };
};

export default useConductorVehicles;
