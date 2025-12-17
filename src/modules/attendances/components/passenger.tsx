import Column from "components/column";
import Row from "components/row";
import { MediumText, RegularText } from "components/text";
import React, { useCallback, useMemo, useState } from "react";
import { Alert, Linking, StyleSheet } from "react-native";
import styled from "styled-components/native";
import AttendanceAddress from "./attendance-address";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import { AttendanceStatusEnum, PassengerProps } from "../types";
import useCheckIn from "../hooks/use-check-in";
import BottomSheet, { BottomSheetOptionProps } from "components/bottom-sheet";
import useCheckOut from "../hooks/use-check-out";
import Loading from "components/loading";
import useNoShow from "../hooks/use-no-show";
import { router } from "expo-router";
import formatAddress from "util/format-address";
import getGpsCoordinates from "modules/geolocation/hooks/get-gps-coordinates";

const Passenger: React.FC<
  PassengerProps & {
    attendanceId: string;
    attendanceStatus: AttendanceStatusEnum;
  }
> = ({
  _id,
  name,
  phone,
  status,
  originAddress,
  destinyAddress,
  attendanceId,
  attendanceStatus,
  registrationNumber,
}) => {
  const [showBottomSheet, setShowBottomSheet] = useState(false);
  const checkInMutation = useCheckIn(attendanceId, _id);
  const checkOutMutation = useCheckOut(attendanceId, _id);
  const noShowMutation = useNoShow(attendanceId, _id);

  const handleNoShow = () =>
    Alert.alert(
      "No show",
      'Deseja realmente fazer o "no show" do passageiro?',
      [
        {
          text: "Não",
        },
        {
          text: "Sim",
          onPress: async () => {
            const { latitude, longitude } = await getGpsCoordinates();

            noShowMutation.mutate({
              latitude,
              longitude,
              registrationDate: new Date(),
            });
          },
        },
      ]
    );

  const handleCheckIn = useCallback(
    () =>
      Alert.alert(
        "No show",
        "Deseja realmente fazer o check-in do passageiro?",
        [
          {
            text: "Não",
          },
          {
            text: "Sim",
            onPress: () =>
              checkInMutation.mutate({
                latitude: location?.latitude,
                longitude: location?.longitude,
                registrationDate: new Date(),
              }),
          },
        ]
      ),
    []
  );

  const handleCheckOut = useCallback(
    () =>
      Alert.alert(
        "No show",
        "Deseja realmente fazer o check-out do passageiro?",
        [
          {
            text: "Não",
          },
          {
            text: "Sim",
            onPress: () =>
              checkOutMutation.mutate({
                latitude: location?.latitude,
                longitude: location?.longitude,
                registrationDate: new Date(),
              }),
          },
        ]
      ),
    []
  );

  const bottomSheetOptions = useMemo<BottomSheetOptionProps[]>(
    () => [
      {
        label: "No show",
        icon: "alert",
        onPress: handleNoShow,
      },
      {
        label: "Check-in",
        icon: "arrow-redo",
        onPress: handleCheckIn,
      },
      // {
      //   label: "Check-out",
      //   icon: "exit",
      //   onPress: handleCheckOut,
      // },
    ],
    [status, attendanceStatus]
  );

  return (
    <>
      <Card
        style={{ flexDirection: "column", gap: 10 }}
        onPress={() =>
          (attendanceStatus === "Chegada" ||
            attendanceStatus === "Atendimento") &&
          setShowBottomSheet(true)
        }
      >
        <Row justifyContent="space-between">
          <Row gap={10}>
            <Column>
              <MediumText size="small">{name}</MediumText>
              {!isNaN(Number(registrationNumber)) && (
                <RegularText size="small">
                  <AntDesign name="idcard" /> {registrationNumber}
                </RegularText>
              )}
            </Column>
            {(checkInMutation.isLoading ||
              checkOutMutation.isLoading ||
              noShowMutation.isLoading) && <Loading />}
          </Row>
          <Row gap={10}>
            <Circle>
              <Ionicons
                name="chatbox"
                onPress={() => router.push(`/attendances/${attendanceId}/chat`)}
              />
            </Circle>
            <Circle onPress={() => Linking.openURL(`tel:${phone}`)}>
              <Ionicons name="call" />
            </Circle>
          </Row>
        </Row>
        <AttendanceAddress
          origin={formatAddress(originAddress)}
          destination={formatAddress(destinyAddress)}
        />
      </Card>
      {showBottomSheet && (
        <BottomSheet
          onClose={() => setShowBottomSheet(false)}
          options={bottomSheetOptions}
        />
      )}
    </>
  );
};

export default Passenger;

const Card = styled.Pressable`
  flex-direction: row;
  padding: 15px;
  border-radius: 8px;
  border: ${StyleSheet.hairlineWidth}px;
  border-color: rgba(128, 128, 128, 0.4);
  gap: 10px;
  elevation: 1;
  background-color: white;
`;

const Circle = styled.Pressable`
  width: 35px;
  height: 35px;
  border-radius: 17.5px;
  justify-content: center;
  align-items: center;
  border: ${StyleSheet.hairlineWidth}px;
  border-color: rgba(128, 128, 128, 0.4);
`;
