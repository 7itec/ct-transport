import {colors} from 'assets/colors';
import styled from 'styled-components/native';

interface Props {
  border?: boolean;
  multiline?: boolean;
}

export const Container = styled.View`
  margin-top: 10px;
`;

export const Label = styled.Text`
  color: ${colors.primary};

  font-size: 16px;
  margin-bottom: 5px;
`;

export const Input = styled.TextInput.attrs({
  placeholderTextColor: 'black',
})`
  background-color: #f5f6fa;
  padding: 10px;
  font-size: 16px;
  border-radius: 3px;
  color: black;
  ${(props: Props) =>
    props.multiline &&
    `
    height: 150px;
    text-align-vertical: top;
  `}
  ${(props: Props) =>
    props.border &&
    ` 
      border-bottom-width: 3px;
      border-color: ${colors.primary};
    `}
`;
