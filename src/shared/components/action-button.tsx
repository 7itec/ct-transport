import React from "react";
import { ActivityIndicator, StyleSheet } from "react-native";
import Column from "./column";
import styled from "styled-components/native";
import { RegularText } from "./text";
import { colors } from "assets/colors";
import Loading from "./loading";
import Row from "./row";

interface Props {
  label: string;
  icon: React.ReactNode;
  onPress?: () => void;
  isLoading?: boolean;
  backgroundColor?: string;
}

const ActionButton: React.FC<Props> = ({
  label,
  icon,
  onPress,
  isLoading,
  backgroundColor = colors.primary,
}) => {
  return (
    <Container
      gap={5}
      style={{ backgroundColor }}
      alignItems="center"
      {...{ onPress }}
    >
      {isLoading ? <ActivityIndicator {...{ color: "white" }} /> : icon}
      <RegularText textAlign="center" color="white">
        {label}
      </RegularText>
    </Container>
  );
};

export default ActionButton;

const Container = styled(Row)`
  border-radius: 8px;
  padding: 0 10px;
  height: 30px;
`;
