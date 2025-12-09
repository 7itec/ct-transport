import { appStoreBanner, googlePlayBanner } from "assets/images";
import Button from "components/button";
import { RegularText, SemilBoldText } from "components/text";
import { Stack } from "expo-router";
import useMinVersion from "hooks/use-min-version";
import React from "react";
import { Linking, Platform, View } from "react-native";
import styled from "styled-components/native";

const ForceUpdate: React.FC = () => {
  const { data } = useMinVersion();

  const handleOpenStore = () =>
    Linking.openURL(
      Platform.OS === "android" ? data.androidUpdateUrl : data.iosUpdateUrl
    );

  return (
    <Container>
      <Image
        source={Platform.OS === "android" ? googlePlayBanner : appStoreBanner}
      />
      <SemilBoldText size="extra-large">Atualização necessária</SemilBoldText>
      <RegularText size="medium" style={{ marginBottom: 30 }}>
        Uma nova versão do aplicativo está disponível. Atualize agora para
        continuar usando.
      </RegularText>
      <Button label="Atualizar" onPress={handleOpenStore} />
      <Stack.Screen options={{ headerShown: false }} />
    </Container>
  );
};

export default ForceUpdate;

const Container = styled.View`
  flex: 1;
  align-items: flex-start;
  background-color: white;
  padding: 25px;
  padding-top: 100px;
  gap: 10px;
`;

const Image = styled.Image`
  width: 200px;
  height: 200px;
  align-self: center;
  object-fit: contain;
  margin-bottom: 50px;
`;
