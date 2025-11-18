import styled from "styled-components/native";
import Ionicons from "@expo/vector-icons/Ionicons";
import Pressable from "components/pressable";

export const Option = styled(Pressable)`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 20px;
  height: 60px;
  width: 100%;
`;

export const Circle = styled.View`
  background-color: rgba(228, 233, 237, 1);
  width: 40px;
  height: 40px;
  border-radius: 25px;
  justify-content: center;
  align-items: center;
  margin-right: 10px;
`;

export const ActionIcon = styled(Ionicons)`
  font-size: 22px;
  color: black;
`;

export const ActionText = styled.Text`
  font-size: 16px;
  color: black;
`;
