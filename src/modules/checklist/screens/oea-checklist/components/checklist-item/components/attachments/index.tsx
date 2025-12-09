import React from "react";
import Ionicons from "@expo/vector-icons/Ionicons";

import { ActivityIndicator, Alert } from "react-native";
import { Button, RegularText } from "./styles";
import useRemoveOeaText from "modules/checklist/hooks/use-remove-oea-text";
import useRemoveOeaAttachment from "modules/checklist/hooks/use-remove-oea-attachment";
import { ReasonProps } from "modules/checklist/types";
import { colors } from "assets/colors";

export interface UpdateReasonProps {
  images?: { url: string }[];
  text?: string | null;
  video?: { url: string } | null;
  audio?: { url: string } | null;
}

interface Props {
  type: "image" | "audio" | "video" | "text";
  icon: string;
  title: string;
  removeData: {
    removedAttachment?: { url: string; key?: string; _id?: string };
    reason: UpdateReasonProps;
  };
  message?: string;
  checklistId: string;
  checklistItemId: string;
  onPreview?: () => void;
}

const Attachment: React.FC<Props> = ({
  removeData,
  icon,
  title,
  message,
  type,
  checklistId,
  checklistItemId,
  onPreview,
}) => {
  const getAlertTitle = () => {
    if (type === "text") return "Mensagem";
    if (type === "audio") return "Áudio";
    if (type === "video") return "Vídeo";
    return "Imagem";
  };

  const removeOeaTextMutation = useRemoveOeaText(checklistId);
  const removeOeaAttachmentMutation = useRemoveOeaAttachment(checklistId);

  const handleRemoveAttachment = async () => {
    const { removedAttachment, reason } = removeData;
    const date = new Date();

    if (!removedAttachment)
      return removeOeaTextMutation.mutate({
        checklistItemId,
        date,
      });

    removeOeaAttachmentMutation.mutate({
      checklistItemId,
      attachmentKey: removedAttachment!._id!,
      date,
      reason: reason as ReasonProps,
    });
  };

  const handleOnPress = () =>
    Alert.alert(
      getAlertTitle(),
      message ?? "Escolha entre visualizar ou remover o anexo",
      [
        {
          text: "Remover",
          onPress: handleRemoveAttachment,
        },
        { text: message ? "Ok" : "Visualizar", onPress: onPreview },
      ]
    );

  return (
    <Button
      onPress={handleOnPress}
      disabled={
        removeOeaTextMutation.isLoading || removeOeaAttachmentMutation.isLoading
      }
    >
      <Ionicons name={icon as any} size={16} />
      <RegularText>{title}</RegularText>
      {(removeOeaTextMutation.isLoading ||
        removeOeaAttachmentMutation.isLoading) && (
        <ActivityIndicator size={16} color={colors.primary} />
      )}
    </Button>
  );
};

export default Attachment;
