import { ChecklistDraftProps } from "../screens/vehicle-checklist";
import { VehicleProps } from "../types";

interface Props {
  vehicle: VehicleProps;
  checklist: ChecklistDraftProps[];
  registrationDate: Date;
}

export default ({ vehicle, checklist, registrationDate }: Props) => {
  const formData = new FormData();

  const approvedChecklistItems = checklist.filter(
    (checklistItem) => checklistItem.type === "approved"
  );

  const disapprovedChecklistItems = checklist
    .filter((checklistItem) => checklistItem.type === "disapproved")
    .map(({ _id, text }) => ({
      _id,
      text,
    }));

  checklist.forEach((checklistItem) => {
    const { _id, image, audio, video } = checklistItem;

    if (image)
      formData.append("files", {
        uri: image,
        name: `${_id}.jpg`,
        type: "image/jpeg",
      });
    if (audio)
      formData.append("files", {
        uri: audio,
        name: `${_id}.mp3`,
        type: "audio/mp3",
      });
    if (video)
      formData.append("files", {
        uri: video,
        name: `${_id}.mp4`,
        type: "video/mp4",
      });
  });

  const data = {
    registrationDate,
    vehicle: vehicle._id,
    latitude: -21.039145,
    longitude: -51.237164,
    approvedChecklistItems,
    disapprovedChecklistItems,
    supportMaterials: {
      approved: [],
      disapproved: [],
      returned: [],
      requested: [],
    },
  };

  formData.append("checklistData", JSON.stringify(data));

  return formData;
};
