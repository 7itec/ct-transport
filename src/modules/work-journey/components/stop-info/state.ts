import {useAppSelector} from '@app/shared/hooks/use-redux';
import useResumeStop from '@modules/work-journey/hooks/use-resume-stop';

const useStopInfoState = () => {
  const {currentWorkJourney, requestsStatus} = useAppSelector(
    (state) => state.workJourney,
  );
  const {handleResumeStop} = useResumeStop();

  if (!currentWorkJourney) return null;

  return {
    handleResumeStop,
    workStopName: currentWorkJourney.lastWorkRecord.payload.workStopName,
    registrationDate: currentWorkJourney.lastWorkRecord.registrationDate,
    loading: requestsStatus.resumeStop?.loading,
  };
};

export default useStopInfoState;
