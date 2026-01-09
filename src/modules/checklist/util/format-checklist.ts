import { ChecklistDraftProps } from "../screens/vehicle-checklist";
import { VehicleProps } from "../types";

interface Props {
  vehicle: VehicleProps;
  checklist: ChecklistDraftProps[];
  registrationDate: Date;
  latitude: number;
  longitude: number;
}

export default ({
  vehicle,
  checklist,
  registrationDate,
  latitude,
  longitude,
}: Props) => {
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
    approvedChecklistItems,
    disapprovedChecklistItems,
    supportMaterials: {
      approved: [],
      disapproved: [],
      returned: [],
      requested: [],
    },
    latitude,
    longitude,
  };

  formData.append("checklistData", JSON.stringify(data));

  return formData;
};
