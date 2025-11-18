import { useState } from "react";
import { FontAwesome } from "@expo/vector-icons";
import styled from "styled-components/native";
import { Platform } from "react-native";
import { colors } from "assets/colors";

interface ChatTextInputProps {
  onMessage(message: string): void;
}

const ChatTextInput: React.FC<ChatTextInputProps> = ({ onMessage }) => {
  const [message, setMessage] = useState("");

  return (
    <Container>
      <TextInput multiline value={message} onChangeText={setMessage} />
      <SendButton
        onPress={() => {
          onMessage(message);
          setMessage("");
        }}
      >
        <FontAwesome
          style={{ marginLeft: -5 }}
          size={40 / 2}
          color="white"
          name="send"
        />
      </SendButton>
    </Container>
  );
};

export default ChatTextInput;

const Container = styled.View`
  justify-content: center;
  align-items: flex-start;
  flex-direction: row;
  border-top-width: 0.5px;
  border-top-color: #f1f0f5;
  background-color: white;
  elevation: 5;
  padding: 15px;
  padding-bottom: 15px;
  gap: 15px;
`;

const TextInput = styled.TextInput`
  flex: 1;
  font-size: 14px;
  border-width: ${Platform.OS === "android" ? 1 : 0.2}px;
  border-color: rgba(128, 128, 128, 0.4);
  border-radius: 24px;
  color: black;
  background-color: rgba(128, 128, 128, 0.05);
  padding: 12px;
`;

const SendButton = styled.TouchableOpacity`
  width: 45px;
  height: 45px;
  border-radius: 25px;
  background-color: ${colors.primary};
  justify-content: center;
  align-items: center;
`;
