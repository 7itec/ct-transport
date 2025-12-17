import React, { useCallback, useEffect } from "react";

import { workJourneyStandardLimit } from "assets/images";
import Button from "components/button";
import styled from "styled-components/native";
import Column from "components/column";
import { useBackHandler } from "@react-native-community/hooks";
import { router } from "expo-router";
import useSkipUninformedStopUntil from "modules/taks/storage/use-skip-uninformed-stop-until";
import useCurrentWorkJourney from "../hooks/use-current-work-journey";
import { Alert } from "react-native";
import useHandleEndWorkJourney from "modules/work-journey/hooks/use-handle-end-work-journey";
import useCreateAlert from "modules/alerts/hooks/use-create-alert";
import { ProtocolNamesEnum } from "modules/alerts/types";
import useQueryHelpers from "hooks/use-query-helpers";
import { UserProps } from "../types";
import usersKeys from "modules/users/util/users-keys";
import useLogs from "hooks/use-logs";

const WorkJourneyStandardLimit: React.FC = () => {
  useBackHandler(() => {
    return true;
  }, []);

  const { data } = useCurrentWorkJourney();
  const { setData } = useQueryHelpers<UserProps>(usersKeys.profile());

  const { setSkipUninformedStopUntil } = useSkipUninformedStopUntil();
  const trackEvent = useLogs();

  useEffect(() => {
    trackEvent("Standard Limit");
  }, []);

  const { finishJourney } = useHandleEndWorkJourney();
  const createAlertMutation = useCreateAlert();

  const handleFinishJourney = () =>
    Alert.alert(
      "Encerrar jornada de trabalho",
      "Deseja realmente encerrar a jornada de trabalho?",
      [
        {
          text: "cancelar",
        },
        {
          text: "encerrar",
          onPress: finishJourney,
        },
      ]
    );

  const handleIgnoreStandardLimit = useCallback(async () => {
    await createAlertMutation.mutate({
      protocolName: ProtocolNamesEnum.LIMITE_JORNADA,
      registrationDate: new Date(),
      recipientIds: [data?._id],
      payload: {
        driverName: data?.driverName,
        driverId: data?.driverId,
        vehicleId: data?.currentWorkJourney?.conductorVehicle?._id,
      },
    });

    trackEvent("Standard Limit Ignored", {
      companyConfigParameters: data?.companyConfigParameters,
    });

    if (!data?.currentWorkJourney) return;

    setData({
      ...data,
      currentWorkJourney: {
        ...data.currentWorkJourney,
        hasLimitReachedAlert: true,
      },
    });

    router.dismiss();
    router.replace("/");
  }, [setSkipUninformedStopUntil]);

  return (
    <>
      <Container>
        <Banner source={workJourneyStandardLimit} />
        <Title>Limite de jornada de trabalho</Title>
        <Description>
          Limite de{" "}
          {data?.companyConfigParameters?.standardWorkJourneyTime?.textPtBr} da
          jornada de trabalho alcançado, por favor encerre ou ignore o
          encerramento da jornada
        </Description>
        <Column gap={10} style={{ width: "100%" }}>
          <Button label="Encerrar" onPress={handleFinishJourney} />
          <Button
            label="Continuar jornada"
            backgroundColor="error"
            onPress={handleIgnoreStandardLimit}
            isLoading={createAlertMutation.isLoading}
          />
        </Column>
      </Container>
    </>
  );
};

export default WorkJourneyStandardLimit;

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
