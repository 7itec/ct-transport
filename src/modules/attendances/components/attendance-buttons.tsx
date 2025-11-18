import {
  FontAwesome5,
  FontAwesome6,
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import Row from "components/row";
import { MediumText } from "components/text";
import React, { useState } from "react";
import { Alert, Linking } from "react-native";
import { AttendanceProps, AttendanceStatusEnum } from "../types";
import { createOpenLink } from "react-native-open-maps";
import ActionButton from "components/action-button";
import useAcceptAttendance from "../hooks/use-accept-attendance";
import useGps from "modules/geolocation/hooks/use-gps";
import useDisplaceAttendance from "../hooks/use-displace-attendance";
import useArriveAttendance from "../hooks/use-arrive-attendance";
import useStartAttendance from "../hooks/use-start-attendance";
import useFinishAttendance from "../hooks/use-finish-attendance";
import { router } from "expo-router";
import useFinishAttendanceStop from "../hooks/use-finish-attendance-stop";
import useCurrentWorkJourney from "modules/work-journey/hooks/use-current-work-journey";
import { DriverStatus } from "modules/work-journey/types";
import QRCodeScanner from "./qr-code-scanner";

const AttendanceButtons: React.FC<AttendanceProps> = (props) => {
  const { _id, route, status, tripulation, serviceType } = props;

  const [showingQRCodeScanner, showQRCodeScanner] = useState(false);
  const { data } = useCurrentWorkJourney();
  const roadMap = route?.roadMap ?? [];
  const getAddressLatLngString = (address?: {
    latitude: number;
    longitude: number;
  }) => `${address?.latitude},${address?.longitude}`;

  const openRouteInGoogleMaps = createOpenLink({
    start: getAddressLatLngString(roadMap[0]),
    end: getAddressLatLngString(roadMap[roadMap.length - 1]),
    waypoints: roadMap
      .filter((_, index) => index !== 0 && index !== roadMap.length - 1)
      .map((roadMap) => getAddressLatLngString(roadMap)),
  });

  const openWazeMap = () => {
    const isAttendanceStarted = [
      AttendanceStatusEnum.Arrival,
      AttendanceStatusEnum.InAttendance,
    ].includes(status);

    const latitude = isAttendanceStarted
      ? roadMap[roadMap.length - 1].latitude
      : roadMap[0].latitude;
    const longitude = isAttendanceStarted
      ? roadMap[roadMap.length - 1].longitude
      : roadMap[0].longitude;

    Linking.openURL(
      `https://waze.com/ul?ll=${latitude},${longitude}&navigate=yes`
    );
  };

  const location = useGps();
  const acceptAttendanceMutation = useAcceptAttendance(_id);
  const displaceAttendanceMutation = useDisplaceAttendance(_id);
  const arriveAttendanceMutation = useArriveAttendance(_id);
  const startAttendanceMutation = useStartAttendance(_id);
  const finishAttendanceStop = useFinishAttendanceStop(_id);

  const handleAction = (mutate: any) => {
    if (data?.currentWorkJourney?.driverStatus === DriverStatus.STOPPED)
      return Alert.alert(
        "Erro ao alterar atendimento",
        "Você se encontra parado no momento, por favor finalize a parada para continuar o atendimento"
      );

    Alert.alert(
      "Alterar status do atendimento",
      "Deseja realmente alterar o status do atendimento?",
      [
        { text: "Cancelar" },
        {
          text: "Alterar",
          onPress: () =>
            mutate({
              registrationDate: new Date(),
              latitude: location.latitude,
              longitude: location.longitude,
            }),
        },
      ]
    );
  };

  return (
    <>
      <MediumText>Ações</MediumText>
      <Row gap={15} alignItems="flex-start" style={{ flexWrap: "wrap" }}>
        {status === AttendanceStatusEnum.Pending && (
          <ActionButton
            {...{
              label: "Aceitar",
              icon: <Ionicons name="checkmark" color="white" size={18} />,
              backgroundColor: "#2ec4b6",
              onPress: () => handleAction(acceptAttendanceMutation.mutate),
              isLoading: acceptAttendanceMutation.isLoading,
            }}
          />
        )}
        {status === AttendanceStatusEnum.Pending && (
          <ActionButton
            {...{
              label: "Recusar",
              icon: <Ionicons name="close" color="white" size={18} />,
              backgroundColor: "#e71d36",
              onPress: () =>
                router.push({
                  pathname: "/attendances/[attendanceId]/refuse",
                  params: { attendanceId: _id },
                }),
            }}
          />
        )}
        {status === AttendanceStatusEnum.Accepted && (
          <ActionButton
            {...{
              label: "Deslocamento",
              icon: <Ionicons name="arrow-redo" color="white" size={18} />,
              backgroundColor: "#4cc9f0",
              onPress: () => handleAction(displaceAttendanceMutation.mutate),
              isLoading: displaceAttendanceMutation.isLoading,
            }}
          />
        )}
        {status === AttendanceStatusEnum.Displacement && (
          <ActionButton
            {...{
              label: "Chegada",
              icon: (
                <MaterialIcons name="waving-hand" color="white" size={18} />
              ),
              backgroundColor: "#ff9f1c",
              onPress: () => handleAction(arriveAttendanceMutation.mutate),
              isLoading: arriveAttendanceMutation.isLoading,
            }}
          />
        )}
        {status === AttendanceStatusEnum.Arrival && (
          <ActionButton
            {...{
              label: "Em atendimento",
              icon: <FontAwesome6 name="car-side" color="white" size={18} />,
              backgroundColor: "#8d5bc1",
              onPress: () => handleAction(startAttendanceMutation.mutate),
              isLoading: startAttendanceMutation.isLoading,
            }}
          />
        )}
        {status === AttendanceStatusEnum.InAttendance && (
          <ActionButton
            {...{
              label: "Finalizar",
              icon: <Ionicons name="flag" color="white" size={18} />,
              backgroundColor: "#2ec4b6",
              onPress: () =>
                router.push({
                  pathname: "/attendances/[attendanceId]/finish",
                  params: { attendanceId: _id },
                }),
            }}
          />
        )}
        <ActionButton
          {...{
            label: "Abrir no maps",
            icon: (
              <MaterialCommunityIcons
                name="google-maps"
                color="white"
                size={20}
              />
            ),
            onPress: openRouteInGoogleMaps,
          }}
        />
        <ActionButton
          {...{
            label: "Abrir no waze",
            icon: (
              <MaterialCommunityIcons name="waze" color="white" size={20} />
            ),
            onPress: openWazeMap,
          }}
        />
        <ActionButton
          {...{
            label: "Ler QR code",
            backgroundColor: "#bc6c25",
            icon: (
              <MaterialCommunityIcons
                name="qrcode-scan"
                color="white"
                size={20}
              />
            ),
            onPress: () => showQRCodeScanner(true),
          }}
        />
        {[
          AttendanceStatusEnum.Displacement,
          AttendanceStatusEnum.Arrival,
          AttendanceStatusEnum.InAttendance,
        ].includes(status) && (
          <ActionButton
            {...{
              label: "Parada",
              icon: <FontAwesome5 name="stopwatch" color="white" size={18} />,
              backgroundColor: "#e71d36",
              onPress: () =>
                router.push({
                  pathname: "/work-journey/work-stops",
                  params: { attendanceId: _id },
                }),
            }}
          />
        )}
        {status === AttendanceStatusEnum.Stopped && (
          <ActionButton
            {...{
              label: "Finalizar parada",
              icon: <FontAwesome5 name="stopwatch" color="white" size={18} />,
              backgroundColor: "#ee9b00",
              onPress: () => handleAction(finishAttendanceStop.mutate),
              isLoading: finishAttendanceStop.isLoading,
            }}
          />
        )}
      </Row>
      {showingQRCodeScanner && (
        <QRCodeScanner onClose={() => showQRCodeScanner(false)} {...props} />
      )}
    </>
  );
};

export default AttendanceButtons;
