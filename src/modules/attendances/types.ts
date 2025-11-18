import { VehicleProps } from "modules/checklist/types";

export interface AddressProps {
  _id: string;
  name: string;
  city: string;
  state: string;
  uf: string;
  streetNumber: number;
  neighborhood: string;
  country: string;
  street: string;
  fullAddress: string;
  latitude: number;
  longitude: number;
}

export interface CoordinatesProps {
  latitude: number;
  longitude: number;
}

export interface PassengerProps {
  _id: string;
  name: string;
  phone: string;
  email: string;
  costCenter: Array<string>;
  serviceLine: string;
  baggageAmount: number;
  observations: string;
  baggageSize: "Pequena" | "Média" | "Grande";
  status: string;
  pcd?: boolean;
  originAddress: AddressProps;
  destinyAddress: AddressProps;
  job: Omit<AttendanceProps, "commentsSection">;
  routeDuration: number;
  routeDurationText: string;
  routePolyline?: string;
  jobId: string;
  jobServiceType?: string;
  isVip: boolean;
  role: string;
  routeGeometry?: any;
  registrationNumber?: number;
}

export enum AttendanceStatusEnum {
  Pending = "Programada",
  Accepted = "Aceito",
  Rejected = "Recusado",
  Displacement = "Deslocamento",
  Arrival = "Chegada",
  Stopped = "Parado",
  Finished = "Finalizado",
  InAttendance = "Atendimento",
}

export interface AttendanceProps {
  _id: string;
  title: string;
  companyName: string;
  startDate: Date;
  endDate: Date;
  observations: string;
  tripulation: PassengerProps[];
  destinyAddress: AddressProps;
  originAddress: AddressProps;
  vehicle: VehicleProps;
  route: {
    paths: CoordinatesProps[];
    digitalTaxiPaths: CoordinatesProps[];
    origin: AddressProps;
    destiny: AddressProps;
    distance: number;
    roadMap?: {
      distance: number;
      latitude: number;
      longitude: number;
      type: "check-in" | "check-out";
      passengerId: string;
      description: string;
      duration: number;
      date: Date;
    }[];
  };
  serviceType: string;
  status: AttendanceStatusEnum;
  previousStatus: AttendanceStatusEnum;
  jobId: string;
  isPcd?: boolean;
  isVip?: boolean;
  hasFullDayAvailability?: boolean;
  buildingName: string;
}
