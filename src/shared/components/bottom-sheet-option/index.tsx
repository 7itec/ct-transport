import React from "react";

import { Option, Circle, ActionIcon, ActionText } from "./styles";
import Row from "components/row";
import { ActivityIndicator } from "react-native";

interface BottomSheetOptionProps {
  label: string;
  onPress: () => void;
  isLoading?: boolean;
}

const BottomSheetOption: React.FC<BottomSheetOptionProps> = ({
  label,
  onPress,
  isLoading,
}) => {
  return (
    <Option {...{ onPress }}>
      <Row>
        <Circle>
          <ActionIcon size={18} name={"checkmark-outline"} />
        </Circle>
        <ActionText>{label}</ActionText>
      </Row>
      {isLoading && <ActivityIndicator />}
    </Option>
  );
};

export default BottomSheetOption;
