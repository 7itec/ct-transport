import { useEffect, useRef, useState } from "react";
import { ActivityIndicator, Dimensions, FlatList } from "react-native";
import { Audio } from "expo-av";
import { Portal } from "@gorhom/portal";
import styled from "styled-components/native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import Row from "components/row";
import millisecondsToMinutesSeconds from "util/milliseconds-to-minutes-seconds";

interface Props {
  url: string;
  onClose: () => void;
}

const AudioPlayer: React.FC<Props> = ({ onClose, url }) => {
  const [wave, setWave] = useState<number[]>(Array.from(Array(28)).fill(3));
  const [timer, setTimer] = useState<number>(0);
  const [duration, setDuration] = useState(0);
  const [sound, setSound] = useState<Audio.Sound>();
  const [isPlaying, setPlaying] = useState(false);
  const [isLoading, setLoading] = useState(true);

  const loadSound = async () => {
    const { sound, status } = await Audio.Sound.createAsync({ uri: url });
    setSound(sound);

    if (status.isLoaded) {
      setDuration(status.durationMillis ?? 0);
    }

    setLoading(false);
  };

  useEffect(() => {
    loadSound();
  }, []);

  async function playSound() {
    if (!sound) return;

    await sound.playAsync();
    sound.setOnPlaybackStatusUpdate((status) => {
      if (!status.isLoaded) return;

      setPlaying(status.isPlaying);
      setTimer(status.positionMillis);
    });
  }

  useEffect(() => {
    return sound
      ? () => {
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  const bottomSheetRef = useRef<BottomSheet>(null);

  return (
    <Portal hostName="audio-recorder">
      <BottomSheet
        backgroundStyle={{ backgroundColor: "transparent" }}
        enableDynamicSizing
        enablePanDownToClose
        handleComponent={null}
        onChange={(index) => {
          if (index === -1) onClose();
        }}
        backdropComponent={(props) => (
          <BottomSheetBackdrop {...{ ...props, disappearsOnIndex: -1 }} />
        )}
        ref={bottomSheetRef}
      >
        <Container>
          <Outer />
          <Inner />
          <Content>
            <DeleteButton>
              {isLoading && <ActivityIndicator color="white" />}
              {!isLoading && (
                <MaterialCommunityIcons
                  color="white"
                  name={isPlaying ? "pause" : "play"}
                  size={30}
                  onPress={playSound}
                />
              )}
            </DeleteButton>
            <Track>
              <Row>
                <RedDot />
                <Timer>
                  {millisecondsToMinutesSeconds(
                    isPlaying ? duration - timer : duration
                  )}
                </Timer>
              </Row>
              <FlatList
                inverted
                horizontal
                data={wave}
                scrollEnabled={false}
                contentContainerStyle={{ gap: 5, alignItems: "center" }}
                renderItem={({ item, index }) => (
                  <Line metering={item} key={index} />
                )}
              />
            </Track>
          </Content>
        </Container>
      </BottomSheet>
    </Portal>
  );
};

export default AudioPlayer;

const WIDTH = Dimensions.get("window").width;
const diameter = WIDTH * 7;

interface LineProps {
  metering: number;
}

export const Container = styled(BottomSheetView)`
  height: 150px;
`;

const Outer = styled.View`
  background-color: #9ca3f7;
  width: ${diameter}px;
  height: ${diameter}px;
  border-radius: ${diameter / 2}px;
  position: absolute;
  top: 0px;
  left: -${(diameter - WIDTH) / 2}px;
  elevation: 150;
`;

const Inner = styled.View`
  background-color: #5965f3;
  width: ${diameter}px;
  height: ${diameter}px;
  border-radius: ${diameter / 2}px;
  position: absolute;
  top: 20px;
  left: -${(diameter - WIDTH) / 2}px;

  justify-content: center;
`;

export const Content = styled.View`
  gap: 10px;
  flex-direction: row;
  position: absolute;
  padding: 15px;
  top: 40px;
  right: 0;
  bottom: 0;
  left: 0;
`;

export const DeleteButton = styled.Pressable`
  width: 50px;
  height: 50px;
  border-radius: 25px;
  background-color: #3c44a7;
  justify-content: center;
  align-items: center;
`;

export const Track = styled.View`
  flex: 1;
  flex-direction: row;
  background-color: #3c44a7;
  height: 50px;
  border-radius: 30px;
  padding: 0 15px;
  align-items: center;
  gap: 10px;
  overflow: hidden;
`;

export const SendButton = styled.Pressable`
  width: 50px;
  height: 50px;
  border-radius: 25px;
  background-color: white;
  justify-content: center;
  align-items: center;
`;

export const RedDot = styled.View`
  width: 5px;
  height: 5px;
  background-color: red;
`;

export const Timer = styled.Text`
  color: white;
  margin-left: 5px;
`;

export const Line = styled.View<LineProps>`
  height: ${(props) => props.metering}px;
  width: 3px;
  background-color: white;
`;

export const ScrollView = styled.ScrollView.attrs({
  horizontal: true,
  contentContainerStyle: { gap: 5 },
})``;
