export type VehicleProps = {
  _id: string;
  plate: string;
  model: string;
  speedLimit: number;
  checklistItems: ChecklistItemProps[];
  disapprovedChecklistItems: ChecklistItemProps[];
  canSkipChecklist: boolean;
  hasImpedingItems: boolean;
  canBeAttached: boolean;
  type: "CONDUCTOR" | "ATTACHED";
  imageFile?: { url: string };
};

export type ChecklistItemProps = {
  _id: string;
  status?: "A" | "R";
  name: string;
  description?: string;
  severity: string;
  image?: string;
  video?: string;
  audio?: string;
  blocked?: boolean;
  group: string;
  content?: { text: string };
  alwaysRequireImage: boolean;
  maintenanceItem?: boolean;
};

export interface FileProps {
  url: string;
  key: string;
}

export interface ReasonProps {
  images?: FileProps[];
  text?: string;
  video?: FileProps;
  audio?: FileProps;
}

export interface AnsweredChecklistItemProps {
  checklistItem: ChecklistItemProps;
  reason: ReasonProps;
  status?: string;
  type?: string;
}
