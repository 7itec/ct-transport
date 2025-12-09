import { colors } from "assets/colors";
import { Pressable } from "react-native";
import Animated from "react-native-reanimated";
import styled from "styled-components/native";

interface TextProps {
  size?: number;
  color?: string;
}

interface RowProps {
  gap?: number;
}

interface ButtonProps {
  color?: string;
}

export const Container = styled(Animated.View)`
  border-radius: 10px;
  background-color: white;
  margin: 0 15px;
  overflow: hidden;
`;

export const Header = styled.Pressable`
  padding: 15px;
`;

export const Dropdown = styled(Animated.View)``;

export const Details = styled.View`
  padding: 15px;
  padding-top: 0px;
  gap: 10px;
`;

export const Button = styled(Pressable)<ButtonProps>`
  flex: 1;
  background-color: ${(props) => props.color ?? colors.success};
  padding: 10px 0;
  justify-content: center;
  align-items: center;
`;

export const Attachment = styled(Pressable).attrs({
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

export const Row = styled.Pressable<RowProps>`
  flex-direction: row;
  align-items: center;
  gap: ${(props) => props.gap ?? 0}px;
`;

export const SpaceBetweenRow = styled.Pressable<RowProps>`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  gap: ${(props) => props.gap ?? 0}px;
`;

export const RegularText = styled.Text<TextProps>`
  font-size: ${(props) => props.size ?? 14}px;
  color: ${(props) => props.color ?? "black"};
`;

export const MediumText = styled.Text<TextProps>`
  font-size: ${(props) => props.size ?? 14}px;
  color: ${(props) => props.color ?? "black"};
  font-weight: 600;
`;

export const SemilBoldText = styled.Text<TextProps>`
  font-size: ${(props) => props.size ?? 14}px;
  color: ${(props) => props.color ?? "black"};
  font-weight: 700;
`;
