import React from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Pressable } from "react-native";
import styled from "styled-components/native";
import Loading from "components/loading";
import dateFnsHelpers from "util/date-fns-helpers";
import { DriverStatus, WorkStopsEnum } from "modules/work-journey/types";
import useHandleResumeStop from "modules/work-journey/hooks/use-handle-resume-stop";
import useProfileStorage from "modules/users/storage/use-profile-storage";

const StopInfo: React.FC = () => {
  const { bottom } = useSafeAreaInsets();
  const { profile } = useProfileStorage();
  const { handleResumeStop, isLoading } = useHandleResumeStop();

  if (!profile?.currentWorkJourney) return null;
  if (
    profile.currentWorkJourney.driverStatus !== DriverStatus.STOPPED ||
    profile.currentWorkJourney.lastWorkRecord?.payload?.workStopId ===
      WorkStopsEnum.meal
  )
    return null;

  const { lastWorkRecord } = profile.currentWorkJourney;

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
  padding-top: 10px;
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
