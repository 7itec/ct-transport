import Pressable from "components/pressable";
import { SafeAreaView } from "react-native-safe-area-context";
import styled from "styled-components/native";

export const Container = styled(SafeAreaView)`
  background-color: white;
  padding: 15px;
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
`;

export const BackButton = styled(Pressable)`
  margin-left: -5px;
`;

export const TextInput = styled.TextInput`
  height: 150px;
  border: 1px solid #333;
  border-radius: 5px;
  text-align-vertical: top;
  padding: 10px;
  color: black;
`;
