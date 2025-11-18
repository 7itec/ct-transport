import Pressable from "components/pressable";
import { Dimensions, Pressable as RNPressable } from "react-native";
import Animated from "react-native-reanimated";
import styled from "styled-components/native";

const AnimatedPressable = Animated.createAnimatedComponent(RNPressable);

export const Container = styled.View`
  background-color: black;
  padding-top: 15px;
  padding-bottom: 100px;
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
`;

export const CloseButton = styled(RNPressable)`
  position: absolute;
  top: 30px;
  left: 15px;
`;

export const TakeShot = styled(AnimatedPressable)`
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

export const InnerCircle = styled.View`
  background: white;
  width: 50px;
  height: 50px;
  border-radius: 25px;
`;

export const Picture = styled.Image`
  width: 100%;
  height: 100%;
`;

export const Row = styled.View`
  flex-direction: row;
  position: absolute;
  bottom: 30px;
  padding: 0 30px;
`;

export const Button = styled(Pressable).attrs({
  android_ripple: {
    color: "rgba(128, 128, 128, .2)",
    borderless: false,
    foreground: true,
  },
})`
  border-radius: 30px;
  flex: 1;
  justify-content: center;
  align-items: center;
  padding: 10px;
  border-radius: 15px;
  overflow: hidden;
`;
