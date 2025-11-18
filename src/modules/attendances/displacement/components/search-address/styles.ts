import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet } from "react-native";
import styled from "styled-components/native";

export const Container = styled.View`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: white;
`;

export const Row = styled.View`
  flex-direction: row;
  border-bottom-width: 0.5px;
  border-color: rgba(128, 128, 128, 0.4);
  background-color: white;
  elevation: 4;
  align-items: center;
  padding: 0 15px;
  padding-bottom: 15px;
`;

export const BackButton = styled(Pressable)`
  width: 50px;
  height: 50px;
  justify-content: center;
  align-items: center;
`;

export const BackIcon = styled(Ionicons)`
  color: black;
  font-size: 22px;
`;

export const Input = styled.TextInput`
  flex: 1;
  padding: 0 10px;
  font-size: 18px;
`;

export const Address = styled(Pressable)`
  flex-direction: row;
  align-items: center;
  padding: 20px 15px;
  width: 100%;
  border-bottom-width: ${StyleSheet.hairlineWidth}px;
  border-color: rgba(128, 128, 128, 0.4);
`;

export const AddressName = styled.Text`
  max-width: 80%;
`;

export const AddressIcon = styled(Ionicons)`
  color: #999;
  font-size: 22px;
  margin-right: 15px;
`;
