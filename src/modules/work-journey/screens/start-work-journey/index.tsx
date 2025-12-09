import React, { useCallback, useEffect } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";

import Button from "components/button";
import { colors } from "assets/colors";
import { StatusBar } from "expo-status-bar";
import { Alert, Pressable, RefreshControl } from "react-native";
import Loading from "components/loading";

import { BoldText, RegularText } from "components/text";

import dateFnsHelpers from "util/date-fns-helpers";
import { router, Stack } from "expo-router";
import useLogout from "modules/authentication/hooks/use-logout";
import generateId from "util/generate-id";
import useGps from "modules/geolocation/hooks/use-gps";
import useStartWorkJourney from "modules/work-journey/hooks/use-start-work-journey";
import useCurrentWorkJourney from "modules/work-journey/hooks/use-current-work-journey";
import useLogs from "hooks/use-logs";
import styled from "styled-components/native";
import Row from "components/row";

const StartWorkJourney: React.FC = () => {
  const { trackEvent } = useLogs();

  const { data, isLoading, refetch, isRefetching } = useCurrentWorkJourney();
  const startWorkJourneyMutation = useStartWorkJourney();

  const standBy = data?.standBy;
  const lastWorkJourneyEndedAt = data?.lastWorkJourneyEndedAt;
  const nextWorkJourneyMinStartDate = data?.nextWorkJourneyMinStartDate;
  const nonWorkSchedule = data?.nonWorkSchedule;

  const location = useGps();

  useEffect(() => {
    if (standBy)
      Alert.alert(
        "Aviso de jornada programada",
        `Atenção você está sobre aviso de uma jornada programada para ${dateFnsHelpers.format(
          standBy.startDate,
          "dd/MM/yyyy HH:mm"
        )}!`
      );
  }, []);

  const withinWorkJourneyMinStartDate = useCallback(() => {
    if (!nextWorkJourneyMinStartDate) return true;

    return dateFnsHelpers.isNowAfterDate(nextWorkJourneyMinStartDate);
  }, [nextWorkJourneyMinStartDate]);

  const driverInNonWorkScheduleInterval = useCallback(() => {
    if (!nonWorkSchedule) return false;

    return dateFnsHelpers.isWithinInterval(dateFnsHelpers.now(), {
      start: nonWorkSchedule.startDate,
      end: nonWorkSchedule.endDate,
    });
  }, [nonWorkSchedule]);

  const handleStartWorkJorney = async () => {
    // const isWithinWorkJourneyMinStartDate = withinWorkJourneyMinStartDate();

    // if (!isWithinWorkJourneyMinStartDate)
    //   return Toast.show({
    //     type: "error",
    //     text1: "Erro ao iniciar jornada",
    //     text2: `A viagem só poderá ser iniciada após as ${dateFnsHelpers.defaultFormat(
    //       nextWorkJourneyMinStartDate!
    //     )} \nAguarde até esse horário para começar sua jornada.`,
    //   });

    // const isDriverInNonWorkScheduleInterval = driverInNonWorkScheduleInterval();

    // if (isDriverInNonWorkScheduleInterval) {
    //   const message = `O período de ${dateFnsHelpers.format(
    //     nonWorkSchedule!.startDate,
    //     "dd/MM/yyyy HH:mm"
    //   )} a ${dateFnsHelpers.format(
    //     nonWorkSchedule!.endDate,
    //     "dd/MM/yyyy HH:mm"
    //   )} está fora do horário de expediente. ${
    //     nonWorkSchedule!.scale ? `\nMotivo: ${nonWorkSchedule!.scale}` : ""
    //   }`;

    //   return Toast.show({
    //     type: "error",
    //     text1: "Erro ao iniciar jornada.",
    //     text2: message,
    //   });
    // }

    const _id = generateId();

    if (
      lastWorkJourneyEndedAt &&
      dateFnsHelpers.differenceInHours(new Date(), lastWorkJourneyEndedAt) < 3
    )
      return Alert.alert(
        "Erro ao iniciar jornada de trabalho",
        "O período mínimo de descanso entre o fim de uma jornada de trabalho e o início da próxima deve ser de 3 horas.",
        [
          {
            text: "Ok",
          },
        ]
      );

    if (
      lastWorkJourneyEndedAt &&
      dateFnsHelpers.differenceInHours(new Date(), lastWorkJourneyEndedAt) < 11
    )
      return Alert.alert(
        "Interjornada de trabalho",
        "O tempo entre a sua ultima jornada de trabalho é menor que 11 horas, deseja realmente iniciar uma interjornada?",
        [
          {
            text: "cancelar",
          },
          {
            text: "iniciar",
            onPress: () => {
              trackEvent("Start Inter Journey");
              startWorkJourneyMutation.mutate({
                _id,
                latitude: location?.latitude,
                longitude: location?.longitude,
                registrationDate: new Date(),
              });
            },
          },
        ]
      );

    Alert.alert(
      "Jornada de trabalho",
      "Deseja realmente iniciar sua jornada de trabalho?",
      [
        {
          text: "cancelar",
        },
        {
          text: "iniciar",
          onPress: () => {
            trackEvent("Start Work Journey");
            startWorkJourneyMutation.mutate({
              _id,
              latitude: location?.latitude,
              longitude: location?.longitude,
              registrationDate: new Date(),
            });
          },
        },
      ]
    );
  };

  const logout = useLogout();

  if (isLoading || !data) return <Loading />;

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
          {lastWorkJourneyEndedAt && (
            <Card>
              <RegularText color="gray" size="small">
                Última jornada
              </RegularText>
              <RegularText>
                {dateFnsHelpers.format(
                  lastWorkJourneyEndedAt,
                  "dd 'de' LLL'.' 'de' yyyy 'às' HH:mm"
                )}
              </RegularText>
            </Card>
          )}
          <Card>
            <Row
              justifyContent="space-between"
              onPress={() => router.push("/attendances/vehicles")}
            >
              <RegularText color="gray" size="small">
                Próximos atendimentos
              </RegularText>
              <Ionicons name="chevron-forward" />
            </Row>
          </Card>
          <Button
            label="Iniciar jornada"
            onPress={handleStartWorkJorney}
            isLoading={startWorkJourneyMutation.isLoading}
          />
        </Content>
      </Container>
      <Pressable onPress={logout}>
        <Exit>Sair</Exit>
      </Pressable>
      <Stack.Screen options={{ headerShown: false }} />
    </>
  );
};

export default StartWorkJourney;

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

const Card = styled.View`
  padding: 15px;
  border-radius: 10px;
  background-color: white;
  width: 100%;
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
