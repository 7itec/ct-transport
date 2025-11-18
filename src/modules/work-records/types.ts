export enum WorkRecordNames {
  STOPPED = "STOPPED",
  RESUMED_STOP = "RESUMED_STOP",
  WORK_JOURNEY_STARTED = "WORK_JOURNEY_STARTED",
  WORK_JOURNEY_ENDED = "WORK_JOURNEY_ENDED",
}

export enum WorkRecordFilterTypes {
  WorkJourney = "Jornada de trabalho",
  Job = "Atendimento",
  Stop = "Parada",
  Checklist = "Checklist",
  DayOff = "Folga",
}

export enum RectificationTypes {
  WORK_STOP = "WORK_STOP",
  STOP_INSERTION = "STOP_INSERTION",
  WORK_JOURNEY_SEPARATION = "WORK_JOURNEY_SEPARATION",
  DATE = "DATE",
  MULTIPLE_DATE = "MULTIPLE_DATE",
  MULTIPLE_STOP_INSERTION = "MULTIPLE_STOP_INSERTION",
}

export enum WorkRecordRectificationStatus {
  PENDING = "PENDING",
  COMPLETED = "COMPLETED",
  DENIED = "DENIED",
}

export interface WorkRecordRectificationProps {
  type: RectificationTypes;
  status: WorkRecordRectificationStatus;
  content: {
    text?: string;
    audio?: string;
  };
  workRecordId: string;
  name: string;
}

export interface WorkRecordProps {
  _id: string;
  name: WorkRecordNames;
  typeRef: WorkRecordFilterTypes;
  registrationDate: Date;
  translatedName: string;
  workStopName?: string;
  stoppedTimeInMinutes?: number;
  previousWorkRecord?: {
    registrationDate: Date;
  };
  nextWorkRecord: {
    registrationDate: Date;
  };
}

export interface UpdateWorkRecordDateProps
  extends WorkRecordRectificationProps {
  type: RectificationTypes.DATE;
}

export interface UpdateWorkStopTypeProps extends WorkRecordRectificationProps {
  type: RectificationTypes.WORK_STOP;
  workStopId: string;
  previousWorkStop: string;
  requestedWorkStopChange: string;
}

export interface StopInsertionProps extends WorkRecordRectificationProps {
  type: RectificationTypes.STOP_INSERTION;
  workStopId: string;
  workStopName: string;
  startDate: Date;
  endDate: Date;
}

export interface WorkJourneySeparationProps
  extends WorkRecordRectificationProps {
  type: RectificationTypes.WORK_JOURNEY_SEPARATION;
  startDate: Date;
  endDate: Date;
}

export interface MultiDateWorkRecordProps {
  _id: string;
  name: WorkRecordNames;
  newRegistrationDate: Date;
  registrationDate: Date;
}
