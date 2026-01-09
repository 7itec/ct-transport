import { Ionicons } from "@expo/vector-icons";
import { colors } from "assets/colors";
import Column from "components/column";
import Row from "components/row";
import { LightText, RegularText, SemilBoldText } from "components/text";
import useAttachedVehiclesStorage from "modules/checklist/storage/use-attached-vehicles-storage";
import { VehicleProps } from "modules/checklist/types";
import React, { useState } from "react";
import styled from "styled-components/native";
import useConductorVehicleStorage from "../storage/use-conductor-vehicle-storage";
import BottomSheet from "components/bottom-sheet";
import { router } from "expo-router";

const VehicleDraft: React.FC<VehicleProps> = ({
  _id,
  plate,
  model,
  canSkipChecklist,
  type,
}) => {
  const { setConductorVehicle } = useConductorVehicleStorage();
  const { setAttachedVehicles } = useAttachedVehiclesStorage();

  const [showingOptions, showOptions] = useState(false);

  return (
    <Container onPress={() => showOptions(true)}>
      <Column gap={15} style={{ flex: 1 }}>
        <Column gap={5}>
          <Row justifyContent="space-between">
            <SemilBoldText>{plate}</SemilBoldText>
            <StatusButton
              style={{
                backgroundColor:
                  type === "CONDUCTOR" ? colors.success : colors.error,
              }}
            >
              <RegularText color="white">
                {type === "CONDUCTOR" ? "Condutor" : "Acoplado"}
              </RegularText>
            </StatusButton>
          </Row>
          <LightText>{model}</LightText>
        </Column>
        <Row gap={5}>
          <Ionicons
            size={20}
            name={
              canSkipChecklist
                ? "checkmark-circle-outline"
                : "alert-circle-outline"
            }
            color={canSkipChecklist ? colors.success : colors.warn}
          />
          <RegularText>
            Checklist {canSkipChecklist ? "realizado" : "pendente"}
          </RegularText>
        </Row>
      </Column>
      {showingOptions && (
        <BottomSheet
          onClose={() => showOptions(false)}
          options={[
            {
              label: "Responder checklist",
              onPress: () =>
                router.push({
                  pathname: "/checklists/vehicle-checklist",
                  params: { vehicleId: _id },
                }),
              icon: "document-outline",
            },
            {
              label: "Remover",
              onPress: () => {
                if (type !== "CONDUCTOR")
                  return setAttachedVehicles((items) =>
                    items.filter((vehicle) => vehicle._id !== _id)
                  );

                router.replace("/checklists/select-vehicle");
                setConductorVehicle(null);
                setAttachedVehicles([]);
              },
              icon: "trash-bin-outline",
            },
          ]}
        />
      )}
    </Container>
  );
};

export default VehicleDraft;

const Container = styled.Pressable`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  background-color: white;
  border-radius: 4px;
`;

const StatusButton = styled.View`
  gap: 5;
  padding: 3px 5px;
  border-radius: 3px;
`;
