import { VehicleProps } from "../types";
import useStorage from "hooks/use-storage";

const useAttachedVehiclesStorage = () => {
  const [attachedVehicles, setAttachedVehicles] = useStorage<VehicleProps[]>(
    "attachedVehicles",
    []
  );

  return { attachedVehicles, setAttachedVehicles };
};

export default useAttachedVehiclesStorage;
