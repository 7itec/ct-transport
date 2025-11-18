import {colors} from 'assets/colors';
import Pressable from 'components/pressable';
import Animated from 'react-native-reanimated';
import styled from 'styled-components/native';

interface ButtonProps {
  color?: string;
}

export const Container = styled(Animated.View)`
  border-radius: 10px;
  background-color: white;
  margin: 0 15px;
  overflow: hidden;
`;

export const Header = styled.View`
  padding: 15px;
`;

export const Dropdown = styled(Animated.View)``;

export const Details = styled.View`
  padding: 15px;
  padding-top: 0px;
  gap: 10px;
`;

export const Button = styled(Pressable)<ButtonProps>`
  flex: 1;
  background-color: ${(props) => props.color ?? colors.primary};
  padding: 10px 0;
  justify-content: center;
  align-items: center;
`;

export const Attachment = styled(Pressable).attrs({
  android_ripple: {
    color: 'rgba(128, 128, 128, .2)',
    borderless: false,
    radius: 32,
  },
})`
  border-radius: 15px;
  padding: 5px 10px;
  background-color: rgba(128, 128, 128, 0.4);
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 5px;
`;
