import React from "react";

import { colors } from "assets/colors";
import Loading from "components/loading";

import { Container, Label } from "./styles";
import { StyleProp, ViewStyle } from "react-native";

export interface ButtonProps {
  label: React.ReactElement | string;
  onPress?: () => void;
  isLoading?: boolean;
  backgroundColor?: keyof typeof colors;
  textColor?: string;
  enabled?: boolean;
  fitContent?: boolean;
  style?: StyleProp<ViewStyle>;
}

const Button: React.FC<ButtonProps> = ({
  label,
  onPress,
  isLoading,
  backgroundColor = "primary",
  textColor = "white",
  enabled = undefined,
  fitContent = true,
  style,
}) => {
  function shouldBeEnabled() {
    if (enabled !== undefined) return enabled;
    return !isLoading;
  }

  return (
    <Container
      {...{
        fitContent,
        onPress,
        enabled: shouldBeEnabled(),
        backgroundColor: colors[backgroundColor],
        style,
      }}
    >
      {isLoading ? (
        <Loading color="white" />
      ) : (
        <Label {...{ textColor }}>{label}</Label>
      )}
    </Container>
  );
};

export default Button;
