import React, { useState } from "react";
import { ChecklistItemProps } from "modules/checklist/hooks/use-vehicle-checklist-items";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

import { MediumText, RegularText, SemilBoldText } from "components/text";
import { colors } from "assets/colors";

import {
  Container,
  Header,
  Dropdown,
  Details,
  Button,
  Attachment,
} from "./styles";
import BottomSheet, { BottomSheetOptionProps } from "components/bottom-sheet";
import { Alert, ScrollView } from "react-native";
import { AttachmentProps, ChecklistItemStatusEnum } from "../..";
import { Portal } from "@gorhom/portal";
import ReproveText from "modules/checklist/screens/reprove-text";
import Camera from "modules/checklist/screens/camera";
import VideoRecorder from "components/video-recorder";
import VideoPlayer from "components/video-player";
import AudioRecorder from "components/audio-recorder";
import AudioPlayer from "components/audio-player";
import ImageView from "react-native-image-viewing";
import Row from "components/row";

interface Props {
  checklistItem: ChecklistItemProps;
  reproveChecklistItem: (
    checklistItemId: string,
    attachments: AttachmentProps
  ) => void;
  approveChecklistItem: (checklistItemId: string, image?: string) => void;
  openNextItem: (checklistItemId: string) => void;
  type?: ChecklistItemStatusEnum;
  attachments?: AttachmentProps;
  opened: boolean;
  setOpened: () => void;
}

const ChecklistItem: React.FC<Props> = ({
  checklistItem: {
    _id,
    name,
    description,
    period,
    severity,
    alwaysRequireImage,
  },
  attachments,
  reproveChecklistItem,
  approveChecklistItem,
  opened,
  setOpened,
  type,
}) => {
  const [isShowingReproveOptions, showReproveOptions] = useState(false);
  const [isShowingReproveText, showReproveText] = useState(false);
  const [isShowingCamera, showCamera] = useState(false);
  const [isShowingApproveCamera, showApproveCamera] = useState(false);
  const [isShowingVideoRecorder, showVideoRecorder] = useState(false);
  const [isShowingVideoPlayer, showVideoPlayer] = useState(false);
  const [isShowingAudioRecorder, showAudioRecorder] = useState(false);
  const [isShowingAudioPlayer, showAudioPlayer] = useState(false);
  const [imagePreview, showImagePreview] = useState<string>();

  const getChecklistItemIcon = (): keyof typeof Ionicons.glyphMap => {
    if (type === "approved") return "checkmark-circle-outline";
    if (type === "disapproved") return "close-circle-outline";
    return "alert-circle-outline";
  };

  const getChecklistItemIconColor = () => {
    if (type === "approved") return colors.success;
    if (type === "disapproved") return colors.error;
    return colors.warn;
  };

  const handleText = (reason: string) => {
    reproveChecklistItem(_id, { text: reason });
  };

  const handleImage = (image: string) => {
    reproveChecklistItem(_id, { image });
  };

  const handleAppoveWithImage = (image: string) => {
    showApproveCamera(false);
    approveChecklistItem(_id, image);
  };

  const handleVideo = (video: string) => {
    reproveChecklistItem(_id, { video });
  };

  const handleAudio = (audio: string) => {
    reproveChecklistItem(_id, { audio });
  };

  const reproveOptions: BottomSheetOptionProps[] = [
    {
      label: "Anexar texto",
      icon: "text-outline",
      onPress: () => showReproveText(true),
      visible: !attachments?.text,
    },
    {
      label: "Anexar foto",
      icon: "camera-outline",
      onPress: () => showCamera(true),
      visible: !attachments?.image,
    },
    {
      label: "Anexar áudio",
      icon: "mic-outline",
      onPress: () => showAudioRecorder(true),
      visible: !attachments?.audio,
    },
    {
      label: "Anexar vídeo",
      icon: "videocam-outline",
      onPress: () => showVideoRecorder(true),
      visible: !attachments?.video,
    },
  ];

  const handleApproveChecklistItem = () => {
    if (!alwaysRequireImage) return approveChecklistItem(_id);

    showApproveCamera(true);
  };

  return (
    <Container>
      <Header>
        <Row justifyContent="space-between" onPress={setOpened}>
          <Row gap={5}>
            <Ionicons
              name={getChecklistItemIcon()}
              color={getChecklistItemIconColor()}
              size={22}
            />
            <SemilBoldText size="small">{name}</SemilBoldText>
          </Row>
          <Ionicons name={opened ? "chevron-up" : "chevron-down"} />
        </Row>
      </Header>
      {opened && (
        <Dropdown>
          <Details>
            <Row justifyContent="space-between">
              <Row gap={3}>
                <MaterialIcons name="update" size={16} />
                <RegularText>{period}</RegularText>
              </Row>
              <RegularText>{severity}</RegularText>
            </Row>
            <RegularText>{description}</RegularText>
            {typeof attachments === "object" && (
              <>
                <MediumText>Anexos</MediumText>
                <ScrollView
                  horizontal
                  contentContainerStyle={{ gap: 10 }}
                  showsHorizontalScrollIndicator={false}
                >
                  {attachments.text && (
                    <Attachment
                      onPress={() =>
                        Alert.alert("Mensagem em anexo", attachments.text)
                      }
                    >
                      <Ionicons name="text-outline" size={16} />
                      <RegularText>Mensagem</RegularText>
                    </Attachment>
                  )}
                  {attachments.image && (
                    <Attachment
                      onPress={() => showImagePreview(attachments.image)}
                    >
                      <Ionicons name="camera-outline" size={16} />
                      <RegularText>Foto</RegularText>
                    </Attachment>
                  )}
                  {attachments.video && (
                    <Attachment onPress={() => showVideoPlayer(true)}>
                      <Ionicons name="videocam-outline" size={16} />
                      <RegularText>Vídeo</RegularText>
                    </Attachment>
                  )}
                  {attachments.audio && (
                    <Attachment onPress={() => showAudioPlayer(true)}>
                      <Ionicons name="mic-outline" size={16} />
                      <RegularText>Áudio</RegularText>
                    </Attachment>
                  )}
                </ScrollView>
              </>
            )}
          </Details>
          <Row>
            {type !== "approved" && (
              <Button onPress={handleApproveChecklistItem}>
                <RegularText color="white">Aprovar</RegularText>
              </Button>
            )}
            {type !== "disapproved" && (
              <Button
                color={colors.error}
                onPress={() => showReproveOptions(true)}
              >
                <RegularText color="white">Reprovar</RegularText>
              </Button>
            )}
            {type === "disapproved" && (
              <Button
                color={colors.gray}
                onPress={() => showReproveOptions(true)}
              >
                <RegularText color="white">Novo anexo</RegularText>
              </Button>
            )}
          </Row>
        </Dropdown>
      )}
      {isShowingReproveOptions && (
        <BottomSheet
          options={reproveOptions}
          onClose={() => showReproveOptions(false)}
        />
      )}
      <Portal>
        {isShowingReproveText && (
          <ReproveText
            onClose={() => showReproveText(false)}
            onConfirm={handleText}
          />
        )}
        {isShowingCamera && (
          <Camera onClose={() => showCamera(false)} onConfirm={handleImage} />
        )}
        {isShowingApproveCamera && (
          <Camera
            onClose={() => showCamera(false)}
            onConfirm={handleAppoveWithImage}
          />
        )}
      </Portal>
      {isShowingVideoPlayer && attachments?.video && (
        <VideoPlayer
          {...{
            url: attachments.video,
            onClose: () => showVideoPlayer(false),
          }}
        />
      )}
      {isShowingVideoRecorder && (
        <VideoRecorder
          onClose={() => showVideoRecorder(false)}
          onSubmit={handleVideo}
        />
      )}
      {isShowingAudioRecorder && (
        <AudioRecorder
          onClose={() => showAudioRecorder(false)}
          onSubmit={handleAudio}
        />
      )}
      {isShowingAudioPlayer && attachments?.audio && (
        <AudioPlayer
          onClose={() => showAudioPlayer(false)}
          url={attachments.audio}
        />
      )}
      {imagePreview && (
        <ImageView
          visible
          images={[{ uri: imagePreview }]}
          imageIndex={0}
          onRequestClose={() => showImagePreview(undefined)}
        />
      )}
    </Container>
  );
};

export default ChecklistItem;
