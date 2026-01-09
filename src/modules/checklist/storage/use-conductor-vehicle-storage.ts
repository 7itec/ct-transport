import { VehicleProps } from "../types";
import useStorage from "hooks/use-storage";

const useConductorVehicleStorage = () => {
  const [conductorVehicle, setConductorVehicle] =
    useStorage<VehicleProps | null>("conductorVehicle");

  return { conductorVehicle, setConductorVehicle };
};

export default useConductorVehicleStorage;
