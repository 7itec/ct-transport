import styled from "styled-components/native";

interface ContainerProps {
  backgroundColor: string;
  fitContent: boolean;
}

interface LabelProps {
  textColor: string;
}

export const Container = styled.Pressable<ContainerProps>`
  width: ${(props) => (props.fitContent ? "100%" : undefined)};
  height: 40px;
  background-color: ${(props) => props.backgroundColor};
  justify-content: center;
  align-items: center;
  border-radius: 5px;
  padding: 0 15px;
`;

export const Label = styled.Text<LabelProps>`
  color: ${(props) => props.textColor};
`;
