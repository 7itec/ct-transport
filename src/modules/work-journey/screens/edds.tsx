import { StatusBar } from "expo-status-bar";
import { useVideoPlayer, VideoView } from "expo-video";
import { Pressable } from "react-native";
import styled from "styled-components/native";
import * as ScreenOrientation from "expo-screen-orientation";
import { useEffect, useRef, useState } from "react";
import useCurrentWorkJourney from "modules/work-journey/hooks/use-current-work-journey";
import useFinishCampaign from "modules/work-journey/hooks/use-finish-campaign";
import { RegularText } from "components/text";
import Loading from "components/loading";

const Edds: React.FC = () => {
  const { data } = useCurrentWorkJourney();
  const finishCampaignMutation = useFinishCampaign(data?.pendingCampaign?._id!);

  const [isFinished, setFinished] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const videoRef = useRef<VideoView>(null);

  const player = useVideoPlayer(
    { uri: data?.pendingCampaign?.video },
    (player) => {
      player.play();
    }
  );

  const onFullscreenUpdate = async () => {
    if (data?.pendingCampaign?.orientation === "Landscape")
      await ScreenOrientation.lockAsync(
        ScreenOrientation.OrientationLock.LANDSCAPE
      );
    setShowVideo(true);
    videoRef.current?.enterFullscreen();
  };

  useEffect(() => {
    player.addListener("statusChange", (data) =>
      setFinished(data.status === "idle")
    );
  }, []);

  useEffect(() => {
    if (data && !showVideo) onFullscreenUpdate();
  }, [data]);

  return (
    <>
      <StatusBar hidden translucent />
      <Container>
        {showVideo && (
          <VideoView
            style={{
              flex: 1,
              marginBottom: 15,
            }}
            ref={videoRef}
            contentFit="contain"
            allowsFullscreen
            nativeControls={false}
            {...{ player }}
          />
        )}
        <FinishButton onPress={() => finishCampaignMutation.mutate()}>
          <RegularText color="white">
            {!finishCampaignMutation.isLoading && isFinished && "Finalizar"}
            {!finishCampaignMutation.isLoading && !isFinished && "Aguarde"}
            {finishCampaignMutation.isLoading && (
              <Loading size={18} color="white" />
            )}
          </RegularText>
        </FinishButton>
      </Container>
    </>
  );
};

export default Edds;

const Container = styled.View`
  background-color: black;
  flex: 1;
`;

const FinishButton = styled(Pressable)`
  z-index: 1000;
  position: absolute;
  right: 30px;
  bottom: 100px;
  border-width: 1px;
  border-color: white;
  padding: 10px 15px;
  border-radius: 4px;
`;
