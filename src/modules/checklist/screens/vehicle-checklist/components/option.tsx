import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { colors } from "assets/colors";
import Row from "components/row";
import { SemilBoldText } from "components/text";
import React from "react";

interface Props {
  label: string;
  active?: boolean;
  onPress?: () => void;
  icon: any;
}

const Option: React.FC<Props> = ({ label, active, onPress, icon }) => {
  return (
    <Row
      gap={5}
      {...{ onPress }}
      style={{
        borderRadius: 15,
        paddingHorizontal: 10,
        paddingVertical: 5,
        backgroundColor: active ? colors.primary : "transparent",
        alignSelf: "flex-start",
      }}
    >
      <MaterialCommunityIcons
        name={icon}
        color={active ? "white" : "black"}
        size={14}
        style={{ marginTop: 3 }}
      />
      <SemilBoldText color={active ? "white" : "black"}>{label}</SemilBoldText>
    </Row>
  );
};

export default Option;
