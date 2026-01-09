import React, { useCallback, useMemo, useState } from "react";
import { Alert, Dimensions, ListRenderItemInfo, View } from "react-native";
import { FlatList } from "react-native-gesture-handler";

import { StatusBar } from "expo-status-bar";

import BottomSheetOption from "components/bottom-sheet-option";

import CircleButton from "components/circle-button";
import { router, useLocalSearchParams } from "expo-router";
import Loading from "components/loading";
import styled from "styled-components/native";
import { Ionicons } from "@expo/vector-icons";
import useRefuseReaons, {
  RefuseReasonProps,
} from "../hooks/use-refuse-reasons";
import useRefuseAttendance from "../hooks/use-refuse-attendance";
import useLogs from "hooks/use-logs";
import useGps from "modules/geolocation/hooks/use-gps";

const RefuseAttendance: React.FC = () => {
  const [search, setSearch] = useState("");
  const { data, isLoading } = useRefuseReaons();
  const { attendanceId } = useLocalSearchParams<{ attendanceId: string }>();
  const refuseAttendanceMutation = useRefuseAttendance(attendanceId);
  const trackEvent = useLogs();
  const { latitude, longitude } = useGps();

  const refuseReasons = useMemo(
    () =>
      data?.filter(
        (refuseReason) =>
          refuseReason.name
            .toLocaleLowerCase()
            .search(search ? search.toLocaleLowerCase() : search) >= 0
      ),
    [data, search]
  );

  const handleReasonPress = useCallback(async (jobRefusedReasonId: string) => {
    Alert.alert(
      "Recusar atendimento",
      "Deseja realmente recusar o atendimento?",
      [
        { text: "Cancelar" },
        {
          text: "Recusar",
          onPress: async () => {
            trackEvent("Attendance - Refused", { attendanceId });

            refuseAttendanceMutation.mutate({
              latitude,
              longitude,
              jobRefusedReasonId,
              registrationDate: new Date(),
            });
          },
        },
      ]
    );
  }, []);

  const renderItem = useCallback(
    ({ item: { _id, name } }: ListRenderItemInfo<RefuseReasonProps>) => (
      <BottomSheetOption
        key={_id}
        {...{
          label: name,
          onPress: () => handleReasonPress(_id),
        }}
      />
    ),
    []
  );

  return (
    <>
      <StatusBar backgroundColor="white" translucent={false} />
      <Container>
        <Header>
          <CircleButton onPress={router.back}>
            <Ionicons name="arrow-back" size={24} />
          </CircleButton>
          <SearchBox>
            <Ionicons name="search" color="black" size={18} />
            <Input placeholder="Buscar motivo" onChangeText={setSearch} />
          </SearchBox>
        </Header>
        {(isLoading || refuseAttendanceMutation.isLoading) && <Loading />}
        {!isLoading && !refuseAttendanceMutation.isLoading && (
          <FlatList
            data={refuseReasons}
            ListHeaderComponent={<SubTitle>Motivos de recusa</SubTitle>}
            ListEmptyComponent={
              <View
                style={{
                  flex: 1,
                  height: Dimensions.get("window").height - 100,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <SubTitle>Nenhum motivo encontrado</SubTitle>
              </View>
            }
            {...{ renderItem }}
          />
        )}
      </Container>
    </>
  );
};

export default RefuseAttendance;

const Container = styled.View`
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
