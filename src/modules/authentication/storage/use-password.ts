import useStorage from "hooks/use-storage";

const usePassword = () => {
  const [encryptedPassword, setPassword] = useStorage<string>("password");

  return { encryptedPassword, setPassword };
};

export default usePassword;
