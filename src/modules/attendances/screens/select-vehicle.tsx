import React, { useCallback, useMemo, useState } from "react";
import { Dimensions, ListRenderItemInfo, View } from "react-native";
import { FlatList } from "react-native-gesture-handler";

import useConductorVehicles from "modules/checklist/hooks/use-conductor-vehicles";

import { StatusBar } from "expo-status-bar";

import BottomSheetOption from "components/bottom-sheet-option";
import { VehicleProps } from "modules/checklist/types";

import CircleButton from "components/circle-button";
import { router } from "expo-router";
import Loading from "components/loading";
import styled from "styled-components/native";
import { Ionicons } from "@expo/vector-icons";

const SelectVehicle: React.FC = () => {
  const vehiclesQuery = useConductorVehicles();
  const [search, setSearch] = useState("");

  const plates = useMemo(
    () =>
      vehiclesQuery.data?.filter(
        (vehicle) =>
          vehicle.plate
            .toLocaleLowerCase()
            .search(search ? search.toLocaleLowerCase() : search) >= 0
      ),
    [vehiclesQuery.data, search]
  );

  const renderItem = useCallback(
    ({
      item: { _id, plate },
    }: ListRenderItemInfo<Pick<VehicleProps, "_id" | "plate">>) => (
      <BottomSheetOption
        key={_id}
        {...{
          label: plate,
          onPress: () =>
            router.push({
              pathname: "/attendances/next",
              params: { vehicleId: _id },
            }),
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
            <Icon name="arrow-back" size={24} />
          </CircleButton>
          <SearchBox>
            <Icon name="search" color="black" size={18} />
            <Input placeholder="Busque pela placa" onChangeText={setSearch} />
          </SearchBox>
        </Header>
        {vehiclesQuery.isLoading && <Loading />}
        {!vehiclesQuery.isLoading && (
          <FlatList
            data={plates}
            ListHeaderComponent={<SubTitle>Veículos</SubTitle>}
            ListEmptyComponent={
              <View
                style={{
                  flex: 1,
                  height: Dimensions.get("window").height - 100,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <SubTitle>Nenhum veículo encontrado</SubTitle>
              </View>
            }
            {...{ renderItem }}
          />
        )}
      </Container>
    </>
  );
};

export default SelectVehicle;

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

const Icon = styled(Ionicons)``;

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

const Input = styled.TextInput.attrs({
  placeholderTextColor: "rgba(0, 0, 0, .4)",
})`
  flex: 1;
  color: black;
`;

const SubTitle = styled.Text`
  padding: 0 15px 0 15px;
`;
