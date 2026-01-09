import { FileProps } from "../types";

export interface AddOeaAttachmentProps {
  checklistId: string;
  checklistItemId: string;
  date: Date;
  checklistItemStatusText?: string;
  reason?: FileProps;
}

export default (
  { reason, ...data }: AddOeaAttachmentProps,
  sendReason = true
) => {
  const formData = new FormData();

  formData.append("checklistData", JSON.stringify(data));

  if (!reason || !sendReason || typeof reason === "string") return formData;

  const { key, url } = reason;
  const splittedUrl = url.split(".");
  const extension = splittedUrl[splittedUrl.length - 1];

  if (extension === "jpg")
    formData.append("files", {
      uri: url,
      name: `${key}.jpg`,
      type: "image/jpeg",
    } as unknown as File);

  if (["mp3", "caf"].includes(extension))
    formData.append("files", {
      uri: url,
      name: `${key}.${extension}`,
      type: `audio/${extension}`,
    } as unknown as File);

  if (["mp4", "mov", "m4a"].includes(extension))
    formData.append("files", {
      uri: url,
      name: `${key}.${extension}`,
      type: `video/${extension}`,
    } as unknown as File);

  return formData;
};
