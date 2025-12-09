import useApi from "hooks/use-api";
import useStorage from "hooks/use-storage";
import { useCallback, useEffect, useRef } from "react";

let __pingTimeout: ReturnType<typeof setTimeout> | null = null;
let __pingRunnerActive = false;
let __lastPingAt = 0;
const PING_INTERVAL_MS = 10_000;

const useServerConnection = () => {
  const api = useApi();
  const [isServerConnection, setServerConnection] = useStorage(
    "serverConnection",
    false
  );
  const isRequesting = useRef(false);

  const pingServer = useCallback(async () => {
    if (isRequesting.current) return;
    isRequesting.current = true;
    __lastPingAt = Date.now();
    try {
      await api.get("/health");
      setServerConnection(true);
    } catch (error) {
      setServerConnection(false);
    } finally {
      isRequesting.current = false;
    }
  }, [setServerConnection]);

  const scheduleNext = useCallback(() => {
    if (!__pingRunnerActive) return;
    if (__pingTimeout) {
      clearTimeout(__pingTimeout);
      __pingTimeout = null;
    }
    const now = Date.now();
    const elapsed = now - __lastPingAt;
    const delay = elapsed >= PING_INTERVAL_MS ? 0 : PING_INTERVAL_MS - elapsed;
    __pingTimeout = setTimeout(async () => {
      if (!__pingRunnerActive) return;
      await pingServer();
      scheduleNext();
    }, delay);
  }, [pingServer]);

  useEffect(() => {
    if (__pingRunnerActive) return; // already running
    __pingRunnerActive = true;

    // Kickoff: align cadence using lastPingAt
    scheduleNext();

    return () => {
      __pingRunnerActive = false;
      if (__pingTimeout) {
        clearTimeout(__pingTimeout);
        __pingTimeout = null;
      }
    };
  }, [scheduleNext]);

  return isServerConnection;
};

export default useServerConnection;
