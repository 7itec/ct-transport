import React from "react";

import { format } from "date-fns";
import useUpdateWorkRecordState from "./state";
import DateTimePicker from "react-native-modal-datetime-picker";
import ConfirmPassword from "components/confirm-password";
import { router, Stack, useLocalSearchParams } from "expo-router";
import { BoldText, RegularText, SemilBoldText } from "components/text";
import styled from "styled-components/native";
import Column from "components/column";
import Loading from "components/loading";
import dateFnsHelpers from "util/date-fns-helpers";
import Button from "components/button";
import Row from "components/row";

const UpdateWorkRecordDate: React.FC = () => {
  const { text, workRecordId, workRecordRectificationId } =
    useLocalSearchParams<{
      workRecordRectificationId: string;
      workRecordId: string;
      text?: string;
      audio?: string;
    }>();

  const {
    onChange,
    handleFinish,
    showDatePicker,
    showTimePicker,
    isLoadingAction,
    date,
    datePicker,
    timePicker,
    confirmPasswordRef,
    previousDate,
    nextDate,
    intervalMessage,
    previousDateOnlyMessage,
    nextDateOnlyMessage,
    data,
    isLoading,
  } = useUpdateWorkRecordState(workRecordId);

  return (
    <>
      <Stack.Screen options={{ headerShown: true, title: "Justificar data" }} />
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
                {previousDate && nextDate && intervalMessage}
                {previousDate && !nextDate && previousDateOnlyMessage}
                {!previousDate && nextDate && nextDateOnlyMessage}
              </RegularText>
              <BoldText color="error">{text}</BoldText>
            </Card>
          </Column>
          <Card onPress={() => showDatePicker(true)}>
            <RegularText color="gray" size="small">
              Data
            </RegularText>
            <RegularText>
              {date ? format(date, "dd/MM/yyyy") : "Selecione a data"}
            </RegularText>
          </Card>
          <Card onPress={() => showTimePicker(true)}>
            <RegularText color="gray" size="small">
              Horário
            </RegularText>
            <RegularText>
              {date ? format(date, "HH:mm") : "Selecione o horário"}
            </RegularText>
          </Card>
          <Row gap={15} style={{ marginTop: 10 }}>
            <Button
              label="CONFIRMAR"
              onPress={() => confirmPasswordRef.current?.open()}
              isLoading={isLoadingAction}
              fitContent={false}
              style={{ flex: 1 }}
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
      <DateTimePicker
        isVisible={datePicker}
        date={date}
        mode={"date"}
        onConfirm={onChange}
        onCancel={() => showDatePicker(false)}
        minimumDate={previousDate ? new Date(previousDate) : undefined}
        maximumDate={nextDate ? new Date(nextDate) : new Date()}
      />
      <DateTimePicker
        isVisible={timePicker}
        date={date}
        mode={"time"}
        onConfirm={onChange}
        onCancel={() => showTimePicker(false)}
        is24Hour
      />
      <ConfirmPassword
        {...{ ref: confirmPasswordRef, callback: handleFinish }}
      />
    </>
  );
};

export default UpdateWorkRecordDate;

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
