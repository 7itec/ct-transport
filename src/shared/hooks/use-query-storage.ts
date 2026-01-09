import { useMMKVStorage } from "react-native-mmkv-storage";
import storage from "util/storage";

const useQueryStorage = <T>(queryKey: any) => {
  const [data, setData] = useMMKVStorage<T>(JSON.stringify(queryKey), storage);

  return { data, setData };
};

export default useQueryStorage;
