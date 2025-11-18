import {useNavigation} from '@react-navigation/native';
import React from 'react';

import {Container, Icon, Title, CircleButton} from './styles';
import {Alert, View} from 'react-native';
import {useBackHandler} from '@react-native-community/hooks';

interface Props {
  title: string;
  goBack?: boolean;
  confirmGoBack?: boolean;
  action?: () => void;
  actionTitle?: string | React.ReactElement;
}

const TitleBar: React.FC<Props> = ({
  title,
  goBack = true,
  confirmGoBack = false,
}) => {
  const navigation = useNavigation();

  const goBackConfirmation = () =>
    Alert.alert(
      'Checklist pendente',
      'O progresso do checklist será perdido, deseja realmente sair?',
      [
        {
          text: 'Sair',
          onPress: navigation.goBack,
        },
        {
          text: 'Continuar',
        },
      ],
    );

  const handleGoBack = () => {
    if (!confirmGoBack) return navigation.goBack();

    goBackConfirmation();
  };

  useBackHandler(() => {
    if (confirmGoBack) {
      goBackConfirmation();
      return true;
    }
    return false;
  });

  return (
    <Container>
      {navigation.canGoBack() && goBack && (
        <CircleButton onPress={handleGoBack}>
          <Icon name="arrow-back" />
        </CircleButton>
      )}
      <Title>{title}</Title>
      <View style={{width: 50}} />
    </Container>
  );
};

export default TitleBar;
