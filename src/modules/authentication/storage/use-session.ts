import useStorage from "hooks/use-storage";
import { useCallback } from "react";
import { AppStateStatus } from "react-native";
import dateFnsHelpers from "util/date-fns-helpers";

interface SessionProps {
  isSession: boolean;
  expiresAt?: Date;
}

const useSession = () => {
  const [session, setSession] = useStorage<SessionProps>("session");

  const startSession = () => {
    setSession({ isSession: true, expiresAt: undefined });
  };

  const endSession = () => {
    setSession({ isSession: false, expiresAt: undefined });
  };

  const usageStatusChange = useCallback(
    (status: AppStateStatus) => {
      {
        if (!session.expiresAt) session.expiresAt = new Date();

        if (status !== "active") return setSession(session);

        if (
          dateFnsHelpers.differenceInSecondsFromNow(session.expiresAt) >
          60 * 60 * 10
        )
          session.isSession = false;

        setSession({ ...session, expiresAt: undefined });
      }
    },
    [session, setSession]
  );

  return { session, startSession, endSession, usageStatusChange };
};

export default useSession;
