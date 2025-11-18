import useStorage from "hooks/use-storage";

const useToken = () => {
  const [token, setToken] = useStorage<string>("token");

  return { token, setToken };
};

export default useToken;
