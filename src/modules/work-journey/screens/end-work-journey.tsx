import React, { useEffect, useState } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";

import Button from "components/button";
import { colors } from "assets/colors";
import { StatusBar } from "expo-status-bar";
import { Alert, Pressable, RefreshControl } from "react-native";
import Loading from "components/loading";

import { BoldText, RegularText } from "components/text";

import dateFnsHelpers from "util/date-fns-helpers";
import { Stack } from "expo-router";
import useLogout from "modules/authentication/hooks/use-logout";
import styled from "styled-components/native";
import Row from "components/row";
import useCurrentWorkJourney from "modules/work-journey/hooks/use-current-work-journey";
import DateTimePicker from "react-native-modal-datetime-picker";
import BottomSheet from "components/bottom-sheet";
import Toast from "react-native-toast-message";
import generateId from "util/generate-id";
import { DriverStatus } from "modules/work-journey/types";
import useEndWorkJourney from "modules/work-journey/hooks/use-end-work-journey";
import useResumeStop from "modules/work-journey/hooks/use-resume-stop";
import useCreateRectification from "modules/work-journey/hooks/use-create-rectification";
import useLogs from "hooks/use-logs";
import useGps from "modules/geolocation/hooks/use-gps";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const EndWorkJourney: React.FC = () => {
  const { data, isLoading, refetch, isRefetching } = useCurrentWorkJourney();
  const logout = useLogout();
  const [isShowingDatePicker, showDatePicker] = useState(false);
  const [isShowingTimePicker, showTimePicker] = useState(false);
  const [isShowingBottomsheet, showBottomSheet] = useState(false);
  const [date, setDate] = useState<Date>();
  const trackEvent = useLogs();
  const { bottom } = useSafeAreaInsets();
  const { latitude, longitude } = useGps();

  const endWorkJourneyMutation = useEndWorkJourney();
  const resumeStopMutation = useResumeStop();
  const createRectificationMutation = useCreateRectification();
  const lastWorkRecordRegistrationDate =
    data!.currentWorkJourney?.lastWorkRecord?.registrationDate;

  useEffect(() => {
    trackEvent("Expired Work Journey", {
      workJourneyDuration,
    });
  }, []);

  if (isLoading || !data?.currentWorkJourney) return <Loading />;

  const { lastWorkRecord, registrationDate, suggestedWorkJourneyEndDates } =
    data.currentWorkJourney;
  const workJourneyDuration =
    dateFnsHelpers.differenceInHoursFromNow(registrationDate);

  const handleOpenDatePicker = () => {
    if (suggestedWorkJourneyEndDates?.length) return showBottomSheet(true);
    showDatePicker(true);
  };

  const onChange = (date: Date) => {
    showDatePicker(false);
    showTimePicker(false);
    if (!date) return;
    setDate(date);
  };

  const handleEndWorkJorney = () => {
    if (!date)
      return Toast.show({
        type: "error",
        text1: "Erro ao encerrar jornada de trabalho",
        text2: "Data não informada",
      });

    if (
      lastWorkRecord.registrationDate &&
      !dateFnsHelpers.isAfter(date, lastWorkRecord.registrationDate)
    )
      return Toast.show({
        type: "error",
        text1: "Hora de encerramento inválida",
        text2: `Por favor informe uma data superior a ${dateFnsHelpers.format(
          lastWorkRecord.registrationDate,
          "dd/MM/yyyy HH:mm"
        )}`,
      });

    if (!dateFnsHelpers.isBefore(date, new Date()))
      return Toast.show({
        type: "error",
        text1: "Hora de encerramento inválida",
        text2: `Por favor informe uma data inferior a ${dateFnsHelpers.format(
          new Date(),
          "dd/MM/yyyy HH:mm"
        )}`,
      });

    Alert.alert(
      "Encerrar jornada de trabalho",
      "Deseja realmente finalizar sua jornada de trabalho ?",
      [
        {
          text: "cancelar",
        },
        {
          text: "finalizar",
          onPress: endWorkJourney,
        },
      ]
    );
  };

  const endWorkJourney = async () => {
    const workRecordId = generateId();
    const isStopped =
      data?.currentWorkJourney?.driverStatus === DriverStatus.STOPPED;

    const endWorkJourneyDate = isStopped
      ? dateFnsHelpers.addSeconds(date!, 1)
      : date;

    if (isStopped)
      await resumeStopMutation.mutate({
        latitude,
        longitude,
        workStopId: lastWorkRecord.payload.workStopId,
        registrationDate: date,
      });

    await endWorkJourneyMutation.mutate({
      latitude,
      longitude,
      workRecordId,
      registrationDate: endWorkJourneyDate,
    });

    await createRectificationMutation.mutate({
      latitude,
      longitude,
      workRecordId,
      currentRegistrationDate: endWorkJourneyDate,
      previousRegistrationDate: new Date(),
    });
  };

  return (
    <>
      <Container
        refreshControl={
          <RefreshControl refreshing={isRefetching} onRefresh={refetch} />
        }
      >
        <StatusBar translucent />
        <Header>
          <Avatar>
            {!data?.avatar && (
              <Ionicons name="person" size={26} color={colors.primary} />
            )}
            {data?.avatar && <AvatarImage source={{ uri: data.avatar }} />}
          </Avatar>
        </Header>
        <Content>
          <Card>
            <BoldText size="medium">{data?.driverName}</BoldText>
            <RegularText size="small">{data?.companyName}</RegularText>
          </Card>
          {data?.currentWorkJourney?.registrationDate && (
            <Card>
              <RegularText color="gray" size="small">
                Início da jornada
              </RegularText>
              <RegularText>
                {dateFnsHelpers.defaultFormat(
                  data.currentWorkJourney.registrationDate
                )}
              </RegularText>
            </Card>
          )}
          {data?.currentWorkJourney?.registrationDate && (
            <Card>
              <RegularText color="gray" size="small">
                Duração da jornada
              </RegularText>
              <RegularText>{workJourneyDuration} horas</RegularText>
            </Card>
          )}
          <Card onPress={handleOpenDatePicker}>
            <RegularText color="gray" size="small">
              Data da finalização
            </RegularText>
            <RegularText>
              {date
                ? dateFnsHelpers.format(date, "dd/MM/yyyy")
                : "Informe a data"}
            </RegularText>
          </Card>
          <Card onPress={() => showTimePicker(true)}>
            <RegularText color="gray" size="small">
              Horário da finalização
            </RegularText>
            <RegularText>
              {date
                ? dateFnsHelpers.format(date, "HH:mm")
                : "Informe o horário"}
            </RegularText>
          </Card>
          <Buttons>
            <Button
              label="Encerrar jornada"
              onPress={handleEndWorkJorney}
              isLoading={
                resumeStopMutation.isLoading ||
                endWorkJourneyMutation.isLoading ||
                createRectificationMutation.isLoading
              }
            />
          </Buttons>
        </Content>
      </Container>
      <Pressable onPress={logout} style={{ paddingBottom: bottom + 15 }}>
        <Exit>Sair</Exit>
      </Pressable>
      <Stack.Screen options={{ headerShown: false }} />
      <DateTimePicker
        isVisible={isShowingDatePicker}
        date={date ?? new Date()}
        mode="date"
        onConfirm={onChange}
        onCancel={() => showDatePicker(false)}
        minimumDate={
          new Date(lastWorkRecordRegistrationDate ?? registrationDate)
        }
        maximumDate={new Date()}
      />
      <DateTimePicker
        isVisible={isShowingTimePicker}
        date={date ?? new Date()}
        mode="time"
        onConfirm={onChange}
        onCancel={() => showTimePicker(false)}
        is24Hour
      />
      {isShowingBottomsheet && (
        <BottomSheet
          onClose={() => showBottomSheet(false)}
          options={[
            ...(suggestedWorkJourneyEndDates ?? [])?.map(
              ({ date, address }) => {
                const label = `${dateFnsHelpers.format(
                  date,
                  "dd/MM/yyyy HH:mm"
                )}`;

                return {
                  description: address ? label : undefined,
                  label: address ? address : label,
                  onPress: () => setDate(new Date(date)),
                  icon: "calendar-outline",
                };
              }
            ),
            {
              label: "Selecionar data",
              icon: "calendar-outline",
              onPress: () => showDatePicker(true),
            },
          ]}
        />
      )}
    </>
  );
};

export default EndWorkJourney;

const Container = styled.ScrollView`
  background-color: "#f1f0f5";
`;

const Header = styled.View`
  height: 120px;
  background-color: #959096;
  margin-bottom: 35px;
`;

const Avatar = styled.View`
  width: 70px;
  height: 70px;
  border-radius: 35px;
  background-color: #f1f0f5;
  position: absolute;
  bottom: -35px;
  left: 15px;
  border-width: 4px;
  border-color: white;
  justify-content: center;
  align-items: center;
  elevation: 1;
  overflow: hidden;
`;

const Content = styled.View`
  flex: 1;
  padding: 15px;
  gap: 15px;
`;

const Card = styled.Pressable`
  padding: 15px;
  border-radius: 10px;
  background-color: white;
  width: 100%;
`;

const Buttons = styled(Row)`
  margin-top: 10px;
`;

const Exit = styled.Text`
  text-align: center;
  padding-bottom: 15px;
`;

const AvatarImage = styled.Image`
  width: 70px;
  height: 70px;
  resize-mode: cover;
`;
