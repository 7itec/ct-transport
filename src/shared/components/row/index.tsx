import React from "react";
import { PressableProps } from "react-native";

import { PressableContainer, ViewContainer } from "./styles";

interface Props extends PressableProps {
  gap?: number;
  alignItems?: "center" | "flex-start" | "flex-end";
  justifyContent?: "center" | "flex-start" | "flex-end" | "space-between";
  backgroundColor?: string;
  children?: React.ReactNode;
}

const Row: React.FC<Props> = ({ children, onPress, ...props }) => {
  if (onPress)
    return (
      <PressableContainer {...{ ...props, onPress }}>
        {children}
      </PressableContainer>
    );

  return <ViewContainer {...props}>{children}</ViewContainer>;
};

export default Row;
