import React from "react";
import { PressableProps } from "react-native";

import { ViewContainer, PressableContainer } from "./styles";

interface Props extends PressableProps {
  gap?: number;
  alignItems?: "center" | "flex-start" | "flex-end";
  justifyContent?: "center" | "flex-start" | "flex-end" | "space-between";
  children?: React.ReactNode;
}

const Column: React.FC<Props> = ({ children, ...props }) => {
  if (typeof children === "string") console.log("TESTE", children);
  if (!props.onPress)
    return <ViewContainer {...props}>{children}</ViewContainer>;
  return <PressableContainer {...props}>{children}</PressableContainer>;
};

export default Column;
