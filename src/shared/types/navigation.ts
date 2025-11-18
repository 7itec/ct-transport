import {CompositeScreenProps} from '@react-navigation/native';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import {VehicleProps} from 'modules/checklist/types';

export type RootStackParamList = {
  SelectVehicle: {type?: VehicleProps['type']};
  WorkJourneyVehicles: undefined;
  VehicleChecklist: {vehicleId: string};
  ReproveText: {onSubmit: (reason: string) => void};
  Camera: {onSubmit: (image: string) => void};
};

export type RootStackScreenProps<T extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, T>;

export type HomeTabParamList = {
  Popular: undefined;
  Latest: undefined;
};

export type HomeTabScreenProps<T extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, T>;

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
