import { useState } from "react";
import styled from "styled-components/native";
import { AnswerChecklistItemProps } from "../checklist-item/state";
import ObjectID from "bson-objectid";
import {
  AnsweredChecklistItemProps,
  ChecklistItemProps,
} from "modules/checklist/types";
import isAnsweredItem from "modules/checklist/util/is-answered-item";
import BottomSheet, { BottomSheetOptionProps } from "components/bottom-sheet";
import { colors } from "assets/colors";
import { RegularText } from "components/text";
import { Pressable } from "react-native";
import ReproveText from "modules/checklist/screens/reprove-text";
import Camera from "modules/checklist/screens/camera";
import AudioRecorder from "components/audio-recorder";
import VideoRecorder from "components/video-recorder";

interface Props {
  checklistId: string;
  plate: string;
  item: ChecklistItemProps | AnsweredChecklistItemProps;
  handleAnswerChecklistItem: (data: AnswerChecklistItemProps) => void;
  handleApproveChecklistItem: () => void;
  handleReproveChecklistItem: () => void;
  type?: "APPROVED" | "DISAPPROVED";
}

const ActionButton: React.FC<Props> = ({
  checklistId,
  item,
  handleAnswerChecklistItem,
  handleApproveChecklistItem,
  handleReproveChecklistItem,
  plate,
  type,
}) => {
  const [isShowingBottomSheet, showBottomSheet] = useState(false);
  const [isShowingCamera, showCamera] = useState(false);
  const [isShowingVideoCamera, showVideoCamera] = useState(false);
  const [isShowingAudioRecorder, showAudioRecorder] = useState(false);
  const [isShowingTextWindow, showTextWindow] = useState(false);

  const answeredItem = isAnsweredItem(item) ? item : undefined;
  const isAudio = !!answeredItem?.reason.audio;
  const isVideo = !!answeredItem?.reason.video;
  const isText = !!answeredItem?.reason.text;

  const isApproved = answeredItem?.status === "APPROVED";
  const isDisapproved = answeredItem?.status === "DISAPPROVED";

  const { _id, name } = isAnsweredItem(item) ? item.checklistItem : item;

  const options: BottomSheetOptionProps[] = [
    {
      label: "Anexar texto",
      icon: "text-outline",
      onPress: () => showTextWindow(true),
      visible: !isText,
    },
    {
      label: "Anexar foto",
      icon: "camera-outline",
      onPress: () => showCamera(true),
    },
    {
      label: "Anexar áudio",
      icon: "mic-outline",
      visible: !isAudio,
      onPress: () => showAudioRecorder(true),
    },
    {
      label: "Anexar vídeo",
      icon: "videocam-outline",
      visible: !isVideo,
      onPress: () => showVideoCamera(true),
    },
  ];

  const getKey = (url: string) => {
    const splittedUrl = url.split(".");
    const extension = splittedUrl[splittedUrl.length - 1];

    const _id = new ObjectID().toHexString();

    return { key: `${_id}.${extension}`, _id };
  };

  const getLabel = () => {
    if (type === "APPROVED") return "Aprovar";
    if (type === "DISAPPROVED") return "Reprovar";
    return "Adicionar anexo";
  };

  const getColor = () => {
    if (type === "APPROVED") return colors.success;
    if (type === "DISAPPROVED") return colors.error;
    return colors.info;
  };

  return (
    <>
      <Button
        color={getColor()}
        onPress={() =>
          type === "APPROVED"
            ? handleApproveChecklistItem()
            : type === "DISAPPROVED"
            ? handleReproveChecklistItem()
            : showBottomSheet(true)
        }
      >
        <RegularText color="white">{getLabel()}</RegularText>
      </Button>
      {isShowingBottomSheet && (
        <BottomSheet {...{ options }} onClose={() => showBottomSheet(false)} />
      )}
      {isShowingTextWindow && (
        <ReproveText
          onConfirm={(text) =>
            handleAnswerChecklistItem({
              text,
            })
          }
          onClose={() => showTextWindow(false)}
        />
      )}
      {isShowingCamera && (
        <Camera
          onConfirm={(url) =>
            handleAnswerChecklistItem({
              reason: { url, ...getKey(url) },
            })
          }
          onClose={() => showCamera(false)}
        />
      )}
      {isShowingAudioRecorder && (
        <AudioRecorder
          onSubmit={(url) => {
            handleAnswerChecklistItem({
              reason: { url, ...getKey(url) },
            });
          }}
          onClose={() => showAudioRecorder(false)}
        />
      )}
      {isShowingVideoCamera && (
        <VideoRecorder
          onSubmit={(url) =>
            handleAnswerChecklistItem({
              reason: { url, ...getKey(url) },
            })
          }
          onClose={() => showVideoCamera(false)}
        />
      )}
    </>
  );
};

export default ActionButton;

interface ButtonProps {
  color?: string;
}

export const Button = styled(Pressable)<ButtonProps>`
  flex: 1;
  background-color: ${(props) => props.color};
  padding: 10px 0;
  justify-content: center;
  align-items: center;
`;
