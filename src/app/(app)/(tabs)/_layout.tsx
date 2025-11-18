import React from "react";
import { Redirect, Tabs } from "expo-router";
import useCurrentWorkJourney from "modules/work-journey/hooks/use-current-work-journey";
import { Ionicons } from "@expo/vector-icons";
import dateFnsHelpers from "util/date-fns-helpers";
import useSession from "modules/authentication/storage/use-session";
import { RegularText } from "components/text";
import { truck, truckFilled } from "assets/images";
import { Image } from "react-native";
import { colors } from "assets/colors";
import { DriverStatus, WorkStopsEnum } from "modules/work-journey/types";
import usePassword from "modules/authentication/storage/use-password";
import useUpdateRecentPosition from "modules/geolocation/hooks/use-update-recent-position";

export default function TabLayout() {
  const { data } = useCurrentWorkJourney();
  const { session } = useSession();
  const { encryptedPassword } = usePassword();
  useUpdateRecentPosition();

  const shouldStopForLunch = () => {
    if (!data?.currentWorkJourney) return false;

    const { requiredLunchStop, currentWorkJourney } = data;
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
  if (!data?.currentWorkJourney)
    return <Redirect href="/work-journey/start-work-journey" />;

  if (
    data?.currentWorkJourney?.driverStatus === DriverStatus.STOPPED &&
    data?.currentWorkJourney?.lastWorkRecord?.payload?.workStopId ===
      WorkStopsEnum.meal
  )
    return <Redirect href="/work-journey/lunch-stop-lock" />;

  if (
    dateFnsHelpers.differenceInMinutesFromNow(
      data.currentWorkJourney.registrationDate
    ) -
      (data.currentWorkJourney.totalStopTimeInMinutes ?? 0) >=
    data.companyConfigParameters.maxWorkJourneyTime.minutes
  )
    return <Redirect href="/work-journey/expired-work-journey" />;

  if (data.pendingCampaign) return <Redirect href="/work-journey/edds" />;

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
            <Ionicons
              name={focused ? "notifications" : "notifications-outline"}
              color={focused ? colors.primary : colors.gray}
              size={24}
            />
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
