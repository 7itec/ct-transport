import { FlexAlignType } from "react-native";
import { MessageProps } from "modules/chat/types";
import dateFnsHelpers from "util/date-fns-helpers";
import styled from "styled-components/native";
import { deviceWidth } from "util/metrics";
import { LightText, MediumText, RegularText } from "components/text";
import useProfileStorage from "modules/users/storage/use-profile-storage";

const ChatBubble: React.FC<MessageProps> = ({ user, message, sentAt }) => {
  const { profile } = useProfileStorage();
  const isMe = profile?._id === user?.externalId;
  const isSystemMessage = user?.name === "system";

  const characteristics = (): {
    borderBottomRightRadius: number;
    borderBottomLeftRadius: number;
    alignSelf: FlexAlignType;
    backgroundColor: string;
    marginLeft?: number;
    marginRight?: number;
  } => {
    if (isMe) {
      return {
        borderBottomRightRadius: 0,
        borderBottomLeftRadius: 12,
        alignSelf: "flex-end",
        backgroundColor: "rgba(34, 139, 230, 0.2)",
        marginRight: 12,
      };
    }

    return {
      borderBottomRightRadius: 12,
      borderBottomLeftRadius: isSystemMessage ? 12 : 0,
      alignSelf: isSystemMessage ? "center" : "flex-start",
      backgroundColor: "white",
      marginLeft: 12,
    };
  };

  return (
    <ChatBubbleContainer {...characteristics()}>
      {!isMe && !isSystemMessage && user?.name && (
        <MediumText>{user?.name}</MediumText>
      )}
      <RegularText>{message}</RegularText>
      {sentAt && (
        <LightText
          size="small"
          textAlign={isMe ? "right" : isSystemMessage ? "center" : "left"}
        >
          {dateFnsHelpers.defaultFormat(sentAt)}
        </LightText>
      )}
    </ChatBubbleContainer>
  );
};

export default ChatBubble;

const ChatBubbleContainer = styled.View`
  padding: 8px;
  border-top-right-radius: 12px;
  border-top-left-radius: 12px;
  max-width: ${deviceWidth * 0.7}px;
  gap: 3px;
`;
