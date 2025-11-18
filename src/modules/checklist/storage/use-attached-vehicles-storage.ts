import {atom, useAtom} from 'jotai';
import {VehicleProps} from '../types';

const attachedVehiclesAtom = atom<VehicleProps[]>([]);

const useAttachedVehiclesStorage = () => {
  const [attachedVehicles, setAttachedVehicles] = useAtom(attachedVehiclesAtom);

  return {attachedVehicles, setAttachedVehicles};
};

export default useAttachedVehiclesStorage;
