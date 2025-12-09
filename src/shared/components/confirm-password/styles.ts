import { Ionicons } from "@expo/vector-icons";
import { Pressable } from "react-native";
import styled from "styled-components/native";

export const Container = styled.View`
  background-color: white;
  align-items: center;
  border-radius: 3px;
`;

export const LockIcon = styled(Ionicons).attrs({
  name: "lock-closed",
})`
  color: #37479e;
  font-size: 30px;
  margin-bottom: 15px;
`;

export const Title = styled.Text`
  font-size: 22px;
  color: black;
`;

export const Description = styled.Text`
  font-size: 16px;
  margin-top: 5px;
  width: 80%;
  text-align: center;
  opacity: 0.7;
`;

export const Input = styled.TextInput.attrs({
  selectionColor: "#37479e",
})`
  background-color: rgba(0, 0, 0, 0.05);
  border-bottom-width: 2px;
  border-color: #37479e;
  margin: 30px 0;
  width: 60%;
  text-align: center;
  height: 45px;
  color: black;
`;

export const BiometricsButton = styled(Pressable)`
  margin: 10px 0 10px 0;
  justify-content: center;
  align-items: center;
  flex-direction: row;
  padding: 10px 15px;
`;

export const FingerPrint = styled(Ionicons).attrs({
  name: "finger-print-outline",
})`
  color: #37479e;
  font-size: 20px;
  margin-right: 5px;
`;

export const Text = styled.Text`
  color: #37479e;
`;
