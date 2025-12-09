import { Pressable } from "react-native";
import styled from "styled-components/native";

interface TextProps {
  size?: number;
  color?: string;
}

export const Button = styled(Pressable).attrs({
  android_ripple: {
    color: "rgba(128, 128, 128, .2)",
    borderless: false,
    radius: 32,
  },
})`
  border-radius: 15px;
  padding: 5px 10px;
  background-color: rgba(128, 128, 128, 0.4);
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 5px;
  margin-right: 5px;
`;

export const RegularText = styled.Text<TextProps>`
  font-size: ${(props) => props.size ?? 14}px;
  color: ${(props) => props.color ?? "black"};
`;
