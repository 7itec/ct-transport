import React from "react";

import { lunchIcon } from "assets/images";
import useLunchStopLockState from "./state";
import styled from "styled-components/native";
import Button from "components/button";
import { colors } from "assets/colors";
import { Image } from "react-native";
import dateFnsHelpers from "util/date-fns-helpers";

const LunchStopLock: React.FC = () => {
  const {
    handleCancelStop,
    handleResumeDriverStop,
    canCancel,
    isLoadingCancelStop,
    isLoadingResumeStop,
    registrationDate,
  } = useLunchStopLockState();

  return (
    <>
      <Container>
        <Banner source={lunchIcon} />
        <Title>Parada para alimentação</Title>
        <Description>
          Você está parado, cumpra seu tempo de alimentação para continuar!
        </Description>
        <StopButton
          label="Retomar jornada de trabalho"
          onPress={handleResumeDriverStop}
          isLoading={isLoadingResumeStop}
          enabled={!isLoadingCancelStop && !isLoadingResumeStop}
        />
        {canCancel() && (
          <CancelStopButton
            label="Cancelar parada"
            onPress={handleCancelStop}
            isLoading={isLoadingCancelStop}
            enabled={!isLoadingCancelStop && !isLoadingResumeStop}
          />
        )}
      </Container>
      <FloatingText>
        Parada realizada em:{" "}
        {dateFnsHelpers.format(registrationDate, "dd/MM 'às' HH:mm")}
      </FloatingText>
    </>
  );
};

export default LunchStopLock;

const Container = styled.View`
  flex: 1;
  background-color: white;
  align-items: center;
  justify-content: center;
  padding: 10%;
`;

const Banner = styled(Image)`
  width: 200px;
  height: 80px;
  object-fit: contain;
`;

const Title = styled.Text`
  font-size: 22px;
  color: black;
  text-align: center;
  margin-top: 10px;
  font-weight: bold;
`;

const Description = styled.Text`
  font-size: 16px;
  margin-top: 5px;
  text-align: center;
  opacity: 0.8;
  margin-bottom: 10px;
`;

const StopButton = styled(Button)`
  margin-top: 15px;
`;

const CancelStopButton = styled(Button)`
  margin-top: 15px;
  background: ${colors.error};
`;

const FloatingText = styled.Text`
  font-size: 16px;
  margin-top: 5px;
  text-align: center;
  color: black;
  margin-bottom: 10px;
  position: absolute;
  bottom: 15px;
  width: 100%;
`;
