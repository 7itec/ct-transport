import useSession from "modules/authentication/storage/use-session";
import useToken from "modules/authentication/storage/use-token";
import React, { useEffect } from "react";
import { AppState } from "react-native";

interface Props {
  children: React.ReactNode;
}

const SessionProvider: React.FC<Props> = ({ children }) => {
  const { usageStatusChange } = useSession();
  const { token } = useToken();

  useEffect(() => {
    const listener = AppState.addEventListener(
      "change",
      (status) => token && usageStatusChange(status)
    );

    return () => {
      listener.remove();
      usageStatusChange("inactive");
    };
  }, [token]);

  return <>{children}</>;
};

export default SessionProvider;
