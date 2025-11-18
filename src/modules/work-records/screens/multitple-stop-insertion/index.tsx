import React from "react";

import useMultipleStopInsertionState from "./state";
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

const MultipleStopInsertion: React.FC = () => {
  const { alertId, text, audio, workRecordRectificationId } =
    useLocalSearchParams<{
      text: string;
      audio: string;
      alertId: string;
      workRecordRectificationId: string;
    }>();

  const { isLoadingAction, data, confirmPasswordRef, handleFinish, isLoading } =
    useMultipleStopInsertionState(alertId);

  return (
    <>
      <Stack.Screen options={{ title: "Inserir paradas", headerShown: true }} />
      {isLoading && <Loading />}
      {!isLoading && data && (
        <Container>
          <Column gap={10}>
            <SemilBoldText size="medium">Detalhes</SemilBoldText>
            <Card style={{ gap: 10 }}>
              <Column>
                <BoldText size="medium">Inserir paradas</BoldText>
                <RegularText size="small">
                  Solicitado em:{" "}
                  {dateFnsHelpers.defaultFormat(data?.createdAt!)}
                </RegularText>
              </Column>
              <BoldText color="error">{text}</BoldText>
            </Card>
            <SemilBoldText size="medium">Paradas</SemilBoldText>
            {(data?.payload.workStops as WorkStopProps[]).map(
              ({ workStopName, startDate, endDate }, index) => (
                <Card key={index}>
                  <MediumText>Parada: {workStopName}</MediumText>
                  <Column>
                    <RegularText>
                      Início {dateFnsHelpers.defaultFormat(startDate)}
                    </RegularText>
                    <RegularText>
                      Fim: {dateFnsHelpers.defaultFormat(endDate)}
                    </RegularText>
                  </Column>
                </Card>
              )
            )}
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

export default MultipleStopInsertion;

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
