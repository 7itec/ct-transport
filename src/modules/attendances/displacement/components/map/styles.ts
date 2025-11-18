import Animated from 'react-native-reanimated';
import styled from 'styled-components/native';
import {Dimensions} from 'react-native';
const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;
const ELIPSE_SIZE = 8;
const MARKER_SIZE = 30;

export const Container = styled.View`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  elevation: 4;
`;

export const Shadow = styled(Animated.View)`
  background-color: black;
  width: ${ELIPSE_SIZE}px;
  height: ${ELIPSE_SIZE}px;
  border-radius: ${ELIPSE_SIZE}px;
  opacity: 0.2;

  transform: scaleX(2);

  position: absolute;
  top: ${SCREEN_HEIGHT / 2 - ELIPSE_SIZE / 2}px;
  left: ${SCREEN_WIDTH / 2 - ELIPSE_SIZE / 2}px;
  z-index: 100;
`;

export const Marker = styled(Animated.View)`
  width: ${MARKER_SIZE}px;
  height: ${MARKER_SIZE}px;

  position: absolute;
  left: ${SCREEN_WIDTH / 2 - MARKER_SIZE / 2}px;
  z-index: 110;
`;

export const MarkerIcon = styled(Animated.Image)`
  width: ${MARKER_SIZE}px;
  height: ${MARKER_SIZE}px;
  resize-mode: contain;
  position: absolute;
`;

export const Confirm = styled.View`
  position: absolute;
  bottom: 15px;
  left: 15px;
  right: 15px;
  z-index: 1000;
`;
