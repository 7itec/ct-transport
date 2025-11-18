import styled from "styled-components/native";
import Ionicons from "@expo/vector-icons/Ionicons";

export const Container = styled.View``;

export const Option = styled.Pressable`
  flex-direction: row;
  align-items: center;
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
  margin-right: 20px;
`;

export const ActionIcon = styled(Ionicons)`
  font-size: 22px;
  color: black;
`;

export const Info = styled.View`
  max-width: 70%;
`;

export const ActionText = styled.Text`
  font-size: 16px;
  color: black;
`;

export const DescriptionText = styled.Text`
  font-size: 14px;
  margin-top: 3px;
  color: black;
`;

export const Header = styled.View`
  flex-direction: row;
  align-items: center;
  padding: 0 15px;
  border-bottom-width: 1px;
  border-color: rgba(128, 128, 128, 0.4);
`;

export const Input = styled.TextInput`
  color: black;
  font-size: 16px;
  padding-left: 10px;
`;

export const Loading = styled.View`
  flex: 1;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
`;
