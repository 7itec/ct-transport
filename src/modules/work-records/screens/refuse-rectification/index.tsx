import { StyleSheet, View } from "react-native";

import Button from "components/button";
import { useState } from "react";
import { Stack, useLocalSearchParams } from "expo-router";

import AudioRecorder from "components/audio-recorder";
import styled from "styled-components/native";
import Row from "components/row";
import { RegularText, SemilBoldText } from "components/text";
import { TextInput } from "react-native-gesture-handler";
import Column from "components/column";
import { Ionicons } from "@expo/vector-icons";
import AudioPlayer from "components/audio-player";
import useRefuseRectification from "modules/work-records/hooks/use-refuse-rectification";
import useLogs from "hooks/use-logs";

const RefuseRectification = () => {
  const { workRecordRectificationId, alertId } = useLocalSearchParams<{
    workRecordRectificationId: string;
    alertId: string;
  }>();
  const [isShowingAudioRecorder, showAudioRecorder] = useState(false);
  const [isShowingAudioPlayer, showingAudioPlayer] = useState(false);
  const [audio, setAudio] = useState<string>();
  const [text, setText] = useState<string>();

  const trackEvent = useLogs();

  const refuseRectificationMutationn = useRefuseRectification(
    workRecordRectificationId
  );

  const handleSubmit = () => {
    const formData = new FormData();

    if (audio)
      formData.append("audio", {
        uri: audio,
        name: `${workRecordRectificationId}.mp3`,
        type: "audio/mp3",
      } as any);

    if (text) formData.append("text", text);

    trackEvent("Refuse Rectification", {
      workRecordRectificationId,
      alertId,
    });

    refuseRectificationMutationn.mutate(formData);
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#f1f0f5" }}>
      <Stack.Screen
        options={{ title: "Recusar justificativa", headerShown: true }}
      />
      <Container>
        <SemilBoldText size="medium">Anexos</SemilBoldText>
        <Card
          onPress={() =>
            audio ? showingAudioPlayer(true) : showAudioRecorder(true)
          }
        >
          <Row gap={10} justifyContent="space-between">
            <RegularText>Áudio</RegularText>
            <Ionicons
              name={audio ? "play-circle" : "mic"}
              size={audio ? 22 : 18}
            />
          </Row>
        </Card>
        <Card>
          <Column gap={10}>
            <RegularText>Texto</RegularText>
            <TextInput
              multiline
              onChangeText={setText}
              placeholder="Anexar mensagem de texto"
              style={{
                height: 150,
                borderWidth: StyleSheet.hairlineWidth,
                borderColor: "rgba(128, 128, 128, .4)",
                borderRadius: 4,
                textAlignVertical: "top",
                paddingHorizontal: 10,
              }}
            />
          </Column>
        </Card>
        <Button
          label="RECUSAR"
          onPress={handleSubmit}
          isLoading={refuseRectificationMutationn.isLoading}
        />
      </Container>
      {isShowingAudioRecorder && (
        <AudioRecorder
          onClose={() => showAudioRecorder(false)}
          onSubmit={setAudio}
        />
      )}

      {isShowingAudioPlayer && audio && (
        <AudioPlayer onClose={() => showingAudioPlayer(false)} url={audio} />
      )}
    </View>
  );
};

export default RefuseRectification;

const Container = styled.ScrollView.attrs({
  contentContainerStyle: {
    padding: 15,
    gap: 15,
  },
})`
  background-color: #f1f0f5;
`;

const Card = styled.Pressable`
  padding: 15px;
  border-radius: 10px;
  background-color: white;
  width: 100%;
  gap: 5px;
`;
