import styled from "styled-components/native";

import Ionicons from "@expo/vector-icons/Ionicons";
import { SafeAreaView } from "react-native-safe-area-context";

export const Container = styled(SafeAreaView)`
  flex: 1;
  background-color: white;
`;

export const Header = styled.View`
  width: 100%;
  height: 70px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  gap: 15px;
  padding: 15px;
`;

export const Icon = styled(Ionicons)``;

export const SearchBox = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  background-color: rgba(228, 233, 237, 1);
  flex: 1;
  height: 100%;
  border-radius: 30px;
  padding: 0 15px;
`;

export const Input = styled.TextInput.attrs({
  placeholderTextColor: "rgba(0, 0, 0, .4)",
})`
  flex: 1;
  color: black;
`;

export const SubTitle = styled.Text`
  padding: 0 15px 0 15px;
`;
