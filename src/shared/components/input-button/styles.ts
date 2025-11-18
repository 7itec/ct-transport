import { colors } from "assets/colors";
import styled from "styled-components/native";

interface Props {
  border?: boolean;
}

export const InputGroup = styled.View`
  margin-top: 10px;
  border-radius: 3px;
  ${(props: Props) =>
    props.border &&
    ` 
      border-bottom-width: 4px;
      border-color: ${colors.primary};
    `}
`;

export const Label = styled.Text`
  color: ${colors.primary};

  font-size: 16px;
  margin-bottom: 5px;
`;

export const Input = styled.Text`
  background-color: #f5f6fa;
  padding: 10px;
  font-size: 16px;
  border-radius: 3px;
  color: black;
  height: 45px;
`;
