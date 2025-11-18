import React from "react";
import { KeyboardAvoidingView, View } from "react-native";
import { nativeApplicationVersion } from "expo-application";

import useLoginState from "./state";
import { logo } from "assets/images";

import {
  Container,
  Label,
  Input,
  Logo,
  Form,
  Title,
  LogoBox,
  Line,
  Version,
  Expanded,
} from "./styles";
import Button from "components/button";
import Column from "components/column";

const Login: React.FC = () => {
  const {
    setUsername,
    setPassword,
    passwordInputRef,
    closeKeyboardAndLogin,
    isLoading,
  } = useLoginState();

  return (
    <Container edges={["bottom"]}>
      <KeyboardAvoidingView behavior="position">
        <LogoBox>
          <Line />
          <Logo source={logo} />
        </LogoBox>
        <Form>
          <Title>Login</Title>
          <Column gap={5}>
            <Label>Usuário</Label>
            <Input
              onChangeText={setUsername}
              autoCapitalize="none"
              onSubmitEditing={() => passwordInputRef.current?.focus()}
            />
          </Column>
          <Column gap={5}>
            <Label>Senha</Label>
            <Input
              secureTextEntry
              ref={passwordInputRef}
              onChangeText={setPassword}
              onSubmitEditing={closeKeyboardAndLogin}
            />
          </Column>
          <View style={{ marginTop: 5 }} />
          <Button
            {...{ isLoading, label: "Entrar", onPress: closeKeyboardAndLogin }}
          />
          {/* <AzureAuthentication /> */}
        </Form>
      </KeyboardAvoidingView>
      <Expanded />
      <Version>{nativeApplicationVersion}</Version>
    </Container>
  );
};

export default Login;
