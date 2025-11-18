import { StatusBar } from "expo-status-bar";
import { useVideoPlayer, VideoView } from "expo-video";
import { Pressable } from "react-native";
import styled from "styled-components/native";
import { Portal } from "@gorhom/portal";
import { Ionicons } from "@expo/vector-icons";

interface Props {
  url: string;
  onClose: () => void;
}

const VideoPlayer: React.FC<Props> = ({ url, onClose }) => {
  const player = useVideoPlayer({ uri: url }, (player) => {
    player.play();
  });

  return (
    <Portal>
      <StatusBar hidden />
      <Container>
        <CloseButton onPress={onClose}>
          <Ionicons name="close" size={30} color="white" />
        </CloseButton>
        <VideoView
          style={{
            flex: 1,
          }}
          player={player}
          allowsFullscreen
        />
      </Container>
    </Portal>
  );
};

export default VideoPlayer;

const Container = styled.View`
  background-color: black;
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
`;

const CloseButton = styled(Pressable)`
  z-index: 1000;
  position: absolute;
  margin-top: 40px;
  left: 15px;
`;
