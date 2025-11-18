import {Text} from 'react-native';
import styled from 'styled-components/native';
import {TextProps, textSizes} from './types';
import {colors} from 'assets/colors';

export default styled(Text)<TextProps>`
  font-size: ${(props) => textSizes[props.size ?? 'regular']}px;
  color: ${(props) => colors[props.color ?? 'black']};
  text-align: ${(props) => props.textAlign ?? 'left'};
`;
