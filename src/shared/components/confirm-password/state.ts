import {
  ForwardedRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import ReactNativeBiometrics, { BiometryTypes } from "react-native-biometrics";
import bcrypt from "bcrypt-react-native";
import { TextInput } from "react-native";
import { useBackHandler } from "@react-native-community/hooks";
import usePassword from "modules/authentication/storage/use-password";
import Toast from "react-native-toast-message";

const useConfirmPasswordState = (
  callback: () => void,
  ref: ForwardedRef<unknown>
) => {
  const [password, setPassword] = useState<string>("");
  const [visible, setVisible] = useState(false);
  const [biometrics, isBiometricsAvailable] = useState(false);
  const passwordInputRef = useRef<TextInput>(null);
  const { encryptedPassword } = usePassword();
  const reactNativeBiometrics = new ReactNativeBiometrics();

  useImperativeHandle(ref, () => ({
    open: () => setVisible(true),
  }));

  useBackHandler(() => {
    if (!visible) return false;
    setVisible(false);
    return true;
  });

  function requestAccess() {
    reactNativeBiometrics
      .simplePrompt({
        promptMessage: "Confirmar digital",
        cancelButtonText: "usar senha",
      })
      .then(async (resultObject) => {
        const { success } = resultObject;

        if (success) {
          callback();
          setVisible(false);
        }

        setTimeout(() => passwordInputRef.current?.focus(), 400);
      })
      .catch(() => {
        console.log("biometrics failed");
      });
  }

  const checkBiometrics = () => {
    reactNativeBiometrics.isSensorAvailable().then((resultObject) => {
      const { biometryType } = resultObject;

      if (biometryType === BiometryTypes.Biometrics)
        isBiometricsAvailable(true);
    });
  };

  useEffect(() => {
    checkBiometrics();
  }, []);

  async function handleSubmit() {
    const isPasswordOk = await bcrypt.compareSync(password, encryptedPassword!);

    if (!isPasswordOk)
      return Toast.show({
        type: "error",
        text1: "Erro no login",
        text2: "Senha inválida",
      });

    callback();
    setVisible(false);
  }

  return {
    handleSubmit,
    requestAccess,
    setPassword,
    passwordInputRef,
    biometrics,
    visible,
  };
};

export default useConfirmPasswordState;
