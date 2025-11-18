import React, { useState } from "react";
import { Text } from "react-native";

import {
  Prompt,
  exchangeCodeAsync,
  makeRedirectUri,
  useAuthRequest,
  useAutoDiscovery,
} from "expo-auth-session";

import styled from "styled-components/native";
import Loading from "components/loading";
import useSSOLogin from "../hooks/use-sso-login";

const production = {
  clientId: "d90c0cd9-09c7-45cc-a624-b8a88185b92d",
  scopeUrl: "api://d90c0cd9-09c7-45cc-a624-b8a88185b92d/CicmAuth/API",
  tenantId: "5b6f6241-9a57-4be4-8e50-1dfa72e79a57",
};

const development = {
  clientId: "8e8ad750-6f39-415c-9a30-cbeba53322f5",
  scopeUrl: "api://8e8ad750-6f39-415c-9a30-cbeba53322f5/CicmAuth",
  tenantId: "6af8f826-d4c2-47de-9f6d-c04908aa4e88",
};

const AzureAuthentication: React.FC = () => {
  const ssoLoginMutation = useSSOLogin();
  const ssoCredentials = production;
  const [loading, setLoading] = useState(false);
  const discovery = useAutoDiscovery(
    `https://login.microsoftonline.com/${ssoCredentials.tenantId}/v2.0`
  );

  const redirectUri = makeRedirectUri({
    scheme: "msauth",
    path: "com.simcorpi.driver/L8hMrRiZlu+E6i65QSTXWa4kNkY=",
  });

  const clientId = ssoCredentials.clientId;
  const scopes = [ssoCredentials.scopeUrl];

  const [request, , promptAsync] = useAuthRequest(
    {
      clientId,
      scopes,
      redirectUri,
      prompt: Prompt.SelectAccount,
    },
    discovery
  );

  const handleAzureAuthentication = async () => {
    setLoading(true);
    const response = await promptAsync();

    if (response.type !== "success" || !request || !discovery)
      return setLoading(false);

    const { params } = response;

    const codeResponse = await exchangeCodeAsync(
      {
        clientId,
        code: params.code,
        extraParams: request.codeVerifier
          ? { code_verifier: request.codeVerifier }
          : undefined,
        redirectUri,
        scopes,
      },
      discovery
    );

    setLoading(false);

    const { accessToken } = codeResponse;

    ssoLoginMutation.mutate(accessToken);
  };

  return (
    <AzureAuthenticationButton
      disabled={!request}
      onPress={handleAzureAuthentication}
    >
      {!loading && !ssoLoginMutation.isLoading && (
        <>
          <MicrosoftLogo
            source={{
              uri: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Microsoft_logo.svg/512px-Microsoft_logo.svg.png",
            }}
          />
          <Text>Entrar com a Microsoft</Text>
        </>
      )}
      {(loading || ssoLoginMutation.isLoading) && <Loading />}
    </AzureAuthenticationButton>
  );
};

export default AzureAuthentication;

const AzureAuthenticationButton = styled.Pressable`
  height: 45px;
  border-radius: 4px;
  border: 1px solid rgba(128, 128, 128, 0.3);
  background-color: white;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 10px;
`;

const MicrosoftLogo = styled.Image`
  width: 20px;
  height: 20px;
`;
