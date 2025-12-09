import useAddOeaAttachment from "modules/checklist/hooks/use-add-oea-attachment";
import useApproveOeaItem from "modules/checklist/hooks/use-approve-oea-item";
import useReproveOeaItem from "modules/checklist/hooks/use-reprove-oea-item";
import {
  AnsweredChecklistItemProps,
  ChecklistItemProps,
  FileProps,
} from "modules/checklist/types";
import isAnsweredItem from "modules/checklist/util/is-answered-item";
import { useState } from "react";

export interface UpdateReasonProps {
  images?: FileProps[];
  text?: string | null;
  video?: FileProps | null;
  audio?: FileProps | null;
}

export interface AnswerChecklistItemProps {
  text?: string;
  reason?: FileProps;
}

export interface ChecklistItemStateProps {
  plate: string;
  checklistId: string;
  item: ChecklistItemProps | AnsweredChecklistItemProps;
  opened: boolean;
  setOpened: () => void;
}

const useChecklistItemState = ({
  checklistId,
  item,
  plate,
}: ChecklistItemStateProps) => {
  const answeredItem = isAnsweredItem(item) ? item : undefined;
  const checklistItem = !isAnsweredItem(item) ? item : undefined;
  const { _id, name, description, group, severity } =
    answeredItem?.checklistItem ?? checklistItem!!;
  const [imagePreview, setImagePreview] = useState<string>();
  const [videoPreview, setVideoPreview] = useState<string>();
  const [audioPreview, setAudioPreview] = useState<string>();

  const isPending = !answeredItem;
  const isAttachment =
    answeredItem?.reason.text ||
    answeredItem?.reason.video ||
    answeredItem?.reason.audio ||
    (answeredItem && answeredItem.reason.images!.length > 0);
  const isApproved = answeredItem?.type === "APPROVED";
  const isDisapproved = answeredItem?.type === "DISAPPROVED";

  const approveOeaItemMutation = useApproveOeaItem(checklistId);
  const reproveOeaItemMutation = useReproveOeaItem(checklistId);
  const addOeaAttachmentMutation = useAddOeaAttachment(checklistId);

  const handleApproveChecklistItem = async () => {
    approveOeaItemMutation.mutate({
      checklistItemId: _id,
    });
  };

  const handleReproveChecklistItem = async () => {
    reproveOeaItemMutation.mutate({
      checklistItemId: _id,
    });
  };

  const handleAnswerChecklistItem = async ({
    reason,
    text,
  }: AnswerChecklistItemProps) => {
    addOeaAttachmentMutation.mutate({
      checklistItemId: _id,
      date: new Date(),
      checklistItemStatusText: text,
      reason,
    });
  };

  return {
    isPending,
    isAttachment,
    isLoading:
      approveOeaItemMutation.isLoading ||
      reproveOeaItemMutation.isLoading ||
      addOeaAttachmentMutation.isLoading,
    checklistItem: { _id, name, description, group, severity },
    imagePreview,
    setImagePreview,
    answeredItem,
    handleAnswerChecklistItem,
    handleApproveChecklistItem,
    handleReproveChecklistItem,
    videoPreview,
    setVideoPreview,
    audioPreview,
    setAudioPreview,
    name,
    plate,
    isApproved,
    isDisapproved,
  };
};

export default useChecklistItemState;
