import React, { forwardRef } from "react";
import Modal from "components/modal";

import {
  Container,
  LockIcon,
  Title,
  Description,
  Input,
  FingerPrint,
  BiometricsButton,
  Text,
} from "./styles";

import useConfirmPasswordState from "./state";

export interface ConfirmPasswordRefProps {
  open: () => void;
}

interface Props {
  callback: () => void;
}

const ConfirmPassword: React.FC<Props> = forwardRef(({ callback }, ref) => {
  const {
    handleSubmit,
    requestAccess,
    setPassword,
    passwordInputRef,
    biometrics,
    visible,
  } = useConfirmPasswordState(callback, ref);

  if (!visible) return null;

  return (
    <Modal>
      <Container>
        <LockIcon name="lock-closed" />
        <Title>Confirmar senha</Title>
        <Description>
          Confirme sua digital ou senha para completar a ação
        </Description>
        <Input
          ref={passwordInputRef}
          onChangeText={setPassword}
          secureTextEntry
          onSubmitEditing={handleSubmit}
          autoFocus
        />
        {biometrics && (
          <BiometricsButton onPress={requestAccess}>
            <FingerPrint name="finger-print-outline" />
            <Text>Usar digital</Text>
          </BiometricsButton>
        )}
      </Container>
    </Modal>
  );
});

export default ConfirmPassword;
