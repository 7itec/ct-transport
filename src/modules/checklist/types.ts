export type VehicleProps = {
  _id: string;
  plate: string;
  model: string;
  speedLimit: number;
  checklistItems: ChecklistItem[];
  disapprovedChecklistItems: ChecklistItem[];
  canSkipChecklist: boolean;
  hasImpedingItems: boolean;
  canBeAttached: boolean;
  type: "CONDUCTOR" | "ATTACHED";
  imageFile?: { url: string };
};

export type ChecklistItem = {
  _id: string;
  status?: "A" | "R";
  name: string;
  description?: string;
  severity: string;
  image?: string;
  video?: string;
  audio?: string;
  blocked?: boolean;
  content?: { text: string };
  alwaysRequireImage: boolean;
  maintenanceItem?: boolean;
};
