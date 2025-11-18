import React from "react";

import { InputGroup, Label, Input } from "./styles";
import { Pressable } from "react-native";

interface Props {
  value?: string;
  placeholder?: string;
  label?: string;
  onPress?: () => void;
  border?: boolean;
}

const InputButton: React.FC<Props> = ({
  label,
  value,
  placeholder,
  onPress,
  ...props
}) => {
  return (
    <InputGroup {...props}>
      {label && <Label>{label}</Label>}
      <Pressable {...{ onPress }}>
        <Input>{value || placeholder}</Input>
      </Pressable>
    </InputGroup>
  );
};

export default InputButton;
