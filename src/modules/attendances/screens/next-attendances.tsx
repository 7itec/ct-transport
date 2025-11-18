import React, { useCallback } from "react";

import {
  router,
  Stack,
  useFocusEffect,
  useLocalSearchParams,
} from "expo-router";
import useCurrentWorkJourney from "modules/work-journey/hooks/use-current-work-journey";
import { BoldText, RegularText } from "components/text";
import styled from "styled-components/native";
import Row from "components/row";
import dateFnsHelpers from "util/date-fns-helpers";
import { FlatList, StyleSheet, View } from "react-native";
import useAttendances from "modules/attendances/hooks/use-attendances";
import { AttendanceProps } from "modules/attendances/types";
import { ListRenderItemInfo } from "react-native";
import { RefreshControl } from "react-native";
import AttendanceAddress from "../components/attendance-address";
import StatusButton from "components/status-button";
import { colors } from "assets/colors";
import { FontAwesome } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";

const NextAttendances: React.FC = () => {
  const { vehicleId } = useLocalSearchParams<{ vehicleId: string }>();
  const { data, refetch, isRefetching } = useCurrentWorkJourney();
  const attendancesQuery = useAttendances(vehicleId);
  useFocusEffect(
    useCallback(() => {
      if (data?.currentWorkJourney?.conductorVehicle)
        attendancesQuery.refetch();
    }, [data?.currentWorkJourney?.conductorVehicle])
  );

  const onRefresh = async () => {
    refetch();
    attendancesQuery.refetch();
  };

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
            text={`Passgerios: ${item.tripulation.length}`}
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
        </Row>
      </AttendanceCard>
    ),
    []
  );

  return (
    <Container>
      <FlatList
        contentContainerStyle={{
          flexGrow:
            attendancesQuery.isLoading || !attendancesQuery.data?.length
              ? 1
              : undefined,
          gap: 15,
        }}
        data={attendancesQuery.data}
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
            <RegularText>Nenhum atendimento encontrado</RegularText>
          </View>
        }
      />
      <StatusBar style="auto" />
      <Stack.Screen
        options={{ headerShown: true, title: "Próximos atendimentos" }}
      />
    </Container>
  );
};

export default NextAttendances;

const Container = styled.View`
  flex: 1;
  padding: 15px;
  gap: 10px;
  padding-top: 20px;
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
