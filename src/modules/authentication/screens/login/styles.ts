import { colors } from "assets/colors";
import { SafeAreaView } from "react-native-safe-area-context";
import styled from "styled-components/native";

export const Container = styled(SafeAreaView)`
  flex: 1;
`;

export const LogoBox = styled.View`
  background-color: ${colors.primary};
  height: 170px;
  margin-bottom: 100px;
`;

export const Line = styled.View`
  background-color: ${colors.primary};
  width: 120%;
  height: 100px;
  position: absolute;
  transform: rotate(10deg);
  top: 130px;
`;

export const Logo = styled.Image`
  width: 100px;
  height: 100px;
  resize-mode: contain;
  align-self: center;
  margin-bottom: 25px;
  position: absolute;
  top: 50px;
`;

export const Form = styled.View`
  padding: 0 25px;
  gap: 10px;
`;

export const Title = styled.Text`
  color: black;
  font-weight: bold;
  font-size: 32px;
`;

export const Label = styled.Text`
  color: black;
`;

export const Input = styled.TextInput`
  background-color: white;
  height: 45px;
  border: 1px;
  border-color: rgba(0, 0, 0, 0.2);
  border-radius: 3px;
  padding: 0 10px;
  color: black;
`;

export const Expanded = styled.View`
  flex: 1;
`;

export const Version = styled.Text`
  width: 100%;
  text-align: center;
  font-size: 16px;
`;
