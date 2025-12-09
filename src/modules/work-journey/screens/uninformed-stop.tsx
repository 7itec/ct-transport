import React, { useCallback } from "react";

import { uninformedStop } from "assets/images";
import Button from "components/button";
import styled from "styled-components/native";
import Column from "components/column";
import { useBackHandler } from "@react-native-community/hooks";
import { router } from "expo-router";
import dateFnsHelpers from "util/date-fns-helpers";
import useSkipUninformedStopUntil from "modules/taks/storage/use-skip-uninformed-stop-until";

const UninformedStop: React.FC = () => {
  useBackHandler(() => {
    return true;
  }, []);

  const { setSkipUninformedStopUntil } = useSkipUninformedStopUntil();

  const handleStop = useCallback(async () => {
    router.push({
      pathname: "/work-journey/work-stops",
      params: { redirect: "home" },
    });
  }, []);

  const handleStopLater = useCallback(async () => {
    setSkipUninformedStopUntil(dateFnsHelpers.addMinutes(new Date(), 5));

    router.dismiss();
    router.replace("/");
  }, [setSkipUninformedStopUntil]);

  return (
    <>
      <Container>
        <Banner source={uninformedStop} />
        <Title>Parada não informada</Title>
        <Description>
          Foi identificado que você está parado e existem atendimentos com
          status de deslocamento, por favor classifique a parada.
        </Description>
        <Column gap={10} style={{ width: "100%" }}>
          <Button label="Informar parada" onPress={handleStop} />
          <Button
            label="Parar depois"
            backgroundColor="error"
            onPress={handleStopLater}
          />
        </Column>
      </Container>
    </>
  );
};

export default UninformedStop;

const Container = styled.View`
  flex: 1;
  background-color: white;
  align-items: center;
  justify-content: center;
  padding: 10%;
`;

const Banner = styled.Image.attrs({
  resizeMode: "contain",
})`
  width: 200px;
  height: 200px;
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
