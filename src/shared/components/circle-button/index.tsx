import React from 'react';

import {Container} from './styles';

interface Props {
  onPress: () => void;
  children: React.ReactNode;
}

const CircleButton: React.FC<Props> = ({onPress, children}) => {
  return <Container {...{onPress}}>{children}</Container>;
};

export default CircleButton;
