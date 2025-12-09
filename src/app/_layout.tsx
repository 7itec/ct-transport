import "expo-router/entry";
import React from "react";
import { DefaultTheme, ThemeProvider } from "@react-navigation/native";

import { Stack, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";
import useStorageManager from "hooks/use-storage-manager";
import Toast, { ErrorToast, SuccessToast } from "react-native-toast-message";
import { colors } from "assets/colors";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { PortalHost, PortalProvider } from "@gorhom/portal";
import { useEffect } from "react";
import { Linking } from "react-native";
import OfflineInfo from "modules/offline-processor/components/offline-info";
import useServerConnection from "modules/offline-processor/hooks/use-server-connection";
import * as SplashScreen from "expo-splash-screen";
import { notificationEmitter } from "util/notification-emitter";
import ErrorBoundary from "react-native-error-boundary";
import ErrorHandler from "components/error-handler";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const { storage } = useStorageManager();
  const isServerConnection = useServerConnection();

  const router = useRouter();

  useEffect(() => {
    const handleDeepLink = async (event: { url: string }) => {
      const url = event.url;

      if (url.includes("msauth")) {
        router.replace("/login");
      }
    };

    Linking.addEventListener("url", handleDeepLink);
    notificationEmitter.addListener("url", handleDeepLink);

    return () => {
      Linking.removeAllListeners("url");
      notificationEmitter.removeAllListeners("url");
    };
  }, []);

  useEffect(() => {
    if (storage) SplashScreen.hide();
  }, [storage]);

  if (!storage) return null;

  return (
    <ErrorBoundary FallbackComponent={ErrorHandler}>
      <GestureHandlerRootView>
        <ThemeProvider value={DefaultTheme}>
          <PortalProvider>
            <Stack screenOptions={{ statusBarStyle: "dark" }}>
              <Stack.Screen name="(app)" options={{ headerShown: false }} />
              <Stack.Screen name="+not-found" />
              <Stack.Screen
                name="permissions"
                options={{ headerShown: false }}
              />
              <Stack.Screen name="login" options={{ headerShown: false }} />
            </Stack>
            {!isServerConnection && <OfflineInfo />}
            <StatusBar style="auto" />
            <PortalHost name="audio-recorder" />
          </PortalProvider>
          <Toast
            onPress={() => Toast.hide()}
            visibilityTime={3000}
            config={{
              success: (props) => (
                <SuccessToast
                  {...props}
                  text2NumberOfLines={3}
                  style={{
                    backgroundColor: colors.success,
                    borderColor: colors.success,
                  }}
                  text1Style={{
                    color: "white",
                  }}
                  text2Style={{
                    color: "white",
                    fontSize: 12,
                  }}
                />
              ),
              error: (props) => (
                <ErrorToast
                  {...props}
                  text2NumberOfLines={3}
                  style={{
                    backgroundColor: colors.error,
                    borderColor: colors.error,
                  }}
                  text1Style={{
                    color: "white",
                  }}
                  text2Style={{
                    color: "white",
                    fontSize: 12,
                  }}
                />
              ),
            }}
          />
        </ThemeProvider>
      </GestureHandlerRootView>
    </ErrorBoundary>
  );
}
