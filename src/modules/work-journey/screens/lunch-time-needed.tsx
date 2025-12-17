import React, { useCallback, useEffect } from "react";

import { lunchIcon } from "assets/images";
import Button from "components/button";
import styled from "styled-components/native";
import Column from "components/column";
import { useBackHandler } from "@react-native-community/hooks";
import { WorkStopsEnum } from "../types";
import generateId from "util/generate-id";
import useStop from "../hooks/use-stop";
import useCreateAlert from "modules/alerts/hooks/use-create-alert";
import { ProtocolNamesEnum } from "modules/alerts/types";
import useCurrentWorkJourney from "../hooks/use-current-work-journey";
import { router } from "expo-router";
import useSkipLuncthTimeUntil from "modules/taks/storage/use-skip-lunch-time-until";
import dateFnsHelpers from "util/date-fns-helpers";
import useLogs from "hooks/use-logs";
import getGpsCoordinates from "modules/geolocation/hooks/get-gps-coordinates";

const LunchTimeNeeded: React.FC = () => {
  useBackHandler(() => {
    return true;
  }, []);

  const stopMutation = useStop();
  const createAlertMutation = useCreateAlert();
  const { data } = useCurrentWorkJourney();
  const { setSkipLunchTimeUntil } = useSkipLuncthTimeUntil();
  const trackEvent = useLogs();

  const handleLunchStop = useCallback(async () => {
    const { latitude, longitude } = await getGpsCoordinates();

    const data = {
      latitude,
      longitude,
      workStopId: WorkStopsEnum.meal,
      registrationDate: new Date(),
      id: generateId(),
    };

    trackEvent("Work Stop", {
      stopReason: "Horário de alimentação",
      workStopId: WorkStopsEnum.meal,
    });

    await stopMutation.mutate(data);

    router.dismiss();
    router.replace("/");
  }, []);

  const handleStopLater = useCallback(async () => {
    const { latitude, longitude } = await getGpsCoordinates();

    await createAlertMutation.mutate({
      protocolName: ProtocolNamesEnum.RECUSA_PARADA_ALMOÇO_6H,
      registrationDate: new Date(),
      payload: {
        latitude,
        longitude,
        driverName: data?.driverName,
        driverId: data?.driverId,
        vehicleId: data?.currentWorkJourney?.conductorVehicle?._id,
      },
    });

    trackEvent("Stop Later", {
      stopReason: "Horário de alimentação",
      workStopId: WorkStopsEnum.meal,
    });

    setSkipLunchTimeUntil(dateFnsHelpers.addSeconds(new Date(), 30));

    router.dismiss();
    router.replace("/");
  }, [data]);

  useEffect(() => {
    trackEvent("Lunch Time Needed");
  }, []);

  return (
    <>
      <Container>
        <Banner source={lunchIcon} />
        <Title>Parada para alimentação pendente</Title>
        <Description>
          Você deve fazer uma pausa para alimentação agora!
        </Description>
        <Column gap={10} style={{ width: "100%" }}>
          <Button
            label="Parar para alimentação"
            isLoading={stopMutation.isLoading}
            onPress={handleLunchStop}
          />
          <Button
            label="Parar depois"
            backgroundColor="error"
            isLoading={createAlertMutation.isLoading}
            onPress={handleStopLater}
          />
        </Column>
      </Container>
    </>
  );
};

export default LunchTimeNeeded;

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
  height: 80px;
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
