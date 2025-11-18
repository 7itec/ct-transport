import React from "react";
import Ionicons from "@expo/vector-icons/Ionicons";

import { colors } from "assets/colors";
import { StatusBar } from "expo-status-bar";
import { RefreshControl } from "react-native";
import Loading from "components/loading";

import { BoldText, RegularText } from "components/text";

import dateFnsHelpers from "util/date-fns-helpers";
import { Stack } from "expo-router";
import styled from "styled-components/native";
import useCurrentWorkJourney from "modules/work-journey/hooks/use-current-work-journey";
import {
  launchImageLibraryAsync,
  PermissionStatus,
  requestMediaLibraryPermissionsAsync,
} from "expo-image-picker";
import Toast from "react-native-toast-message";
import useUpdateAvatar from "../hooks/use-update-avatar";
import TitleBar from "components/title-bar";

const Profile: React.FC = () => {
  const { data, isLoading, refetch, isRefetching } = useCurrentWorkJourney();
  const updateAvatarMutation = useUpdateAvatar();

  const handleGetAvatar = async () => {
    const { status } = await requestMediaLibraryPermissionsAsync();

    if (status !== PermissionStatus.GRANTED)
      return Toast.show({
        type: "error",
        text1: "Erro ao abrir galeria",
        text2: "Permissão não concedida",
      });

    const { assets } = await launchImageLibraryAsync();

    if (!assets) return;

    updateAvatarMutation.mutate(assets[0].uri);
  };

  if (isLoading || !data?.currentWorkJourney) return <Loading />;

  return (
    <>
      <Container
        refreshControl={
          <RefreshControl refreshing={isRefetching} onRefresh={refetch} />
        }
      >
        <StatusBar translucent />
        <Header>
          <Avatar>
            {!data?.avatar && (
              <Ionicons name="person" size={26} color={colors.primary} />
            )}
            {data?.avatar && <AvatarImage source={{ uri: data.avatar }} />}
            <ChangeAvatar onPress={handleGetAvatar}>
              {!updateAvatarMutation.isLoading && (
                <Ionicons name="create" size={16} />
              )}
              {updateAvatarMutation.isLoading && <Loading size={16} />}
            </ChangeAvatar>
          </Avatar>
        </Header>
        <Content>
          <Card>
            <BoldText size="medium">{data?.driverName}</BoldText>
            <RegularText size="small">{data?.companyName}</RegularText>
          </Card>
          <Card>
            <RegularText color="gray" size="small">
              Grupo
            </RegularText>
            <RegularText>{data?.group?.name}</RegularText>
          </Card>
          <Card>
            <RegularText color="gray" size="small">
              Início da jornada
            </RegularText>
            <RegularText>
              {data?.currentWorkJourney?.registrationDate &&
                dateFnsHelpers.defaultFormat(
                  data.currentWorkJourney.registrationDate
                )}
            </RegularText>
          </Card>
        </Content>
      </Container>
      <Stack.Screen options={{ headerShown: true, title: "Meus dados" }} />
    </>
  );
};

export default Profile;

const Container = styled.ScrollView`
  background-color: "#f1f0f5";
`;

const Header = styled.View`
  height: 120px;
  background-color: #959096;
  margin-bottom: 35px;
`;

const Avatar = styled.View`
  width: 70px;
  height: 70px;
  border-radius: 35px;
  background-color: #f1f0f5;
  position: absolute;
  bottom: -35px;
  left: 15px;
  border-width: 4px;
  border-color: white;
  justify-content: center;
  align-items: center;
  elevation: 1;
`;

const Content = styled.View`
  flex: 1;
  padding: 15px;
  gap: 15px;
`;

const Card = styled.Pressable`
  padding: 15px;
  border-radius: 10px;
  background-color: white;
  width: 100%;
`;

const AvatarImage = styled.Image`
  width: 64px;
  height: 64px;
  border-radius: 32px;
  resize-mode: cover;
`;

const ChangeAvatar = styled.Pressable`
  width: 25px;
  height: 25px;
  border-radius: 15px;
  background-color: white;
  position: absolute;
  bottom: -3px;
  right: -3px;
  justify-content: center;
  align-items: center;
  elevation: 1;
`;
