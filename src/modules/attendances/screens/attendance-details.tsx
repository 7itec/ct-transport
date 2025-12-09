import Column from "components/column";
import Row from "components/row";
import { MediumText, RegularText } from "components/text";
import useCurrentWorkJourney from "modules/work-journey/hooks/use-current-work-journey";
import { StyleSheet, View } from "react-native";
import styled from "styled-components/native";
import useAttendanceDetails from "../hooks/use-attendance-details";
import { useLocalSearchParams } from "expo-router";
import Loading from "components/loading";
import AttendanceAddress from "../components/attendance-address";
import dateFnsHelpers from "util/date-fns-helpers";
import BottomSheet, {
  BottomSheetScrollView,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import AttendanceButtons from "../components/attendance-buttons";
import AttendanceMap from "../components/attendance-map";
import StatusButton from "components/status-button";
import Passenger from "../components/passenger";
import { useEffect } from "react";
import Material from "../components/material";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const AttendanceDetails = () => {
  const { attendanceId } = useLocalSearchParams<{ attendanceId: string }>();
  const { data, isLoading, refetch } = useAttendanceDetails(attendanceId);
  const currentWorkJourneyQuery = useCurrentWorkJourney();
  const { bottom } = useSafeAreaInsets();

  useEffect(() => {
    refetch();
  }, []);

  if (isLoading || currentWorkJourneyQuery.isLoading || !data)
    return <Loading />;

  return (
    <>
      <AttendanceMap {...data} />
      <FloatingCard>
        <AttendanceAddress
          origin={data?.originAddress?.fullAddress}
          destination={data?.destinyAddress?.fullAddress}
          showBackButton
        />
      </FloatingCard>
      <BottomSheet snapPoints={[290, "100%"]}>
        <BottomSheetScrollView
          contentContainerStyle={{ paddingBottom: bottom + 15 }}
        >
          <Content>
            <Column gap={10}>
              <Row justifyContent="space-between">
                <MediumText>Atendimento</MediumText>
                <StatusButton text={data?.status} backgroundColor="red" />
              </Row>
              <Card
                style={{
                  justifyContent: "space-between",
                  flexDirection: "column",
                }}
              >
                <Row>
                  <RegularText size="small">{data?.routeSummary}</RegularText>
                </Row>
                <Row justifyContent="space-between">
                  <Column>
                    <MediumText>
                      {currentWorkJourneyQuery.data?.driverName}
                    </MediumText>
                    <RegularText size="small">
                      {currentWorkJourneyQuery.data?.companyName}
                    </RegularText>
                  </Column>
                  <Column>
                    <MediumText>{data?.vehicle?.plate}</MediumText>
                    <RegularText size="small">
                      {data?.vehicle?.model}
                    </RegularText>
                  </Column>
                </Row>
                <View
                  style={{
                    width: "100%",
                    height: StyleSheet.hairlineWidth,
                    backgroundColor: "rgba(128, 128, 128, 0.4)",
                  }}
                />
                <Row
                  justifyContent="space-between"
                  style={{ paddingHorizontal: 5 }}
                >
                  <Column>
                    <RegularText size="small">Id do atendimento</RegularText>
                    <MediumText>#{data?.jobId}</MediumText>
                  </Column>
                  <Column>
                    <RegularText size="small">Data</RegularText>
                    <MediumText>
                      {data.startDate &&
                        dateFnsHelpers.defaultFormat(data.startDate)}
                    </MediumText>
                  </Column>
                  <Column>
                    <RegularText size="small">Distância</RegularText>
                    <MediumText>
                      {(data?.route?.distance / 1000).toFixed(2)} km
                    </MediumText>
                  </Column>
                </Row>
              </Card>
            </Column>
            <AttendanceButtons {...data} />
            {data.observations && (
              <MediumText>Observação: {data.observations}</MediumText>
            )}
            <MediumText>
              {data?.tripulation?.length > 0 ? "Passageiros" : "Materiais"}
            </MediumText>
            {data?.tripulation.map((passenger) => (
              <Passenger
                key={passenger._id}
                {...{
                  ...passenger,
                  attendanceId,
                  attendanceStatus: data?.status,
                }}
              />
            ))}
          </Content>
        </BottomSheetScrollView>
      </BottomSheet>
    </>
  );
};

export default AttendanceDetails;

const Content = styled.View`
  width: 100%;
  padding: 15px;
  padding-bottom: 5px;
  gap: 15px;
  border-top-right-radius: 12px;
  border-top-left-radius: 12px;
  background-color: white;
`;

const Card = styled.View`
  flex-direction: row;
  padding: 15px;
  border-radius: 8px;
  border: ${StyleSheet.hairlineWidth}px;
  border-color: rgba(128, 128, 128, 0.4);
  gap: 10px;
  elevation: 1;
  background-color: white;
`;

const FloatingCard = styled.View`
  position: absolute;
  top: 45px;
  left: 15px;
  right: 15px;
  background-color: white;
  border-radius: 8px;
  elevation: 2;
  padding: 15px;
`;
