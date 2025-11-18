import React from "react";

import useRectifyMultipleDatesState from "./state";
import ConfirmPassword from "components/confirm-password";
import { router, Stack, useLocalSearchParams } from "expo-router";
import Button from "components/button";
import dateFnsHelpers from "util/date-fns-helpers";
import styled from "styled-components/native";
import {
  BoldText,
  MediumText,
  RegularText,
  SemilBoldText,
} from "components/text";
import Column from "components/column";
import { View } from "react-native";
import Loading from "components/loading";
import Row from "components/row";

interface WorkStopProps {
  workStopName: string;
  workStopConstantName: string;
  workStop: string;
  workStopId: string;
  startDate: Date;
  endDate: Date;
}

const RectifyMultipleDates: React.FC = () => {
  const { alertId, text, audio, workRecordRectificationId } =
    useLocalSearchParams<{
      text: string;
      audio: string;
      alertId: string;
      workRecordRectificationId: string;
    }>();

  const {
    isLoadingAction,
    workRecords,
    confirmPasswordRef,
    handleFinish,
    isLoading,
    createdAt,
  } = useRectifyMultipleDatesState(alertId);

  return (
    <>
      <Stack.Screen options={{ title: "Alterar datas", headerShown: true }} />
      {isLoading && <Loading />}
      {!isLoading && workRecords && (
        <Container>
          <Column gap={10}>
            <SemilBoldText size="medium">Detalhes</SemilBoldText>
            <Card style={{ gap: 10 }}>
              <Column>
                <BoldText size="medium">Alterar datas</BoldText>
                <RegularText size="small">
                  Solicitado em: {dateFnsHelpers.defaultFormat(createdAt!)}
                </RegularText>
              </Column>
              <BoldText color="error">{text}</BoldText>
            </Card>
            <SemilBoldText size="medium">Registros de trabalho</SemilBoldText>
            {workRecords.map(
              ({ name, newRegistrationDate, registrationDate }, index) => (
                <Card key={index}>
                  <MediumText>Registro de trabalho: {name}</MediumText>
                  <Column>
                    <RegularText>
                      Data antiga:{" "}
                      {dateFnsHelpers.defaultFormat(registrationDate)}
                    </RegularText>
                    <RegularText>
                      Nova data{" "}
                      {dateFnsHelpers.defaultFormat(newRegistrationDate)}
                    </RegularText>
                  </Column>
                </Card>
              )
            )}
            <View style={{ height: 5 }} />
            <Row gap={15} style={{ marginTop: 10 }}>
              <Button
                label="CONFIRMAR"
                onPress={() => confirmPasswordRef.current?.open()}
                isLoading={isLoadingAction}
                style={{ flex: 1 }}
                fitContent={false}
              />
              <Button
                label="RECUSAR"
                onPress={() =>
                  router.push({
                    pathname: "/work-records/refuse-rectification",
                    params: { workRecordRectificationId },
                  })
                }
                fitContent={false}
                style={{ flex: 1 }}
                backgroundColor="error"
              />
            </Row>
          </Column>
        </Container>
      )}
      <ConfirmPassword
        {...{ ref: confirmPasswordRef, callback: handleFinish }}
      />
    </>
  );
};

export default RectifyMultipleDates;

const Container = styled.ScrollView`
  padding: 15px;
`;

const Card = styled.Pressable`
  padding: 15px;
  border-radius: 10px;
  background-color: white;
  width: 100%;
  gap: 5px;
`;
