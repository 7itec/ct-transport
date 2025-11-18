import { RegularText, SemilBoldText } from "components/text";
import React, { useState } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";

import { Container, BackButton, TextInput } from "./styles";
import { StatusBar } from "expo-status-bar";
import { colors } from "assets/colors";
import Button from "components/button";
import Column from "components/column";

interface Props {
  onClose: () => void;
  onConfirm: (text: string) => void;
}

const ReproveText: React.FC<Props> = ({ onClose, onConfirm }) => {
  const [text, setText] = useState("");

  const handleSubmit = () => {
    onConfirm(text);
    onClose();
  };

  return (
    <Container>
      <StatusBar
        backgroundColor={colors.primary}
        translucent={false}
        style="light"
      />
      <BackButton onPress={onClose}>
        <Ionicons name="close" size={30} />
      </BackButton>
      <Column gap={10}>
        <Column>
          <SemilBoldText size="extra-large">Motivo de reprovação</SemilBoldText>
          <RegularText>Informe o motivo para reprovar o item</RegularText>
        </Column>
        <Column gap={30}>
          <TextInput
            autoFocus
            multiline
            placeholder="Motivo de reprovação"
            onChangeText={setText}
          />
          <Button label="Salvar" onPress={handleSubmit} />
        </Column>
      </Column>
    </Container>
  );
};

export default ReproveText;
