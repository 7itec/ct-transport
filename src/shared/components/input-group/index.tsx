import React, {forwardRef} from 'react';
import {KeyboardTypeOptions, TextInput} from 'react-native';

import {Container, Label, Input} from './styles';

interface Props {
  value?: string;
  onChangeText?: (value: string) => void;
  onSubmitEditing?: () => void;
  placeholder?: string;
  label?: string;
  keyboardType?: KeyboardTypeOptions;
  maxLength?: number;
  secureTextEntry?: boolean;
  border?: boolean;
  multiline?: boolean;
  disabled?: boolean;
}

const InputGroup = forwardRef<TextInput, Props>(
  ({label, disabled = false, ...props}, ref) => {
    return (
      <Container>
        <Label>{label}</Label>
        <Input {...{...props, editable: !disabled, ref}} />
      </Container>
    );
  },
);

export default InputGroup;
