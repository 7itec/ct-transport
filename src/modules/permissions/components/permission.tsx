import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { colors } from "shared/assets/colors";
import Column from "shared/components/column";
import Row from "shared/components/row";
import { MediumText, RegularText } from "shared/components/text";
import styled from "styled-components/native";

interface Props {
  title: string;
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
  checked?: boolean;
}

const Permission: React.FC<Props> = ({
  title,
  description,
  icon,
  onPress,
  checked,
}) => {
  return (
    <Row
      style={{
        padding: 15,
        backgroundColor: "rgba(128, 128, 128, .15)",
        borderRadius: 10,
      }}
      alignItems="center"
      justifyContent="space-between"
      gap={15}
      {...{ onPress }}
    >
      <Circle>
        <Ionicons name={icon} size={20} color="white" />
      </Circle>
      <Column style={{ flex: 1 }} gap={3}>
        <MediumText>{title}</MediumText>
        <RegularText size="small">{description}</RegularText>
      </Column>
      {!checked && (
        <Ionicons name="close-circle" color={colors.error} size={28} />
      )}
      {checked && (
        <Ionicons name="checkmark-circle" color={colors.success} size={28} />
      )}
    </Row>
  );
};

export default Permission;

const Circle = styled.View`
  width: 40px;
  height: 40px;
  border-radius: 20px;
  justify-content: center;
  align-items: center;
  background-color: ${colors.primary};
`;
