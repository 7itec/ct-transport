import React, { useEffect, useRef, useState } from "react";
import bcrypt from "bcrypt-react-native";

import { Alert, Pressable, TextInput } from "react-native";
import InputGroup from "components/input-group";
import Button from "components/button";
import Biometrics from "react-native-biometrics";
import Toast from "react-native-toast-message";

import styled from "styled-components/native";
import Icon from "@expo/vector-icons/Ionicons";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "assets/colors";
import { nativeBuildVersion } from "expo-application";
import usePassword from "../storage/use-password";
import useSession from "../storage/use-session";
import { MediumText, RegularText } from "components/text";
import Expanded from "components/expanded";
import Column from "components/column";
import useLogout from "../hooks/use-logout";
import { router } from "expo-router";
import useLogs from "hooks/use-logs";
import useProfileStorage from "modules/users/storage/use-profile-storage";

const RenewSession: React.FC = () => {
  const passwordInputRef = useRef<TextInput>(null);
  const biometrics = new Biometrics();

  const [password, setPassword] = useState<string>("");

  const { startSession } = useSession();
  const { encryptedPassword } = usePassword();

  const { profile } = useProfileStorage();
  const logout = useLogout();
  const trackEvent = useLogs();

  function requestAccess() {
    biometrics
      .simplePrompt({
        promptMessage: "Confirmar digital",
        cancelButtonText: "usar senha",
      })
      .then(async (resultObject) => {
        const { success } = resultObject;

        if (success) {
          trackEvent("Renew Session", { renewType: "Biometrics" });
          startSession();
          router.replace("/");
        }

        setTimeout(() => passwordInputRef.current?.focus(), 400);
      })
      .catch(() => console.log("biometrics failed"));
  }

  useEffect(() => {
    biometrics.isSensorAvailable().then(() => {
      requestAccess();
    });
  }, []);

  const handleSartSession = async () => {
    const isPasswordOk = await bcrypt.compareSync(password, encryptedPassword!);
    if (!isPasswordOk)
      return Toast.show({
        type: "error",
        text1: "Erro no login",
        text2: "Senha inválida",
      });
    trackEvent("Renew Session", { renewType: "Password" });
    startSession();
    router.replace("/");
  };

  const confirmUserLogout = () => {
    Alert.alert(
      "Trocar de usuário",
      "Você só poderá entrar novamente conectado a internet, deseja realmente sair do seu usuário?",
      [
        {
          text: "cancelar",
          style: "destructive",
        },
        {
          text: "sair",
          onPress: logout,
        },
      ]
    );
  };

  return (
    <Container edges={["bottom"]}>
      <LockIcon />
      <RegularText size="extra-large">Acesse sua conta</RegularText>
      <RegularText>Desbloqueie o app com sua digital ou senha</RegularText>
      <Form>
        <ProfileCard>
          <AvatarBox>
            {profile?.avatar ? (
              <Avatar source={{ uri: profile.avatar }} />
            ) : (
              <EmptyAvatar />
            )}
          </AvatarBox>
          <DriverInfo>
            <RegularText size="small">ID: #{profile?.driverId}</RegularText>
            <MediumText numberOfLines={1}>{profile?.driverName}</MediumText>
          </DriverInfo>
          <Pressable onPress={confirmUserLogout}>
            <LogoutIcon />
          </Pressable>
        </ProfileCard>
        <Column gap={15}>
          <InputGroup
            label="Senha"
            secureTextEntry
            onChangeText={setPassword}
            onSubmitEditing={handleSartSession}
            ref={passwordInputRef}
            border
          />
          <Button label="Entrar" onPress={handleSartSession} />
        </Column>
      </Form>
      <Expanded />
      <RegularText>{nativeBuildVersion}</RegularText>
    </Container>
  );
};

export default RenewSession;

export const Container = styled(SafeAreaView)`
  background-color: white;
  flex: 1;
  padding-top: 80px;
  align-items: center;
  padding-bottom: 15px;
  width: 100%;
`;

export const LockIcon = styled(Icon).attrs({
  name: "lock-closed",
})`
  color: ${colors.primary};
  font-size: 30px;
  margin-bottom: 15px;
  text-align: center;
`;

export const Form = styled.View`
  width: 80%;
`;

export const ProfileCard = styled.View`
  border-radius: 5px;
  elevation: 3;
  padding: 15px;
  background: white;
  width: 100%;
  margin-top: 70px;

  flex-direction: row;
  align-items: center;
  margin-bottom: 10px;
`;

export const AvatarBox = styled.View`
  width: 40px;
  height: 40px;
  border-radius: 75px;
  border-width: 1px;
  border-color: ${colors.primary};
  justify-content: center;
  align-items: center;
  background-color: rgba(228, 233, 237, 1);
  overflow: hidden;
  margin-right: 15px;
`;

export const Avatar = styled.Image.attrs({
  resizeMode: "cover",
})`
  width: 100%;
  height: 100%;
  border-radius: 20px;
`;

export const EmptyAvatar = styled(Icon).attrs({ name: "person" })`
  font-size: 40px;
`;

export const DriverInfo = styled.View`
  flex: 1;
  margin-right: 10px;
`;

export const LogoutIcon = styled(Icon).attrs({ name: "exit" })`
  font-size: 26px;
  color: ${colors.primary};
`;
