import React, {PropsWithChildren} from 'react';
import {Portal} from '@gorhom/portal';

import {Container, Card} from './styles';

const SelectVehicle: React.FC<PropsWithChildren> = ({children}) => {
  return (
    <Portal>
      <Container>
        <Card>{children}</Card>
      </Container>
    </Portal>
  );
};

export default SelectVehicle;
