import { useEffect } from "react";
import useStorageManager from "./use-storage-manager";

type StorageReturnType<T = any> = [T, (value: T) => void];

const useStorage = <T = any>(key: string, defaultValue?: T) => {
  const { setStorage, ...store } = useStorageManager();
  const storage = store.storage ?? {};

  useEffect(() => {
    if (defaultValue && !storage[key])
      setStorage((previousValue: T) => ({
        ...previousValue,
        [key]: defaultValue,
      }));
  }, []);

  return [
    storage[key],
    (value) =>
      setStorage((previousValue: T) => ({ ...previousValue, [key]: value })),
  ] as StorageReturnType<T>;
};

export default useStorage;
