import { Ionicons } from "@expo/vector-icons";
import { colors } from "assets/colors";
import Column from "components/column";
import { LightText, MediumText } from "components/text";
import useAttachedVehiclesStorage from "modules/checklist/storage/use-attached-vehicles-storage";
import { VehicleProps } from "modules/checklist/types";
import React from "react";
import { Pressable } from "react-native";
import styled from "styled-components/native";

const AttachedVehicle: React.FC<VehicleProps> = ({ _id, plate, model }) => {
  const { setAttachedVehicles } = useAttachedVehiclesStorage();

  return (
    <Container>
      <Column>
        <MediumText>{plate}</MediumText>
        <LightText>{model}</LightText>
      </Column>
      <Pressable
        onPress={() =>
          setAttachedVehicles((prev) =>
            prev.filter((vehicle) => vehicle._id !== _id)
          )
        }
      >
        <Ionicons name="trash-bin" color={colors.error} size={22} />
      </Pressable>
    </Container>
  );
};

export default AttachedVehicle;

const Container = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  background-color: white;
  margin: 0 15px;
`;
