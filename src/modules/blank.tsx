import Button from 'components/button';
import Pressable from 'components/pressable';
import React from 'react';
import {Text, View} from 'react-native';
import useEndWorkJourney from './work-journey/hooks/use-end-work-journey';

// import { Container } from './styles';

const Blanck: React.FC = () => {
  const {mutate, isLoading} = useEndWorkJourney();
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: 'red',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <Button
        label="Finalizar jornada"
        onPress={() =>
          mutate({
            workRecordId: '123456b89012345678901234',
            registrationDate: new Date(),
            latitude: -22.1353456,
            longitude: -43.2371085,
          })
        }
        {...{isLoading}}
      />
    </View>
  );
};

export default Blanck;
