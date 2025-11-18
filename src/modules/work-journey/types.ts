import { TimesProps } from "types/times";

export enum DriverStatus {
  "IDLE" = "IDLE",
  "IN_DISPLACEMENT" = "IN_DISPLACEMENT",
  "STOPPED" = "STOPPED",
}

export enum LunchTimeStatus {
  PENDING = "PENDING",
  EXCEEDED = "EXCEEDED",
  FINISHED = "FINISHED",
  IGNORED = "IGNORED",
  GUARANTEED = "GUARANTEED",
  DENIED = "DENIED",
}

export interface InterjourneyTimingProps {
  total: TimesProps;
  overtime: {
    previous: TimesProps;
    mandatory: TimesProps;
    mandatoryTotal: TimesProps;
    total: TimesProps;
    pending: TimesProps;
    compensated: TimesProps;
  };
}

export type LastWorkRecordProps = {
  _id: string;
  registrationDate: Date;
  name: string;
  payload: any;
  workStopId: string;
  previousDriverStatus: DriverStatus;
  latitude: number;
  longitude: number;
};

export interface SuggestedWorkJourneyEndDatesProps {
  date: Date;
  address: string;
}

export interface NonWorkScheduleProps {
  startDate: Date;
  endDate: Date;
  scale: string;
}

export type CurrentWorkJourneyProps = {
  _id: string;
  registrationDate: Date;
  lunchTimeStatus: LunchTimeStatus;
  displacement: {
    date?: Date;
    job?: string;
  };
  conductorVehicle?: any;
  attachedVehicles: any[];
  driverStatus: DriverStatus;
  totalStopTimeInMinutes: number;
  lastWorkRecord: LastWorkRecordProps;
  suggestedWorkJourneyEndDates?: SuggestedWorkJourneyEndDatesProps[];
  nonWorkSchedule?: NonWorkScheduleProps;
  timing: {
    stops: { lunch: { minutes: number } };
    interjourney: InterjourneyTimingProps;
  };
  stopCounts: { lunch: number };
  hasLimitReachedAlert?: boolean;
};

export type UserProps = {
  _id?: string;
  driverId?: number;
  companyName?: string;
  driverName?: string;
  group: any;
  avatar?: string;
  isStopped: boolean;
  config?: {
    _id: string;
    maxTimeToCancelStop: number;
  };
  requiredLunchStop: boolean;
  companyConfigParameters: {
    maxWorkJourneyTime: TimesProps;
    standardWorkJourneyTime: TimesProps;
  };
  currentWorkJourney?: CurrentWorkJourneyProps;
  standBy: { startDate: Date; endDate: Date };
  lastWorkJourneyEndedAt?: Date;
  nextWorkJourneyMinStartDate?: Date;
  nonWorkSchedule?: NonWorkScheduleProps;
  pendingCampaign?: {
    _id: string;
    video: string;
    orientation: "Portrait" | "Landscape";
  };
  activeSecurityCampaign?: {
    _id: string;
    video: string;
    orientation: "Portrait" | "Landscape";
  };
};

export interface WorkStopProps {
  _id: string;
  name: string;
  type: string;
  groups: string[];
}

export enum WorkStopsEnum {
  meal = "6089676928bd342d0a07392b",
  rest = "5f6e6c039f33e07dbd483b0b",
  fuel = "5f16b7e5d1ae4d16e0000bc1",
  accident = "5fa562bbee9233092b7b28c2",
  waiting = "6034d112a6a729b058435282",
  maintenance = "60d1e9d09b053f1fd5e7c8a4",
  endWorkJourney = "615ef9b93c10b21a534bfa5a",
  stopAttendance = "603777d9adec3f199ca35c74",
}
