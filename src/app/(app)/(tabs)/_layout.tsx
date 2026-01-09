import React from "react";
import { Redirect, Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import dateFnsHelpers from "util/date-fns-helpers";
import useSession from "modules/authentication/storage/use-session";
import { RegularText } from "components/text";
import { truck, truckFilled } from "assets/images";
import { Image, View } from "react-native";
import { colors } from "assets/colors";
import { DriverStatus, WorkStopsEnum } from "modules/work-journey/types";
import usePassword from "modules/authentication/storage/use-password";
import useUpdateRecentPosition from "modules/geolocation/hooks/use-update-recent-position";
import { useTasksVerification } from "modules/taks/hooks/use-tasks-verification";
import useStorage from "hooks/use-storage";
import alertsKeys from "modules/alerts/util/alerts-keys";
import { AlertProps } from "modules/alerts/types";
import useProfileStorage from "modules/users/storage/use-profile-storage";

export default function TabLayout() {
  const { profile } = useProfileStorage();
  const { session } = useSession();
  const { encryptedPassword } = usePassword();
  useUpdateRecentPosition();
  useTasksVerification();

  const [alerts] = useStorage<AlertProps[]>(alertsKeys.list());

  const pendingAlerts = alerts?.filter(
    (alert) => alert.protocol.priority === "ALTA"
  )?.length!;

  const shouldStopForLunch = () => {
    if (!profile?.currentWorkJourney) return false;

    const { requiredLunchStop, currentWorkJourney } = profile;
    const lunchStops = currentWorkJourney.stopCounts.lunch;
    const isStopped = currentWorkJourney.driverStatus !== DriverStatus.STOPPED;

    const workJourneyDuration = dateFnsHelpers.differenceInHoursFromNow(
      currentWorkJourney.registrationDate
    );

    return (
      requiredLunchStop &&
      lunchStops === 0 &&
      !isStopped &&
      workJourneyDuration >= 6
    );
  };

  if (!session?.isSession && !!encryptedPassword)
    return <Redirect href="/renew-sesion" />;

  if (!profile?.currentWorkJourney)
    return <Redirect href="/work-journey/start-work-journey" />;

  if (
    profile?.currentWorkJourney?.driverStatus === DriverStatus.STOPPED &&
    profile?.currentWorkJourney?.lastWorkRecord?.payload?.workStopId ===
      WorkStopsEnum.meal
  )
    return <Redirect href="/work-journey/lunch-stop-lock" />;

  if (
    dateFnsHelpers.differenceInMinutesFromNow(
      profile.currentWorkJourney.registrationDate
    ) -
      (profile.currentWorkJourney.totalStopTimeInMinutes ?? 0) >=
    profile.companyConfigParameters.maxWorkJourneyTime.minutes
  )
    return <Redirect href="/work-journey/expired-work-journey" />;

  if (profile.pendingCampaign) return <Redirect href="/work-journey/edds" />;

  if (shouldStopForLunch())
    return <Redirect href="/work-journey/lunch-time-needed" />;

  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen
        name="index"
        options={{
          tabBarLabel: ({ focused }) => (
            <RegularText
              size="extra-small"
              color={focused ? "primary" : "gray"}
            >
              Atendimentos
            </RegularText>
          ),
          tabBarIcon: ({ focused }) => (
            <Image
              source={focused ? truckFilled : truck}
              style={{ width: 30, height: 30 }}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="alerts"
        options={{
          headerShown: true,
          headerTitle: "Alertas",
          tabBarLabel: ({ focused }) => (
            <RegularText
              size="extra-small"
              color={focused ? "primary" : "gray"}
            >
              Alertas
            </RegularText>
          ),
          tabBarIcon: ({ focused }) => (
            <View>
              <Ionicons
                name={focused ? "notifications" : "notifications-outline"}
                color={focused ? colors.primary : colors.gray}
                size={24}
              />
              {pendingAlerts > 0 && (
                <View
                  style={{
                    position: "absolute",
                    bottom: 0,
                    right: -3,
                    width: 15,
                    height: 15,
                    borderRadius: 7.5,
                    backgroundColor: focused ? colors.white : colors.primary,
                    justifyContent: "center",
                    alignItems: "center",
                    elevation: 1,
                  }}
                >
                  <RegularText
                    color={focused ? "primary" : "white"}
                    size="extra-small"
                  >
                    {pendingAlerts}
                  </RegularText>
                </View>
              )}
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="options"
        options={{
          headerShown: true,
          headerTitle: "Opções",
          tabBarLabel: ({ focused }) => (
            <RegularText
              size="extra-small"
              color={focused ? "primary" : "gray"}
            >
              Opções
            </RegularText>
          ),
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name={focused ? "grid" : "grid-outline"}
              color={focused ? colors.primary : colors.gray}
              size={22}
            />
          ),
        }}
      />
    </Tabs>
  );
}
