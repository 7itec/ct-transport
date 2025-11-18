import useStorage from "hooks/use-storage";

const usePassword = () => {
  const [encryptedPassword, setPassword] = useStorage("password");

  return { encryptedPassword, setPassword };
};

export default usePassword;
