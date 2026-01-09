import { useMMKVStorage } from "react-native-mmkv-storage";
import storage from "util/storage";

const useStorage = <T = any>(key: any, defaultValue?: T) => {
  return useMMKVStorage<T>(
    typeof key === "string" ? key : JSON.stringify(key),
    storage,
    defaultValue
  );
};

export default useStorage;
