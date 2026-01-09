import { CameraType, CameraView, useCameraPermissions } from "expo-camera";
import React, { useEffect, useState } from "react";

import { Ionicons } from "@expo/vector-icons";
import { Dimensions, Pressable, useWindowDimensions, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import styled from "styled-components/native";
import QRCodeScannerOverlay from "./qr-code-scanner-overlay";
import { Portal } from "@gorhom/portal";
import { colors } from "assets/colors";
import { StatusBar } from "expo-status-bar";
import { MediumText } from "components/text";
import Toast from "react-native-toast-message";
import Row from "components/row";
import { AttendanceProps } from "../types";
import useCheckIn from "../hooks/use-check-in";
import Loading from "components/loading";
import useGps from "modules/geolocation/hooks/use-gps";

interface QRCodePassengerProps {
  _id: string;
  registrationNumber: string;
  name: string;
}

interface Props extends AttendanceProps {
  onClose: () => void;
}

const QRCodeScanner: React.FC<Props> = ({ onClose, _id }) => {
  const [cameraReady, setCameraReady] = useState(false);
  const [, requestPermission] = useCameraPermissions();
  const { top } = useSafeAreaInsets();
  const { height, width } = useWindowDimensions();
  const [facing, setFacing] = useState<CameraType>("front");
  const { latitude, longitude } = useGps();

  const { mutate, isLoading } = useCheckIn(_id);

  useEffect(() => {
    requestPermission();

    const timeout = setTimeout(() => setCameraReady(true), 200);

    return () => clearTimeout(timeout);
  }, [setCameraReady, requestPermission]);

  return (
    <Portal>
      <View
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
          flex: 1,
          paddingTop: top + 10,
          backgroundColor: colors.primary,
        }}
      >
        <Row justifyContent="space-between">
          <Pressable
            onPress={onClose}
            style={{
              paddingHorizontal: 15,
              justifyContent: "center",
              alignItems: "center",
              alignSelf: "flex-start",
            }}
          >
            <Ionicons name="close" color="white" size={30} />
          </Pressable>
          <Pressable
            onPress={() => setFacing(facing === "back" ? "front" : "back")}
            style={{
              paddingHorizontal: 15,
              justifyContent: "center",
              alignItems: "center",
              alignSelf: "flex-start",
            }}
          >
            <Ionicons name="sync-outline" color="white" size={30} />
          </Pressable>
        </Row>
        {isLoading && <Loading color="white" />}
        {!isLoading && (
          <Container>
            {cameraReady && (
              <View>
                <CameraView
                  {...{ facing }}
                  style={{
                    height: height * 0.5,
                    width: width - 30,
                    marginLeft: 15,
                  }}
                  onCameraReady={() => console.log("ready")}
                  onBarcodeScanned={async (code) => {
                    try {
                      const passenger: QRCodePassengerProps = JSON.parse(
                        code.data
                      );

                      mutate({
                        latitude,
                        longitude,
                        registrationDate: new Date(),
                        passengerId: passenger._id,
                      });
                    } catch (error) {
                      Toast.show({
                        type: "error",
                        text1: "Erro ao ler cartão de embarque",
                        text2: "Não foi possível decodificar os dados",
                      });
                    }
                  }}
                  barcodeScannerSettings={{
                    barcodeTypes: ["qr"],
                  }}
                />
                <QRCodeScannerOverlay />
              </View>
            )}
            <View style={{ paddingHorizontal: 15 }}>
              <MediumText size="medium" color="white" textAlign="center">
                Leia o cartão de embarque para embarcar passageiros no
                atendimento
              </MediumText>
            </View>
          </Container>
        )}
      </View>
      <StatusBar backgroundColor={colors.primary} />
    </Portal>
  );
};

export default QRCodeScanner;

const { width } = Dimensions.get("window");

const Container = styled.View`
  width: ${width}px;
  flex: 1;
  padding-top: 30px;
  background-color: ${colors.primary};
  gap: 15;
`;
