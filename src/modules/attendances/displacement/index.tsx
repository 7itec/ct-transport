import React from "react";

import Map from "./components/map";
import SearchAddress from "./components/search-address";

import { format } from "date-fns";
import { BorderlessButton } from "react-native-gesture-handler";
import useDisplacementState from "./state";
import DateTimePicker from "react-native-modal-datetime-picker";
import { colors } from "assets/colors";
import Loading from "components/loading";
import Empty from "components/empty";
import styled from "styled-components/native";
import { Ionicons } from "@expo/vector-icons";
import dateFnsHelpers from "util/date-fns-helpers";
import Button from "components/button";
import BottomSheet from "components/bottom-sheet";
import InputButton from "components/input-button";
import InputGroup from "components/input-group";
import states from "util/states";
import { Stack } from "expo-router";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

const Displacement: React.FC = () => {
  const {
    type,
    datePicker,
    timePicker,
    showMap,
    showSearch,
    startDate,
    isServerConnection,
    loading,
    isLoadingCreate,
    address,
    options,
    editAddress,
    handleSubmit,
    onChange,
    handleChangeDisplacementType,
    openMapToGetCoordinates,
    handleMapChange,
    showDatePicker,
    showTimePicker,
    setShowSearch,
    setShowMap,
    setAddress,
    typeBottomSheet,
    addressBottomSheet,
    showTypeBottomSheet,
    showAddressBottomSheet,
    neighborhoodBottomSheet,
    showNeighborhoodBottomSheet,
  } = useDisplacementState();
  const { bottom } = useSafeAreaInsets();

  return (
    <>
      <Stack.Screen
        options={{
          title: "Criar deslocamento",
          headerShown: true,
          statusBarStyle: "dark",
        }}
      />
      <Container style={{ paddingBottom: bottom + 15 }}>
        <Content>
          <Title>Detalhes</Title>
          <InputButton
            onPress={() => showTypeBottomSheet(true)}
            label="Tipo de deslocamento"
            placeholder="Tipo de deslocamento"
            value={type}
          />
          <InputRow>
            <Flexible>
              <InputButton
                onPress={() => showDatePicker(true)}
                label="Data"
                placeholder="Data"
                value={startDate && format(startDate, "dd/MM/yyyy")}
              />
            </Flexible>
            <Spacer />
            <Flexible>
              <InputButton
                onPress={() => showTimePicker(true)}
                label="Hora"
                placeholder="Hora"
                value={startDate && format(startDate, "HH:mm")}
              />
            </Flexible>
          </InputRow>
          <Row>
            <Title>Endereço</Title>
            {isServerConnection && (
              <BorderlessButton onPress={() => showAddressBottomSheet(true)}>
                <Ionicons
                  name={address ? "create-outline" : "add-circle-outline"}
                  color={colors.primary}
                  size={26}
                />
              </BorderlessButton>
            )}
            {!isServerConnection && (
              <BorderlessButton onPress={openMapToGetCoordinates}>
                <Ionicons name="location" color={colors.primary} size={26} />
              </BorderlessButton>
            )}
          </Row>
          {address && !loading && (
            <>
              <InputRow>
                <Flexible flex={1}>
                  <InputGroup
                    label="Logradouro"
                    placeholder="Informe o nome da rua"
                    value={address.address}
                    onChangeText={editAddress("address")}
                  />
                </Flexible>
                <Spacer />
                <Flexible flex={0.4}>
                  <InputGroup
                    label="Número"
                    placeholder="Número"
                    keyboardType="numeric"
                    value={address.number?.toString()}
                    onChangeText={editAddress("number")}
                  />
                </Flexible>
              </InputRow>
              <InputRow>
                <Flexible flex={1}>
                  <InputGroup
                    label="Cidade"
                    placeholder="Informe a cidade"
                    value={address.city}
                    onChangeText={editAddress("city")}
                  />
                </Flexible>
                <Spacer />
                <Flexible flex={0.4}>
                  <InputButton
                    onPress={() => showNeighborhoodBottomSheet(true)}
                    label="Estado"
                    placeholder="UF"
                    value={
                      states.find(
                        (currentState) =>
                          address.state === currentState.label ||
                          address.state === currentState.value
                      )?.value
                    }
                  />
                </Flexible>
              </InputRow>
              <InputGroup
                label="Bairro"
                placeholder="Informe o bairro"
                value={address.neighborhood}
                onChangeText={editAddress("neighborhood")}
              />
            </>
          )}
          {!address && !loading && (
            <AddressInfoContainer>
              <Empty description="Informe o endereço de destino" />
            </AddressInfoContainer>
          )}
          {loading && (
            <AddressInfoContainer>
              <Loading />
            </AddressInfoContainer>
          )}
        </Content>
        <Button
          label={
            !address
              ? "Informar endereço"
              : !address.addressLat
              ? "Informar coordenadas"
              : "Criar deslocamento"
          }
          textColor="white"
          isLoading={isLoadingCreate}
          onPress={() =>
            !address
              ? showAddressBottomSheet(true)
              : !address.addressLat
              ? openMapToGetCoordinates()
              : handleSubmit()
          }
        />
      </Container>
      {typeBottomSheet && (
        <BottomSheet
          onClose={() => showTypeBottomSheet(false)}
          options={["VAZIO", "RETORNO"].map((type) => ({
            label: type,
            value: type,
            onPress: () =>
              handleChangeDisplacementType(type as "VAZIO" | "RETORNO"),
          }))}
        />
      )}
      {neighborhoodBottomSheet && (
        <BottomSheet
          onClose={() => showNeighborhoodBottomSheet(false)}
          options={states.map(({ label, value }) => ({
            label,
            value,
            onPress: () => editAddress("state")(value),
          }))}
        />
      )}
      {addressBottomSheet && (
        <BottomSheet
          options={options}
          onClose={() => showAddressBottomSheet(false)}
        />
      )}
      <DateTimePicker
        isVisible={datePicker}
        date={startDate}
        mode={"date"}
        onConfirm={onChange}
        minimumDate={dateFnsHelpers.addMinutes(new Date(), 5)}
        onCancel={() => showDatePicker(false)}
      />
      <DateTimePicker
        isVisible={timePicker}
        date={startDate}
        mode={"time"}
        onConfirm={onChange}
        onCancel={() => showTimePicker(false)}
      />
      {showMap && (
        <Map
          {...{
            close: () => setShowMap(false),
            confirm: handleMapChange,
            coordinates:
              address?.addressLat && address?.addressLng
                ? {
                    latitude: +address?.addressLat,
                    longitude: +address?.addressLng,
                  }
                : undefined,
          }}
        />
      )}
      {showSearch && (
        <SearchAddress {...{ setAddress, close: () => setShowSearch(false) }} />
      )}
    </>
  );
};

export default Displacement;

interface FlexibleProps {
  flex?: number;
}

const Container = styled.View`
  background-color: white;
  padding: 15px;
  flex: 1;
`;

const Content = styled.ScrollView``;

const Title = styled.Text`
  font-size: 18px;
  font-weight: bold;
  color: black;
`;

const Row = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-top: 15px;
`;

const InputRow = styled.View`
  width: 100%;
  justify-content: space-between;
  flex-direction: row;
  align-items: center;
`;

const Flexible = styled.View<FlexibleProps>`
  flex: ${(props) => props.flex ?? 1};
`;

const Spacer = styled.View`
  width: 15px;
`;

const AddressInfoContainer = styled.View`
  flex: 1;
  height: 250px;
  justify-content: center;
  align-items: center;
`;
