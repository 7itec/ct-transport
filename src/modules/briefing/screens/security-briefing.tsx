import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useVideoPlayer, VideoView } from "expo-video";
import React from "react";
import styled from "styled-components/native";
import * as ScreenOrientation from "expo-screen-orientation";
import useProfileStorage from "modules/users/storage/use-profile-storage";

const SecurityBriefing: React.FC = () => {
  const { profile } = useProfileStorage();

  const player = useVideoPlayer(
    { uri: profile!.activeSecurityCampaign?.video },
    (player) => {
      player.play();
    }
  );

  return (
    <>
      <StatusBar hidden />
      <Container>
        <CloseButton onPress={router.back}>
          <Ionicons name="close" size={30} color="white" />
        </CloseButton>
        <VideoView
          style={{
            flex: 1,
            paddingBottom: 20,
          }}
          player={player}
          allowsFullscreen
          onFullscreenEnter={async () => {
            if (profile?.activeSecurityCampaign?.orientation === "Landscape")
              await ScreenOrientation.unlockAsync();
          }}
          onFullscreenExit={async () =>
            await ScreenOrientation.lockAsync(
              ScreenOrientation.OrientationLock.PORTRAIT
            )
          }
        />
      </Container>
    </>
  );
};

export default SecurityBriefing;

const Container = styled.View`
  flex: 1;
  background-color: black;
  padding-bottom: 15px;
`;

const CloseButton = styled.Pressable`
  width: 30px;
  height: 30px;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 45px;
  left: 20px;
`;
