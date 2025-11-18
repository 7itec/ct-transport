import React, { useRef, useEffect } from "react";
import SignatureScreen, {
  SignatureViewRef,
} from "react-native-signature-canvas";
import { request, PERMISSIONS } from "react-native-permissions";
import {
  EncodingType,
  writeAsStringAsync,
  cacheDirectory,
} from "expo-file-system";

import {
  CanvasContainer,
  ToolBar,
  CanvasForm,
  Canva,
  ConfirmSignatureButton,
  ToolBarButton,
  ToolBarText,
  ToolBarRippleButton,
} from "./styles";
import { Ionicons } from "@expo/vector-icons";

interface Props {
  close: () => void;
  getSignatureUri: (uri: string) => void;
}

const SignatureCanvas: React.FC<Props> = ({ close, getSignatureUri }) => {
  const signatureCanvesRef = useRef<SignatureViewRef>(null);

  useEffect(() => {
    request(PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE);
    request(PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE);
  }, []);

  const handleOK = async (signature: string) => {
    const path = `${cacheDirectory}/${new Date().getTime()}.png`;
    await writeAsStringAsync(
      path,
      signature.replace("data:image/png;base64,", ""),
      {
        encoding: EncodingType.Base64,
      }
    );

    getSignatureUri(`file://${path}`);
    close();
  };

  return (
    <CanvasContainer>
      <CanvasForm>
        <ToolBar>
          <ToolBarButton onPress={close}>
            <Ionicons name="close-outline" size={30} />
          </ToolBarButton>
          <ToolBarRippleButton
            onPress={() => signatureCanvesRef.current?.clearSignature()}
          >
            <ToolBarText>Limpar assinatura</ToolBarText>
          </ToolBarRippleButton>
        </ToolBar>
        <Canva>
          <SignatureScreen
            ref={signatureCanvesRef}
            onOK={handleOK}
            webStyle={`
    .m-signature-pad--footer { display: none; }
    .m-signature-pad { box-shadow: none; background-color: rgba(0, 0, 0, .1); flex: 1; }
    `}
          />
        </Canva>
        <ConfirmSignatureButton
          label="Continuar"
          onPress={() => signatureCanvesRef.current?.readSignature()}
        />
      </CanvasForm>
    </CanvasContainer>
  );
};

export default SignatureCanvas;
