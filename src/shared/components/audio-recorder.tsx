import { useEffect, useRef, useState } from "react";
import { Dimensions, FlatList } from "react-native";
import { Audio } from "expo-av";
import { Portal } from "@gorhom/portal";
import styled from "styled-components/native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import Row from "components/row";
import { impactAsync, ImpactFeedbackStyle } from "expo-haptics";
import linearInterpolate from "util/linear-interpolate";
import millisecondsToMinutesSeconds from "util/milliseconds-to-minutes-seconds";

interface Props {
  onSubmit: (uri: string) => void;
  onClose: () => void;
}

const AudioRecorder: React.FC<Props> = ({ onClose, onSubmit }) => {
  const [recording, setRecording] = useState<Audio.Recording>();
  const [permissionResponse, requestPermission] = Audio.usePermissions();
  const [wave, setWave] = useState<number[]>([]);
  const [timer, setTimer] = useState<number>(0);

  useEffect(() => {
    if (!recording) startRecording();
  }, []);

  const onRecordingUpdate = ({
    metering,
    durationMillis,
  }: Audio.RecordingStatus) => {
    setTimer(durationMillis);
    if (!metering) return;

    const height = Math.max(
      linearInterpolate(Math.abs(metering), 3, 20, 50, 0),
      3
    );
    setWave((prev) => [height, ...prev]);
  };

  async function startRecording() {
    try {
      if (permissionResponse?.status !== "granted") await requestPermission();

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      impactAsync(ImpactFeedbackStyle.Medium);
      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      setRecording(recording);
      recording.setOnRecordingStatusUpdate(onRecordingUpdate);
    } catch (err) {
      console.error("Failed to start recording", err);
    }
  }

  async function stopRecording() {
    setRecording(undefined);
    await recording!.stopAndUnloadAsync();
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
    });
    const uri = recording!.getURI();
    onSubmit(uri!);
    impactAsync(ImpactFeedbackStyle.Medium);
    onClose();
  }

  const handleOnClose = () => {
    onClose();
    recording!.stopAndUnloadAsync();
  };

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
            <DeleteButton onPress={handleOnClose}>
              <MaterialCommunityIcons color="white" name="delete" size={30} />
            </DeleteButton>
            <Track>
              <Row>
                <RedDot />
                <Timer>{millisecondsToMinutesSeconds(timer)}</Timer>
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
            <SendButton onPress={stopRecording}>
              <MaterialCommunityIcons name="send" size={26} />
            </SendButton>
          </Content>
        </Container>
      </BottomSheet>
    </Portal>
  );
};

export default AudioRecorder;

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
  top: 30px;
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
