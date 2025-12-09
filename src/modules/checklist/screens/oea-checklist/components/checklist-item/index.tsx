import React from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import ImageView from "react-native-image-viewing";

import { ActivityIndicator, ScrollView } from "react-native";

import {
  Container,
  Header,
  Dropdown,
  Details,
  Row,
  SpaceBetweenRow,
  MediumText,
  RegularText,
  SemilBoldText,
} from "./styles";

import useChecklistItemState, { ChecklistItemStateProps } from "./state";
import getChecklistItemIcon from "./util/get-checklist-item-icon";
import getChecklistItemColor from "./util/get-checklist-item-color";
import ActionButton from "../action-button";
import Attachment from "./components/attachments";
import { colors } from "assets/colors";
import VideoPlayer from "components/video-player";
import AudioPlayer from "components/audio-player";

const ChecklistItem: React.FC<ChecklistItemStateProps> = (props) => {
  const {
    isPending,
    isAttachment,
    isLoading,
    checklistItem,
    imagePreview,
    setImagePreview,
    answeredItem,
    handleAnswerChecklistItem,
    videoPreview,
    setVideoPreview,
    audioPreview,
    setAudioPreview,
    name,
    plate,
    isApproved,
    isDisapproved,
    handleApproveChecklistItem,
    handleReproveChecklistItem,
  } = useChecklistItemState(props);
  const { opened, setOpened } = props;

  return (
    <Container>
      <Header onPress={setOpened}>
        <SpaceBetweenRow pointerEvents="none">
          <Row gap={5}>
            {isLoading && <ActivityIndicator color={colors.primary} />}
            {!isLoading && (
              <Ionicons
                name={getChecklistItemIcon(answeredItem?.type)}
                color={getChecklistItemColor(answeredItem?.type)}
                size={22}
              />
            )}
            <SemilBoldText size={12}>{checklistItem.name}</SemilBoldText>
          </Row>
          <Ionicons name={opened ? "chevron-up" : "chevron-down"} />
        </SpaceBetweenRow>
      </Header>
      {opened && (
        <Dropdown>
          <Details>
            <SpaceBetweenRow>
              <Row gap={3}>
                <MaterialIcons name="update" size={16} />
                <RegularText>{checklistItem.group}</RegularText>
              </Row>
              <RegularText>{checklistItem.severity}</RegularText>
            </SpaceBetweenRow>
            <RegularText>{checklistItem.description}</RegularText>
            {isAttachment && (
              <>
                <MediumText>Anexos</MediumText>
                <ScrollView
                  horizontal
                  contentContainerStyle={{ gap: 10 }}
                  showsHorizontalScrollIndicator={false}
                >
                  {answeredItem?.reason.text && (
                    <Attachment
                      type="text"
                      title="Mensagem"
                      icon="text-outline"
                      checklistId={props.checklistId}
                      checklistItemId={answeredItem.checklistItem._id}
                      message={answeredItem.reason.text}
                      removeData={{
                        reason: {
                          ...answeredItem.reason,
                          text: null,
                        },
                      }}
                      name={name}
                      plate={plate}
                    />
                  )}
                  {answeredItem?.reason.images &&
                    answeredItem.reason.images.map((image) => (
                      <Attachment
                        key={image.url}
                        type="image"
                        icon="camera-outline"
                        title="Foto"
                        onPreview={() => setImagePreview(image.url)}
                        checklistId={props.checklistId}
                        checklistItemId={answeredItem.checklistItem._id}
                        removeData={{
                          removedAttachment: image,
                          reason: {
                            ...answeredItem.reason,
                            images: answeredItem.reason.images!.filter(
                              (someImage) => someImage.url !== image.url
                            ),
                          },
                        }}
                        name={name}
                        plate={plate}
                      />
                    ))}
                  {answeredItem?.reason.video && (
                    <Attachment
                      type="video"
                      icon="videocam-outline"
                      title="Vídeo"
                      checklistId={props.checklistId}
                      checklistItemId={answeredItem.checklistItem._id}
                      onPreview={() =>
                        setVideoPreview(answeredItem.reason.video!.url)
                      }
                      removeData={{
                        removedAttachment: answeredItem.reason.video!,
                        reason: {
                          ...answeredItem.reason,
                          video: null,
                        },
                      }}
                      name={name}
                      plate={plate}
                    />
                  )}
                  {answeredItem?.reason.audio && (
                    <Attachment
                      type="audio"
                      icon="mic-outline"
                      title="Áudio"
                      checklistId={props.checklistId}
                      checklistItemId={answeredItem.checklistItem._id}
                      onPreview={() =>
                        setAudioPreview(answeredItem.reason.audio?.url)
                      }
                      removeData={{
                        removedAttachment: answeredItem.reason.audio!,
                        reason: {
                          ...answeredItem.reason,
                          audio: null,
                        },
                      }}
                      name={name}
                      plate={plate}
                    />
                  )}
                </ScrollView>
              </>
            )}
          </Details>
          <Row>
            {!isApproved && (
              <ActionButton
                {...{
                  handleAnswerChecklistItem,
                  handleApproveChecklistItem,
                  handleReproveChecklistItem,
                  item: props.item,
                  type: "APPROVED",
                  checklistId: props.checklistId,
                  plate: props.plate,
                }}
              />
            )}
            {!isDisapproved && (
              <ActionButton
                {...{
                  handleAnswerChecklistItem,
                  handleApproveChecklistItem,
                  handleReproveChecklistItem,
                  item: props.item,
                  type: "DISAPPROVED",
                  checklistId: props.checklistId,
                  plate: props.plate,
                }}
              />
            )}
            {(isDisapproved || isApproved) && (
              <ActionButton
                {...{
                  handleAnswerChecklistItem,
                  handleApproveChecklistItem,
                  handleReproveChecklistItem,
                  item: props.item,
                  checklistId: props.checklistId,
                  plate: props.plate,
                }}
              />
            )}
          </Row>
        </Dropdown>
      )}
      {imagePreview && (
        <ImageView
          visible
          images={[{ uri: imagePreview }]}
          imageIndex={0}
          onRequestClose={() => setImagePreview(undefined)}
        />
      )}
      {videoPreview && (
        <VideoPlayer
          url={videoPreview}
          onClose={() => setVideoPreview(undefined)}
        />
      )}
      {audioPreview && (
        <AudioPlayer
          url={audioPreview}
          onClose={() => setAudioPreview(undefined)}
        />
      )}
    </Container>
  );
};

export default ChecklistItem;
