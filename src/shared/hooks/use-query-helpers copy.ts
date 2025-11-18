import { useQueryClient } from "@tanstack/react-query";

const useQueryHelpers = () => {
  const queryClient = useQueryClient();

  const invalidate = (key: any) => "";

  const setData = (key: any, data: any) => {
    queryClient.setQueryData(key, data);
  };

  const getData = <T>(key: any) => {
    const cache = queryClient.getQueryData(key) as T;

    return cache;
  };

  const create = (key: any, createdData: any) => {
    const data = getData(key);

    if (!data || !Array.isArray(data)) return;

    setData(key, [...data, createdData]);
  };

  const update = (key: any, updatedData: any) => {
    const data = getData(key);

    if (!data || !Array.isArray(data)) return;

    const newData = data.map((row) =>
      row._id === updatedData._id ? updatedData : row
    );

    setData(key, newData);
  };

  const map = <T>(key: any, updater: (data: T) => T) => {
    const data = getData(key);

    if (!data || !Array.isArray(data)) return;

    const newData = data.map(updater);

    setData(key, newData);
  };

  const remove = (key: any, { _id }: any) => {
    const data = getData(key);

    if (!data || !Array.isArray(data)) return;

    const newData = data.filter((row) => row._id !== _id);

    setData(key, newData);
  };

  return {
    invalidate,
    setData,
    getData,
    create,
    update,
    remove,
    map,
  };
};

export default useQueryHelpers;
