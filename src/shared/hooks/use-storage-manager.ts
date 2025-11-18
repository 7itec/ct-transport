import atomWithAsyncStorage from "atoms/persistent-atom";
import { useAtom } from "jotai";

export const storageAtom = atomWithAsyncStorage<Record<string, any>>("storage");

const useStorageManager = () => {
  const [storage, setStorage] = useAtom(storageAtom);

  return { storage, setStorage };
};

export default useStorageManager;
