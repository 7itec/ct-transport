import React from "react";
import { View } from "react-native";
import { RegularText } from "./text";

interface Props {
  description: string;
}

const Empty: React.FC<Props> = ({ description }) => {
  return (
    <View style={{ justifyContent: "center", alignItems: "center", flex: 1 }}>
      <RegularText>{description}</RegularText>
    </View>
  );
};

export default Empty;
