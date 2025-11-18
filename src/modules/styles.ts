import {colors} from 'assets/colors';
import {StyleSheet} from 'react-native';
import styled from 'styled-components/native';

export const Container = styled.View`
  display: flex;
  flex: 1;
  background-color: white;
  justify-content: center;
  align-items: center;
`;

export const Footer = styled.View`
  height: 50px;
  flex-direction: row;
  background-color: ${colors.background};
  border-top-width: ${StyleSheet.hairlineWidth}px;
  border-color: rgba(128, 128, 128, 0.8);
`;

export const Tab = styled.Pressable`
  height: 50px;
  flex: 1;
  justify-content: center;
  align-items: center;
`;

export const ImageIcon = styled.Image`
  height: 25px;
  width: 25px;
`;
