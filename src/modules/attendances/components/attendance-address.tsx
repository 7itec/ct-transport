import { FontAwesome6, Ionicons } from "@expo/vector-icons";
import Column from "components/column";
import Row from "components/row";
import { LightText, MediumText, RegularText } from "components/text";
import { router } from "expo-router";
import React from "react";
import { StyleSheet, View } from "react-native";
import styled from "styled-components/native";

interface Props {
  origin: string;
  destination: string;
  showBackButton?: boolean;
}

const AttendanceAddress: React.FC<Props> = ({
  origin,
  destination,
  showBackButton,
}) => {
  return (
    <Container style={{ flexShrink: 1 }}>
      {showBackButton && (
        <Row gap={5} onPress={() => router.back()}>
          <Ionicons name="close" size={16} />
          <RegularText>Voltar</RegularText>
        </Row>
      )}
      <Row gap={10}>
        <Column justifyContent="space-between" alignItems="center">
          <Circle>
            <FontAwesome6 name="location-dot" />
          </Circle>
          <View
            style={{
              flex: 1,
              width: StyleSheet.hairlineWidth,
              backgroundColor: "rgba(128, 128, 128, 0.4)",
            }}
          />
          <Circle>
            <Ionicons name="flag" />
          </Circle>
        </Column>
        <Column gap={10} style={{ flexShrink: 1 }}>
          <Column>
            <LightText size="small">Origem</LightText>
            <MediumText size="small">{origin}</MediumText>
          </Column>
          <View
            style={{
              width: "100%",
              height: StyleSheet.hairlineWidth,
              backgroundColor: "rgba(128, 128, 128, 0.4)",
            }}
          />
          <Column>
            <LightText size="small">Destino</LightText>
            <MediumText size="small">{destination}</MediumText>
          </Column>
        </Column>
      </Row>
    </Container>
  );
};

export default AttendanceAddress;

const Container = styled.View`
  gap: 15px;
`;

const Circle = styled.View`
  width: 30px;
  height: 30px;
  border-radius: 15px;
  justify-content: center;
  align-items: center;
  border: ${StyleSheet.hairlineWidth}px;
  border-color: rgba(128, 128, 128, 0.4);
`;
