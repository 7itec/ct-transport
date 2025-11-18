import React from "react";
import styled from "styled-components/native";
import { RegularText } from "./text";

interface Props {
  text: string | React.ReactNode;
  backgroundColor: string;
}

const StatusButton: React.FC<Props> = ({ text, backgroundColor }) => {
  return (
    <Container {...{ backgroundColor }}>
      <RegularText color="white" size="small">
        {text}
      </RegularText>
    </Container>
  );
};

export default StatusButton;

interface ContainerProps {
  backgroundColor: string;
}

const Container = styled.View<ContainerProps>`
  padding: 0 10px;
  height: 27px;
  background-color: ${(props) => props.backgroundColor};
  border-radius: 4px;
  align-self: flex-start;
  justify-content: center;
`;
