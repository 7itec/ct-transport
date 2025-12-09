import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Dimensions, ListRenderItemInfo, View } from "react-native";
import { FlatList } from "react-native-gesture-handler";

import useConductorVehicles from "modules/checklist/hooks/use-conductor-vehicles";

import BottomSheetOption from "components/bottom-sheet-option";
import { VehicleProps } from "modules/checklist/types";

import { Container, Header, Icon, SearchBox, Input, SubTitle } from "./styles";
import CircleButton from "components/circle-button";
import { router, Stack, useLocalSearchParams } from "expo-router";
import Loading from "components/loading";
import useCheckVehicleAvailability from "modules/checklist/hooks/use-check-vehicle-availability";
import useAttachedVehicles from "modules/checklist/hooks/use-attached-vehicles";
import useAttachedVehiclesStorage from "modules/checklist/storage/use-attached-vehicles-storage";

const SelectVehicle: React.FC = () => {
  const [search, setSearch] = useState("");
  const [vehicleId, setVehicleId] = useState<string>();
  const { type = "CONDUCTOR" } = useLocalSearchParams<{
    type: VehicleProps["type"];
  }>();

  const conductorVehiclesQuery = useConductorVehicles();
  const attachedVehiclesQuery = useAttachedVehicles();

  const checkVehicleAvailability = useCheckVehicleAvailability(type);
  const { setAttachedVehicles } = useAttachedVehiclesStorage();

  const vehiclesQuery =
    type === "CONDUCTOR" ? conductorVehiclesQuery : attachedVehiclesQuery;

  useEffect(() => {
    if (vehiclesQuery.data) vehiclesQuery.fetch();
  }, []);

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

  const handleVehiclePress = useCallback(async (vehicleId: string) => {
    setVehicleId(vehicleId);
    const { vehicle, canSkipChecklist } = await checkVehicleAvailability.mutate(
      vehicleId
    );
    setVehicleId(undefined);

    if (!vehicle) return;

    if (canSkipChecklist) {
      return setAttachedVehicles((prev) => [...prev, vehicle]);
    }

    router.push({
      pathname: "/checklists/vehicle-checklist",
      params: { vehicleId: vehicle._id },
    });
  }, []);

  const renderItem = useCallback(
    ({
      item: { _id, plate },
    }: ListRenderItemInfo<Pick<VehicleProps, "_id" | "plate">>) => (
      <BottomSheetOption
        key={_id}
        {...{
          label: plate,
          onPress: () => handleVehiclePress(_id),
          isLoading: checkVehicleAvailability.isLoading && vehicleId === _id,
        }}
      />
    ),
    [vehicleId]
  );

  return (
    <Container>
      <Stack.Screen options={{ statusBarStyle: "dark" }} />
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
  );
};

export default SelectVehicle;
