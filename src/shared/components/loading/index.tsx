import React from "react";
import { ActivityIndicator } from "react-native";
import { Container } from "./styles";
import { colors } from "assets/colors";

interface Props {
  flex?: boolean;
  color?: keyof typeof colors;
  size?: number;
}

const Loading: React.FC<Props> = ({
  flex = true,
  color = "primary",
  size = 26,
}) => {
  if (flex)
    return (
      <Container>
        <ActivityIndicator size={size} {...{ color: colors[color] }} />
      </Container>
    );

  return <ActivityIndicator size={size} {...{ color: colors[color] }} />;
};

export default Loading;
