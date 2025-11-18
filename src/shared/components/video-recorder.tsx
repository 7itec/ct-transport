import React, { useEffect, useRef, useState } from "react";
import {
  CameraView,
  useCameraPermissions,
  useMicrophonePermissions,
} from "expo-camera";
import Ionicons from "@expo/vector-icons/Ionicons";
import { impactAsync, ImpactFeedbackStyle } from "expo-haptics";

import { StatusBar } from "expo-status-bar";
import {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { Dimensions, Pressable as RNPressable } from "react-native";
import Animated from "react-native-reanimated";
import styled from "styled-components/native";

import { Portal } from "@gorhom/portal";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import millisecondsToMinutesSeconds from "util/milliseconds-to-minutes-seconds";
import Toast from "react-native-toast-message";

interface Props {
  onSubmit: (uri: string) => void;
  onClose: () => void;
}

const VideoRecorder: React.FC<Props> = ({ onSubmit, onClose }) => {
  const [cameraReady, setCameraReady] = useState(false);
  const [count, setCount] = useState<number>();
  const [isRecording, setRecording] = useState(false);
  const animation = useSharedValue(0);
  const cameraRef = useRef<CameraView>(null);
  const [, requestPermission] = useCameraPermissions();
  const microphonePermissions = useMicrophonePermissions();
  const { top } = useSafeAreaInsets();

  useEffect(() => {
    requestPermission();
    microphonePermissions[1]();

    const timeout = setTimeout(() => setCameraReady(true), 200);

    return () => clearTimeout(timeout);
  }, []);

  const styles = useAnimatedStyle(() => ({
    width: interpolate(animation.value, [0, 1], [50, 30]),
    height: interpolate(animation.value, [0, 1], [50, 30]),
    borderRadius: interpolate(animation.value, [0, 1], [25, 4]),
  }));

  const vibrate = () => {
    impactAsync(ImpactFeedbackStyle.Medium);
  };

  const handleRecordVideo = async () => {
    try {
      vibrate();
      animation.value = withTiming(1);
      setInterval(() => setCount((prev) => (prev ?? 0) + 1), 1000);
      setRecording(true);
      const response = await cameraRef.current?.recordAsync();

      onSubmit(response?.uri!);
      onClose();
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Erro ao gravar vídeo",
        text2: error as any,
      });
    }
  };

  const handleStopRecording = async () => {
    vibrate();
    await cameraRef.current?.stopRecording();
  };

  return (
    <Portal>
      <Container style={{ paddingTop: top }}>
        <StatusBar hidden />
        {cameraReady && (
          <CameraView
            mode="video"
            ref={cameraRef}
            videoQuality="480p"
            style={{ flex: 1 }}
          />
        )}
        <TakeShot
          onPress={() =>
            isRecording ? handleStopRecording() : handleRecordVideo()
          }
        >
          <InnerCircle style={styles} />
        </TakeShot>
        {count && (
          <Counter {...{ top: top + 10 }}>
            <Count>{millisecondsToMinutesSeconds(count * 1000)}</Count>
          </Counter>
        )}
      </Container>
      <CloseButton onPress={onClose}>
        <Ionicons name="close" size={30} color="white" />
      </CloseButton>
    </Portal>
  );
};

export default VideoRecorder;

const { width } = Dimensions.get("window");

interface CounterProps {
  top: number;
}

const Container = styled.View`
  background-color: black;
  padding-bottom: 100px;
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
`;

const CloseButton = styled(RNPressable)`
  position: absolute;
  top: 45px;
  left: 15px;
`;

const TakeShot = styled.Pressable`
  border: 3px solid white;
  width: 70px;
  height: 70px;
  border-radius: 40px;
  position: absolute;
  left: ${Dimensions.get("screen").width / 2 - 35}px;
  bottom: ${100 + 15}px;
  justify-content: center;
  align-items: center;
`;

const InnerCircle = styled(Animated.View)`
  background: red;
`;

const Counter = styled.View<CounterProps>`
  position: absolute;
  background-color: red;
  padding: 5px;
  width: 50px;
  top: ${(props) => props.top + 30}px;
  left: ${(width - 50) / 2}px;
  border-radius: 3px;
`;

const Count = styled.Text`
  color: white;
  text-align: center;
`;
