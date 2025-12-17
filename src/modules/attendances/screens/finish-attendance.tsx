import React, { useRef, useState } from "react";
import SignatureScreen, {
  SignatureViewRef,
} from "react-native-signature-canvas";
import {
  EncodingType,
  writeAsStringAsync,
  cacheDirectory,
} from "expo-file-system";

import { BorderlessButton } from "react-native-gesture-handler";
import styled from "styled-components/native";
import { Dimensions, Pressable } from "react-native";
import Constants from "expo-constants";
import Button from "components/button";
import { Ionicons } from "@expo/vector-icons";
import Row from "components/row";
import Camera from "modules/checklist/screens/camera";
import { router, useLocalSearchParams } from "expo-router";
import useFinishAttendance from "../hooks/use-finish-attendance";
import useUploadReceipt, { ReceiptTypeEnum } from "../hooks/use-upload-receipt";
import useLogs from "hooks/use-logs";
import getGpsCoordinates from "modules/geolocation/hooks/get-gps-coordinates";

const FinishAttendance: React.FC = () => {
  const { attendanceId } = useLocalSearchParams<{ attendanceId: string }>();
  const signatureCanvesRef = useRef<SignatureViewRef>(null);
  const [showingCamera, showCamera] = useState(false);
  const finishAttendanceWithSignatureMutation =
    useFinishAttendance(attendanceId);
  const finishAttendanceWithCameraMutation = useFinishAttendance(attendanceId);
  const uploadReceiptMutation = useUploadReceipt(attendanceId);
  const trackEvent = useLogs();

  const handleOK = async (signature: string) => {
    const path = `${cacheDirectory}/${new Date().getTime()}.png`;

    await writeAsStringAsync(
      path,
      signature.replace("data:image/png;base64,", ""),
      {
        encoding: EncodingType.Base64,
      }
    );

    trackEvent("Attendance - Finish", {
      attendanceId,
      receiptType: ReceiptTypeEnum.DIGITAL_SIGNATURE,
    });

    const { latitude, longitude } = await getGpsCoordinates();

    uploadReceipt(path, ReceiptTypeEnum.DIGITAL_SIGNATURE);
    finishAttendanceWithSignatureMutation.mutate({
      latitude,
      longitude,
      registrationDate: new Date(),
    });
  };

  const handleFinish = async (uri: string) => {
    trackEvent("Attendance - Finish", {
      attendanceId,
      receiptType: ReceiptTypeEnum.RECEIPT_PHOTO,
    });

    const { latitude, longitude } = await getGpsCoordinates();

    uploadReceipt(uri, ReceiptTypeEnum.RECEIPT_PHOTO);
    finishAttendanceWithCameraMutation.mutate({
      latitude,
      longitude,
      registrationDate: new Date(),
    });
  };

  const uploadReceipt = (uri: string, type: ReceiptTypeEnum) => {
    const formData = new FormData();

    formData.append("file", {
      uri,
      name: "signature.png",
      type: "image/jpeg",
    } as any as File);

    formData.append("receiptType", type);

    uploadReceiptMutation.mutate(formData);
  };

  return (
    <CanvasContainer>
      <CanvasForm>
        <ToolBar>
          <ToolBarButton onPress={router.back}>
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
        <Row gap={15}>
          <ConfirmSignatureButton
            label="FINALIZAR"
            onPress={() => signatureCanvesRef.current?.readSignature()}
            fitContent={false}
            style={{ flex: 1 }}
            isLoading={finishAttendanceWithSignatureMutation.isLoading}
            enabled={!finishAttendanceWithCameraMutation.isLoading}
          />
          <ConfirmSignatureButton
            label="ENVIAR FOTO"
            onPress={() => showCamera(true)}
            fitContent={false}
            style={{ flex: 1 }}
            isLoading={finishAttendanceWithCameraMutation.isLoading}
            enabled={!finishAttendanceWithSignatureMutation.isLoading}
          />
        </Row>
      </CanvasForm>
      {showingCamera && (
        <Camera onConfirm={handleFinish} onClose={() => showCamera(false)} />
      )}
    </CanvasContainer>
  );
};

export default FinishAttendance;

const { width, height } = Dimensions.get("window");

const CanvasContainer = styled.View`
  position: absolute;
  padding: 15px;
  background-color: white;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  justify-content: center;
  align-items: center;

  width: ${width}px;
  height: ${height}px;
`;

const ToolBar = styled.View`
  flex: 1;
  width: 100%;
  flex-direction: row;
  justify-content: space-between;
`;

const ToolBarButton = styled(BorderlessButton)`
  justify-content: center;
  align-items: center;
  width: 50px;
  height: 50px;
`;

const ToolBarRippleButton = styled(Pressable)`
  justify-content: center;
  align-items: center;
  padding: 0 10px;
`;

const ToolBarText = styled.Text``;

const CanvasForm = styled.View`
  width: ${height - Constants.statusBarHeight}px;
  height: ${width}px;
  background-color: white;
  transform: rotate(90deg);
  justify-content: center;
  align-items: center;
  padding: 15px;
  margin-top: ${Constants.statusBarHeight}px;
`;

const Canva = styled.View`
  width: ${height - Constants.statusBarHeight}px;
  height: ${width - 160}px;
  margin-bottom: 30px;
  padding: 0 15px;
`;

const ConfirmSignatureButton = styled(Button)`
  height: 50px;
`;
