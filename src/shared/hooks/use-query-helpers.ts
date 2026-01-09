import useStorage from "./use-storage";

const useQueryHelpers = <T>(key: any) => {
  const [data, updateData] = useStorage<T>(JSON.stringify(key));

  const setData = (data: T) => {
    updateData(data);
  };

  const create = (createdData: T[]) => {
    if (!data || !Array.isArray(data)) return;

    setData([...data, createdData] as T);
  };

  const update = (updatedData: any) => {
    if (!data || !Array.isArray(data)) return;

    const newData = data.map((row) =>
      row._id === updatedData._id ? updatedData : row
    );

    setData(newData as T);
  };

  const map = (updater: (data: T) => T) => {
    if (!data || !Array.isArray(data)) return;

    const newData = data.map(updater);

    setData(newData as T);
  };

  const remove = ({ _id }: any) => {
    if (!data || !Array.isArray(data)) return;

    const newData = data.filter((row) => row._id !== _id);

    setData(newData as T);
  };

  return { data, setData, create, update, remove, map };
};

export default useQueryHelpers;
