import React from "react";
import useConductorVehicleStorage from "../storage/use-conductor-vehicle-storage";
import useAttachedVehiclesStorage from "../storage/use-attached-vehicles-storage";
import { router, Stack } from "expo-router";
import { Pressable, ScrollView, View } from "react-native";
import VehicleDraft from "../components/vehice-draft";
import { SemilBoldText } from "components/text";
import Empty from "components/empty";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "assets/colors";
import Row from "components/row";
import Button from "components/button";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import dateFnsHelpers from "util/date-fns-helpers";
import useGps from "modules/geolocation/hooks/use-gps";
import useConfirmVehicle from "modules/work-journey/hooks/use-confirm-vehicle";
import Toast from "react-native-toast-message";

const VehiclesDraft: React.FC = () => {
  const { conductorVehicle } = useConductorVehicleStorage();
  const { attachedVehicles } = useAttachedVehiclesStorage();
  const { bottom } = useSafeAreaInsets();
  const confirmVehicleMutation = useConfirmVehicle();
  const { latitude, longitude } = useGps();

  const handleFinish = async () => {
    const isPendingChecklist =
      !conductorVehicle?.canSkipChecklist ||
      attachedVehicles?.some((vehicle) => !vehicle.canSkipChecklist);

    if (isPendingChecklist)
      return Toast.show({
        type: "error",
        text1: "Erro ao confirmar veículos",
        text2: "Existem checklists pendentes",
      });

    await confirmVehicleMutation.mutate({
      latitude,
      longitude,
      conductorVehicle: conductorVehicle?._id,
      attachedVehicles: attachedVehicles.map((vehicle) => vehicle._id),
      registrationDate: dateFnsHelpers.addSeconds(new Date(), 2),
      workJourneyVehicles: { conductorVehicle, attachedVehicles },
    });

    router.dismissAll();
  };

  return (
    <View
      style={{
        paddingBottom: bottom + 15,
        paddingHorizontal: 15,
        flex: 1,
      }}
    >
      <ScrollView
        contentContainerStyle={{
          gap: 15,
          paddingVertical: 25,
          flexGrow: attachedVehicles.length > 0 ? 0 : 1,
        }}
      >
        <SemilBoldText size="medium">Veículos condutor</SemilBoldText>
        <VehicleDraft {...conductorVehicle!} />
        <Row justifyContent="space-between">
          <SemilBoldText size="medium">Veículos acoplados</SemilBoldText>
          <Pressable
            onPress={() =>
              router.push({
                pathname: "/checklists/select-vehicle",
                params: { type: "ATTACHED" },
              })
            }
          >
            <Ionicons name="add-circle-outline" color={colors.info} size={24} />
          </Pressable>
        </Row>
        {attachedVehicles.map((vehicle) => (
          <VehicleDraft key={vehicle._id} {...vehicle} />
        ))}
        {attachedVehicles.length === 0 && (
          <Empty description="Nenhum veículo acoplado adicionado" />
        )}
      </ScrollView>
      <Button
        label="Salvar"
        onPress={handleFinish}
        {...{ isLoading: confirmVehicleMutation.isLoading }}
      />
      <Stack.Screen
        {...{ options: { headerShown: true, title: "Meus veículos" } }}
      />
    </View>
  );
};

export default VehiclesDraft;
