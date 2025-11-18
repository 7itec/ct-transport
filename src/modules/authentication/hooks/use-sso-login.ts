import useApiMutation from "hooks/use-api-mutations";
import useToken from "../storage/use-token";
import usePassword from "../storage/use-password";
import bcrypt from "bcrypt-react-native";
import useSession from "../storage/use-session";
import { router } from "expo-router";

const useSSOLogin = () => {
  const { setToken } = useToken();
  const { setPassword } = usePassword();
  const { startSession } = useSession();

  const onSuccess = async (data: any, variables: any) => {
    const salt = await bcrypt.getSalt(10);

    if (!!variables.password) {
      const encryptedPassword = await bcrypt.hash(salt, variables.password);
      setPassword(encryptedPassword);
    }

    setToken(data.access_token);
    startSession();
    router.replace("/");
  };

  return useApiMutation({
    method: "POST",
    url: "/auth/sso",
    headers: (accessToken: string) => ({
      Authorization: `Bearer ${accessToken}`,
    }),
    errorTitle: "Erro no login",
    onSuccess,
    offline: false,
  });
};

export default useSSOLogin;
