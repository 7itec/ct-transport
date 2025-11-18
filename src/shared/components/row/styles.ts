import styled from "styled-components/native";

interface ContainerProps {
  gap?: number;
  alignItems?: "center" | "flex-start" | "flex-end";
  justifyContent?: "center" | "flex-start" | "flex-end" | "space-between";
}

export const ViewContainer = styled.View<ContainerProps>`
  flex-direction: row;
  gap: ${(props) => props.gap}px;
  align-items: ${(props) => props.alignItems ?? "center"};
  justify-content: ${(props) => props.justifyContent ?? "flex-start"};
`;

export const PressableContainer = styled.Pressable<ContainerProps>`
  flex-direction: row;
  gap: ${(props) => props.gap}px;
  align-items: ${(props) => props.alignItems ?? "center"};
  justify-content: ${(props) => props.justifyContent ?? "flex-start"};
`;
