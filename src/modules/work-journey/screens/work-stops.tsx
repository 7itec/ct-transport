import React, { useCallback, useMemo, useState } from "react";
import { Alert, Dimensions, ListRenderItemInfo, View } from "react-native";
import { FlatList } from "react-native-gesture-handler";

import BottomSheetOption from "components/bottom-sheet-option";

import CircleButton from "components/circle-button";
import { router, Stack, useLocalSearchParams } from "expo-router";
import Loading from "components/loading";
import styled from "styled-components/native";
import { Ionicons } from "@expo/vector-icons";
import useWorkStops from "../hooks/use-work-stops";
import { WorkStopProps, WorkStopsEnum } from "../types";
import useStop from "../hooks/use-stop";
import generateId from "util/generate-id";
import useStopAttendance from "modules/attendances/hooks/use-stop-attendance";
import { SafeAreaView } from "react-native-safe-area-context";
import useLogs from "hooks/use-logs";
import useGps from "modules/geolocation/hooks/use-gps";

const WorkStops: React.FC = () => {
  const { attendanceId } = useLocalSearchParams<{ attendanceId?: string }>();
  const [search, setSearch] = useState("");
  const { data, isLoading } = useWorkStops();
  const stopMutation = useStop();
  const stopAttendanceMutation = useStopAttendance(attendanceId as string);
  const trackEvent = useLogs();
  const { latitude, longitude } = useGps();

  const workStops = useMemo(
    () =>
      data?.filter(
        (workStop) =>
          workStop.name
            .toLocaleLowerCase()
            .search(search ? search.toLocaleLowerCase() : search) >= 0
      ),
    [data, search]
  );

  const handleStopPress = useCallback(
    ({ _id: workStopId, name: workStopReason }: WorkStopProps) =>
      async () => {
        const data = {
          latitude,
          longitude,
          attendanceId,
          workStopId,
          registrationDate: new Date(),
          id: generateId(),
        };

        Alert.alert("Realizar parada", "Deseja realmente realizar a parada?", [
          { text: "Voltar" },
          {
            text: "Parar",
            onPress: () => {
              trackEvent("Work Stop", {
                workStopReason,
                workStopId,
                attendanceId,
              });

              if (attendanceId && workStopId === WorkStopsEnum.stopAttendance)
                stopAttendanceMutation.mutate(data);
              else stopMutation.mutate(data);
            },
          },
        ]);
      },
    []
  );

  const renderItem = useCallback(
    ({ item: workStop }: ListRenderItemInfo<WorkStopProps>) => (
      <BottomSheetOption
        {...{
          label: workStop.name,
          onPress: handleStopPress(workStop),
        }}
      />
    ),
    [handleStopPress]
  );

  return (
    <Container>
      <Header>
        <CircleButton onPress={router.back}>
          <Ionicons name="arrow-back" size={24} />
        </CircleButton>
        <SearchBox>
          <Ionicons name="search" color="black" size={18} />
          <Input placeholder="Buscar paradas" onChangeText={setSearch} />
        </SearchBox>
      </Header>
      {(isLoading ||
        stopMutation.isLoading ||
        stopAttendanceMutation.isLoading) && <Loading />}
      {!isLoading &&
        !stopMutation.isLoading &&
        !stopAttendanceMutation.isLoading && (
          <FlatList
            data={workStops}
            ListHeaderComponent={<SubTitle>Paradas</SubTitle>}
            ListEmptyComponent={
              <View
                style={{
                  flex: 1,
                  height: Dimensions.get("window").height - 100,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <SubTitle>Nenhum parada encontrada</SubTitle>
              </View>
            }
            {...{ renderItem }}
          />
        )}
      <Stack.Screen options={{ statusBarStyle: "dark" }} />
    </Container>
  );
};

export default WorkStops;

const Container = styled(SafeAreaView)`
  flex: 1;
  background-color: white;
`;

const Header = styled.View`
  width: 100%;
  height: 70px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  gap: 15px;
  padding: 15px;
`;

const SearchBox = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  background-color: rgba(228, 233, 237, 1);
  flex: 1;
  height: 100%;
  border-radius: 30px;
  padding: 0 15px;
`;

export const Input = styled.TextInput.attrs({
  placeholderTextColor: "rgba(0, 0, 0, .4)",
})`
  flex: 1;
  color: black;
`;

export const SubTitle = styled.Text`
  padding: 0 15px 0 15px;
`;
