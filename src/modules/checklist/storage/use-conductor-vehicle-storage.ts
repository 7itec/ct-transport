import {atom, useAtom} from 'jotai';
import {VehicleProps} from '../types';

const conductorVehicleAtom = atom<VehicleProps | null>(null);

const useConductorVehicleStorage = () => {
  const [conductorVehicle, setConductorVehicle] = useAtom(conductorVehicleAtom);

  return {conductorVehicle, setConductorVehicle};
};

export default useConductorVehicleStorage;
