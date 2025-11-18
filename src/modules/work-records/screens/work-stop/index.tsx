import React from "react";

import useWorkStopState from "./state";
import ConfirmPassword from "components/confirm-password";
import { router, Stack, useLocalSearchParams } from "expo-router";
import { BoldText, RegularText, SemilBoldText } from "components/text";
import styled from "styled-components/native";
import Column from "components/column";
import Loading from "components/loading";
import dateFnsHelpers from "util/date-fns-helpers";
import Button from "components/button";
import Row from "components/row";

const WorkStop: React.FC = () => {
  const { text, workRecordId, alertId, workRecordRectificationId } =
    useLocalSearchParams<{
      workRecordId: string;
      alertId: string;
      text?: string;
      audio?: string;
      workRecordRectificationId: string;
    }>();

  const {
    handleFinish,
    isLoadingAction,
    confirmPasswordRef,
    data,
    isLoading,
    requestedWorkStopChange,
    previousWorkStop,
  } = useWorkStopState(workRecordId, alertId);

  return (
    <>
      <Stack.Screen
        options={{ headerShown: true, title: "Alteração de parada" }}
      />
      {isLoading && <Loading />}
      {!isLoading && data && (
        <Container>
          <Column gap={10}>
            <SemilBoldText size="medium">Detalhes</SemilBoldText>
            <Card style={{ gap: 10 }}>
              <Column>
                <BoldText size="medium">{data?.translatedName}</BoldText>
                <RegularText size="small">
                  Data: {dateFnsHelpers.defaultFormat(data?.registrationDate!)}
                </RegularText>
              </Column>
              <RegularText>
                {`Confirme a alteração da parada de ${previousWorkStop} para ${requestedWorkStopChange}`}
              </RegularText>
              <BoldText color="error">{text}</BoldText>
            </Card>
          </Column>
          <Card>
            <RegularText color="gray" size="small">
              Nova parada
            </RegularText>
            <RegularText>{requestedWorkStopChange}</RegularText>
          </Card>
          <Row gap={15} style={{ marginTop: 10 }}>
            <Button
              label="ALTERAR"
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
        </Container>
      )}
      <ConfirmPassword
        {...{ ref: confirmPasswordRef, callback: handleFinish }}
      />
    </>
  );
};

export default WorkStop;

const Container = styled.View`
  padding: 15px;
  gap: 15px;
`;

const Card = styled.Pressable`
  padding: 15px;
  border-radius: 10px;
  background-color: white;
  width: 100%;
  gap: 5px;
`;
