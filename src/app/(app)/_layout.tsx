import { Redirect, Stack } from "expo-router";

import useLocationPermission from "modules/permissions/storage/use-location-permission";
import useCameraPermission from "modules/permissions/storage/use-camera-permission";
import useToken from "modules/authentication/storage/use-token";
import useCurrentWorkJourney from "modules/work-journey/hooks/use-current-work-journey";
import Loading from "components/loading";
import useSession from "modules/authentication/storage/use-session";
import { useEffect } from "react";
import { AppState, Platform } from "react-native";
import { DriverStatus } from "modules/work-journey/types";
import StopInfo from "modules/work-journey/components/stop-info";
import useOfflineProcessor from "modules/offline-processor/hooks/use-offline-processor";
import useMinVersion from "hooks/use-min-version";
import { nativeBuildVersion } from "expo-application";
import usePushNotification from "hooks/use-push-notification";

export default function RootLayout() {
  const { isLoading, data } = useCurrentWorkJourney();
  const { locationPermission } = useLocationPermission();
  const { cameraPermission } = useCameraPermission();
  const { token } = useToken();
  const { usageStatusChange, session } = useSession();
  const minVersionQuery = useMinVersion();
  useOfflineProcessor();
  usePushNotification();

  useEffect(() => {
    const subscription = AppState.addEventListener("change", usageStatusChange);

    return () => {
      subscription.remove();
    };
  }, [session]);

  if (
    (Platform.OS === "android" &&
      +minVersionQuery.data?.androidAppMinVersion > +nativeBuildVersion!) ||
    (Platform.OS === "ios" &&
      +minVersionQuery.data?.iosAppMinVersion > +nativeBuildVersion!)
  )
    return <Redirect href="/force-update" />;

  if (!locationPermission || !cameraPermission)
    return <Redirect href="/permissions" />;
  if (!token) return <Redirect href="/login" />;

  if (isLoading || !data) return <Loading />;

  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
      </Stack>
      {data?.currentWorkJourney?.driverStatus === DriverStatus.STOPPED && (
        <StopInfo />
      )}
    </>
  );
}
