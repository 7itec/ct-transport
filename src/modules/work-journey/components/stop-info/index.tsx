import React from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Pressable } from "react-native";
import styled from "styled-components/native";
import Loading from "components/loading";
import dateFnsHelpers from "util/date-fns-helpers";
import useCurrentWorkJourney from "modules/work-journey/hooks/use-current-work-journey";
import { DriverStatus, WorkStopsEnum } from "modules/work-journey/types";
import useHandleResumeStop from "modules/work-journey/hooks/use-handle-resume-stop";

const StopInfo: React.FC = () => {
  const { bottom } = useSafeAreaInsets();
  const { data } = useCurrentWorkJourney();
  const { handleResumeStop, isLoading } = useHandleResumeStop();

  if (!data?.currentWorkJourney) return null;
  if (
    data.currentWorkJourney.driverStatus !== DriverStatus.STOPPED ||
    data.currentWorkJourney.lastWorkRecord?.payload?.workStopId ===
      WorkStopsEnum.meal
  )
    return null;

  const { lastWorkRecord } = data.currentWorkJourney;

  return (
    <Container onPress={handleResumeStop} style={{ paddingBottom: bottom }}>
      {isLoading ? (
        <Loading color="white" />
      ) : (
        <>
          <StopName>
            Parada informada: {lastWorkRecord?.payload?.workStopName}
          </StopName>
          <StopName>
            Data:{" "}
            {dateFnsHelpers.defaultFormat(lastWorkRecord.registrationDate)}
          </StopName>
        </>
      )}
    </Container>
  );
};

export default StopInfo;

const Container = styled(Pressable)`
  padding: 5px 0;
  width: 100%;
  background-color: #b82424;
  justify-content: center;
  align-items: center;
  min-height: 40px;
`;

const StopName = styled.Text`
  color: white;
  font-size: 12px;
`;
