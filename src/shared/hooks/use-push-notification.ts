import notifee, {
  AndroidImportance,
  Event,
  EventType,
} from "@notifee/react-native";
import {
  FirebaseMessagingTypes,
  getMessaging,
  onMessage,
  setBackgroundMessageHandler,
  subscribeToTopic,
} from "@react-native-firebase/messaging";
import useCurrentWorkJourney from "modules/work-journey/hooks/use-current-work-journey";
import { useEffect } from "react";
import { notificationEmitter } from "util/notification-emitter";

const usePushNotification = () => {
  const { data } = useCurrentWorkJourney();
  const messaging = getMessaging();

  const onMessageReceived = async ({
    notification,
    data,
  }: FirebaseMessagingTypes.RemoteMessage) => {
    if (!notification) return;

    const channelId = await notifee.createChannel({
      id: "important",
      name: "Important Notifications",
      importance: AndroidImportance.HIGH,
    });

    await notifee.displayNotification({
      title: notification?.title,
      body: notification?.body,
      data,
      ios: {
        foregroundPresentationOptions: {
          badge: true,
          sound: true,
          banner: true,
          list: true,
        },
        interruptionLevel: "critical",
      },
      android: { channelId, importance: AndroidImportance.HIGH },
    });
  };

  const onNotificationPress = async ({ type, detail }: Event) => {
    const appUrl = detail.notification?.data?.appUrl;

    if (type !== EventType.PRESS || !appUrl) return;

    notificationEmitter.emit("url", { url: appUrl });
  };

  const setupPushNotifications = async () => {
    await onMessage(messaging, onMessageReceived);
    await setBackgroundMessageHandler(messaging, onMessageReceived);
  };

  const setupUserTopics = async () => {
    await subscribeToTopic(messaging, data!._id!);
  };

  useEffect(() => {
    setupPushNotifications();

    const unsubscribe = notifee.onForegroundEvent(onNotificationPress);
    notifee.onBackgroundEvent(onNotificationPress);

    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (data?._id) setupUserTopics();
  }, [data?._id]);
};

export default usePushNotification;
