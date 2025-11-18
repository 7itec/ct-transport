import styled from 'styled-components/native';
import IonIcon from '@expo/vector-icons/Ionicons';
import {colors} from 'assets/colors';

export const Container = styled.View`
  background-color: ${colors.white};
  height: 40px;
  width: 100%;
  padding: 0 15px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  elevation: 4;
`;

export const CircleButton = styled.Pressable`
  margin-right: 20px;
`;

export const Icon = styled(IonIcon)`
  font-size: 20px;
`;

export const Title = styled.Text`
  font-size: 18px;
`;
