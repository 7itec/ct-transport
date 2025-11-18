import React, { useEffect, useRef, useState } from "react";
import { CameraView } from "expo-camera";
import Ionicons from "@expo/vector-icons/Ionicons";

import { StatusBar } from "expo-status-bar";
import {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { Vibration } from "react-native";

import {
  Container,
  CloseButton,
  TakeShot,
  InnerCircle,
  Picture,
  Row,
  Button,
} from "./styles";
import Regular from "components/text/variants/regular";

interface Props {
  onClose: () => void;
  onConfirm: (text: string) => void;
}

const Camera: React.FC<Props> = ({ onClose, onConfirm }) => {
  const [showCamera, setShowCamera] = useState(false);
  const animation = useSharedValue(1);
  const cameraRef = useRef<CameraView>(null);
  const [image, setImage] = useState<string>();

  useEffect(() => {
    const timeout = setTimeout(() => setShowCamera(true), 200);

    return () => clearTimeout(timeout);
  }, []);

  const styles = useAnimatedStyle(() => ({
    transform: [{ scale: animation.value }],
  }));

  const vibrate = () => {
    Vibration.vibrate(50);
  };

  const handleImage = async () => {
    animation.value = withTiming(1.2, { duration: 200 }, () => {
      runOnJS(vibrate)();
    });
    const response = await cameraRef.current?.takePictureAsync();

    animation.value = 1;
    if (!response) return;
    setImage(response.uri);
  };

  const handleSubmit = () => {
    onClose();
    onConfirm(image!);
  };

  return (
    <Container>
      <StatusBar hidden />
      {showCamera && !image && (
        <CameraView style={{ flex: 1 }} ref={cameraRef} />
      )}
      {image && <Picture source={{ uri: image }} />}
      <CloseButton onPress={onClose}>
        <Ionicons name="close" size={30} color="white" />
      </CloseButton>
      {!image && (
        <TakeShot style={styles} onPress={handleImage}>
          <InnerCircle />
        </TakeShot>
      )}
      {image && (
        <Row>
          <Button onPress={() => setImage(undefined)}>
            <Regular size="large" color="white">
              Repetir
            </Regular>
          </Button>
          <Button onPress={handleSubmit}>
            <Regular size="large" color="white">
              Ok
            </Regular>
          </Button>
        </Row>
      )}
    </Container>
  );
};

export default Camera;
