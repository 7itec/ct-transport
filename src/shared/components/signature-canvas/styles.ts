import { BorderlessButton } from "react-native-gesture-handler";
import styled from "styled-components/native";
import { Dimensions, Pressable } from "react-native";
import Constants from "expo-constants";
import Button from "components/button";

const { width, height } = Dimensions.get("window");

export const CanvasContainer = styled.View`
  position: absolute;
  padding: 15px;
  background-color: white;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  justify-content: center;
  align-items: center;

  width: ${width}px;
  height: ${height}px;
  background-color: red;
`;

export const ToolBar = styled.View`
  flex: 1;
  width: 100%;
  flex-direction: row;
  justify-content: space-between;
`;

export const ToolBarButton = styled(BorderlessButton)`
  justify-content: center;
  align-items: center;
  width: 50px;
  height: 50px;
`;

export const ToolBarRippleButton = styled(Pressable)`
  justify-content: center;
  align-items: center;
  padding: 0 10px;
`;

export const ToolBarText = styled.Text``;

export const CanvasForm = styled.View`
  width: ${height - Constants.statusBarHeight}px;
  height: ${width}px;
  background-color: white;
  transform: rotate(90deg);
  justify-content: center;
  align-items: center;
  padding: 15px;
  margin-top: ${Constants.statusBarHeight}px;
`;

export const Canva = styled.View`
  width: ${height - Constants.statusBarHeight}px;
  height: ${width - 160}px;
  margin-bottom: 30px;
  padding: 0 15px;
`;

export const ConfirmSignatureButton = styled(Button)`
  height: 50px;
`;
