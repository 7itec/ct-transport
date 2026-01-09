import { Stack, useLocalSearchParams } from "expo-router";
import useToken from "modules/authentication/storage/use-token";
import { chatBaseApiURL } from "hooks/use-chat-api";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import Loading from "components/loading";
import { MessageProps } from "modules/chat/types";
import ChatBubble from "modules/chat/components/chat-bubble";
import ChatTextInput from "../components/chat-text-input";
import { FlatList } from "react-native-gesture-handler";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { View } from "react-native";
import useProfileStorage from "modules/users/storage/use-profile-storage";

const Chat: React.FC = () => {
  const { token } = useToken();
  const { attendanceId } = useLocalSearchParams<{ attendanceId: string }>();
  const { bottom } = useSafeAreaInsets();
  const [messages, setMessages] = useState<MessageProps[]>();
  const { profile } = useProfileStorage();
  const scrollViewRef = useRef<FlatList>(null);

  const chatSocket = useMemo<Socket>(() => {
    return io(chatBaseApiURL, { query: { token }, path: "/socket.io" });
  }, []);

  const scrollToEnd = () => {
    if (scrollViewRef?.current) {
      scrollViewRef.current.scrollToOffset({ animated: false, offset: 0 });
    }
  };

  useEffect(() => {
    chatSocket.emit("getRoom", { roomName: attendanceId });

    chatSocket.once("room", (room) => {
      if (room.messages) setMessages(room.messages);
    });
  }, []);

  const handleSendMessage = useCallback(
    (message: string) => {
      if (!message) return;

      const content = {
        message,
        sentAt: new Date(),
        user: {
          name: profile?.driverName!,
          externalId: profile?._id!,
        },
      };

      chatSocket.emit("message", {
        roomName: attendanceId,
        messageDto: content,
      });

      setMessages((messages) => [...(messages ?? []), content]);
      scrollToEnd();
    },
    [setMessages, chatSocket]
  );

  const handleJoinRoom = useCallback(
    () =>
      chatSocket.emit("joinRoom", {
        roomName: attendanceId,
        username: profile?.driverName,
        externalId: profile?._id,
      }),
    []
  );

  useEffect(() => {
    handleJoinRoom();
  }, [chatSocket]);

  useEffect(() => {
    const onMessage = (message: MessageProps) => {
      if (message?.user?.externalId === profile?._id) return;
      if (typeof message === "object") {
        setMessages((prev) => [...(prev ?? []), message]);
      }
      scrollToEnd();
    };

    chatSocket.on("message", onMessage);

    return () => {
      chatSocket.off("message", onMessage);
      chatSocket.disconnect();
    };
  }, [chatSocket, profile?._id]);

  return (
    <View style={{ flex: 1, paddingBottom: bottom }}>
      <Stack.Screen options={{ headerShown: true, title: "Chat" }} />
      <FlatList
        inverted
        ListEmptyComponent={!messages ? <Loading flex /> : undefined}
        data={[...(messages ?? [])].reverse()}
        ref={scrollViewRef}
        renderItem={({ item: message }) => <ChatBubble {...message} />}
        style={{
          backgroundColor: "#f1f0f5",
        }}
        contentContainerStyle={{
          flexGrow: messages ? undefined : 1,
          gap: 12,
          paddingTop: 15,
        }}
      />
      {messages && <ChatTextInput onMessage={handleSendMessage} />}
    </View>
  );
};

export default Chat;
