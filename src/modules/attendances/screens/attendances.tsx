import React, { useCallback } from "react";

import Button from "components/button";
import { router, useFocusEffect } from "expo-router";
import useCurrentWorkJourney from "modules/work-journey/hooks/use-current-work-journey";
import {
  BoldText,
  LightText,
  MediumText,
  RegularText,
  SemilBoldText,
} from "components/text";
import styled from "styled-components/native";
import Column from "components/column";
import Row from "components/row";
import dateFnsHelpers from "util/date-fns-helpers";
import { Alert, FlatList, Image, StyleSheet, View } from "react-native";
import useAttendances from "modules/attendances/hooks/use-attendances";
import { AttendanceProps } from "modules/attendances/types";
import { ListRenderItemInfo } from "react-native";
import { RefreshControl } from "react-native";
import AttendanceAddress from "../components/attendance-address";
import { truckFilled } from "assets/images";
import StatusButton from "components/status-button";
import { colors } from "assets/colors";
import { FontAwesome } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import Loading from "components/loading";

const Attendances: React.FC = () => {
  const { data, refetch, isRefetching } = useCurrentWorkJourney();
  const attendancesQuery = useAttendances();
  const attendances = data?.currentWorkJourney?.conductorVehicle
    ? attendancesQuery?.data ?? []
    : [];

  const onRefresh = async () => {
    refetch();
    attendancesQuery.refetch();
  };

  const conductorVehicleId =
    data?.currentWorkJourney?.conductorVehicle?._id ??
    data?.currentWorkJourney?.conductorVehicle?.plate ??
    null;

  useFocusEffect(
    useCallback(() => {
      if (conductorVehicleId) attendancesQuery.fetch();
    }, [conductorVehicleId])
  );

  // const checkAlertPendingIssues = useCallback(() => {
  //   const pendingIssue = alertsQuery.data?.some(
  //     (alert) => alert.protocol.priority === "ALTA"
  //   );

  //   if (pendingIssue)
  //     Alert.alert(
  //       "Alertas pendentes",
  //       "Existem alertas pendentes, por favor verifique",
  //       [{ text: "Ok", onPress: () => router.push("/alerts") }]
  //     );
  // }, []);

  const renderAttendance = useCallback(
    ({ item }: ListRenderItemInfo<AttendanceProps>) => (
      <AttendanceCard
        onPress={() =>
          router.push({
            pathname: "/attendances/[attendanceId]",
            params: { attendanceId: item._id },
          })
        }
      >
        <Row justifyContent="space-between">
          <RegularText>
            {dateFnsHelpers.defaultFormat(item.startDate)}
          </RegularText>
          <RegularText>
            #{item.jobId} | {item.serviceType}
          </RegularText>
        </Row>
        <StatusButton text={item.status} backgroundColor={colors.error} />
        <AttendanceAddress
          origin={item.originAddress.fullAddress}
          destination={item.destinyAddress.fullAddress}
        />
        <Row gap={5} style={{ marginTop: 5 }}>
          <StatusButton
            text={`${item.tripulation.length ? "Passgerios" : "Materiais"}: ${
              item.tripulation.length > 0
                ? item.tripulation.length
                : item.materials.length
            }`}
            backgroundColor={colors.primary}
          />
          {item.isPcd && (
            <StatusButton
              text={<FontAwesome name="wheelchair-alt" />}
              backgroundColor={colors.info}
            />
          )}
          {item.isVip && (
            <StatusButton
              text={
                <BoldText size="small" color="white">
                  VIP
                </BoldText>
              }
              backgroundColor={colors.success}
            />
          )}
          {item.hasFullDayAvailability && (
            <StatusButton
              text={
                <BoldText size="small" color="white">
                  À disposição
                </BoldText>
              }
              backgroundColor={colors.warn}
            />
          )}
        </Row>
      </AttendanceCard>
    ),
    []
  );

  return (
    <Container>
      <Row gap={10}>
        <Image source={truckFilled} style={{ width: 30, height: 30 }} />
        <MediumText color="primary" size="medium">
          CT - Motorista
        </MediumText>
      </Row>
      <FlatList
        contentContainerStyle={{
          flexGrow:
            attendancesQuery.isLoading || !attendances.length ? 1 : undefined,
          gap: 15,
        }}
        data={attendances}
        renderItem={renderAttendance}
        refreshControl={
          <RefreshControl
            {...{
              refreshing: attendancesQuery.isRefetching || isRefetching,
              onRefresh,
            }}
          />
        }
        ListEmptyComponent={
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {attendancesQuery.isLoading && <Loading />}
            {!attendancesQuery.isLoading &&
              !data?.currentWorkJourney?.conductorVehicle && (
                <Button
                  fitContent={false}
                  label="Selecionar veículo"
                  onPress={() => router.push("/checklists/select-vehicle")}
                />
              )}
            {!attendancesQuery.isLoading &&
              data?.currentWorkJourney?.conductorVehicle && (
                <RegularText>Nenhum atendimento encontrado</RegularText>
              )}
          </View>
        }
        ListHeaderComponent={() => (
          <Column gap={15}>
            <SemilBoldText size="medium">Motorista</SemilBoldText>
            <Card>
              <Column>
                <LightText size="small">{data?.group?.name}</LightText>
                <BoldText>{data?.driverName}</BoldText>
              </Column>
              <Row justifyContent="space-between">
                <Column>
                  <LightText size="small">Início da jornada</LightText>
                  <MediumText size="small">
                    {dateFnsHelpers.defaultFormat(
                      data?.currentWorkJourney?.registrationDate!
                    )}
                  </MediumText>
                </Column>
                <Column>
                  <LightText size="small">Placa</LightText>
                  <MediumText size="small">
                    {data?.currentWorkJourney?.conductorVehicle?.plate}
                  </MediumText>
                </Column>
                <Column>
                  <LightText size="small">Modelo</LightText>
                  <MediumText size="small">
                    {data?.currentWorkJourney?.conductorVehicle?.model}
                  </MediumText>
                </Column>
              </Row>
            </Card>
            <SemilBoldText size="medium">Atendimentos</SemilBoldText>
          </Column>
        )}
      />
      <StatusBar style="auto" />
    </Container>
  );
};

export default Attendances;

const Container = styled.View`
  flex: 1;
  padding: 15px;
  gap: 10px;
  padding-top: 40px;
`;

const Card = styled.Pressable`
  padding: 15px;
  border-radius: 10px;
  background-color: white;
  width: 100%;
  gap: 5px;
  border-width: ${StyleSheet.hairlineWidth}px;
  border-color: rgba(128, 128, 128, 0.2);
`;

const AttendanceCard = styled.Pressable`
  padding: 15px;
  border-radius: 10px;
  background-color: white;
  width: 100%;
  gap: 10px;
  border-width: ${StyleSheet.hairlineWidth}px;
  border-color: rgba(128, 128, 128, 0.2);
`;
