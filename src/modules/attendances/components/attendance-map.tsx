import React, { useCallback, useEffect, useRef } from "react";
import MapView, { Marker, Polyline } from "react-native-maps";
import { AttendanceProps } from "../types";
import { colors } from "assets/colors";
import * as turf from "@turf/turf";
import styled from "styled-components/native";
import { MediumText } from "components/text";
import { Ionicons } from "@expo/vector-icons";

const AttendanceMap: React.FC<AttendanceProps> = ({ route, tripulation }) => {
  const mapRef = useRef<MapView>(null);

  const getBoundingBox = () => {
    if (!route) return;

    const turfPoints = route?.paths.map(({ latitude, longitude }) => [
      longitude,
      latitude,
    ]);
    const bbox = turf.bbox(turf.points(turfPoints));

    const minLng = bbox[0];
    const minLat = bbox[1];
    const maxLng = bbox[2];
    const maxLat = bbox[3];

    return {
      latitude: (minLat + maxLat) / 2,
      longitude: (minLng + maxLng) / 2,
      latitudeDelta: (maxLat - minLat) * 1.2 || 0.02,
      longitudeDelta: (maxLng - minLng) * 1.2 || 0.02,
    };
  };

  const fitToCoordinates = () => {
    if (!route) return;
    mapRef.current?.fitToCoordinates(route?.paths, {
      edgePadding: { top: 200, right: 50, bottom: 300, left: 50 },
      animated: true,
    });
  };

  const getPassengersMarkers = useCallback(
    () =>
      route?.roadMap?.map((step, index) => {
        const showIndex =
          index !== 0 && index !== (route?.roadMap?.length || 0) - 1;
        return (
          <Marker
            key={step.description}
            coordinate={{
              latitude: step.latitude,
              longitude: step.longitude,
            }}
          >
            <CircleMarker>
              {showIndex && <MediumText color="white">{index + 1}</MediumText>}
              {!showIndex && index === 0 && (
                <Ionicons name="pin-sharp" color="white" />
              )}
              {!showIndex && index !== 0 && (
                <Ionicons name="flag" color="white" />
              )}
            </CircleMarker>
          </Marker>
        );
      }),
    [tripulation]
  );

  return (
    <MapView
      ref={mapRef}
      style={{ flex: 1 }}
      initialRegion={getBoundingBox()}
      onMapReady={() => fitToCoordinates()}
    >
      {route && (
        <Polyline
          coordinates={route?.paths}
          strokeColor={colors.primary}
          strokeWidth={3}
        />
      )}
      {getPassengersMarkers()}
    </MapView>
  );
};

export default AttendanceMap;

const CircleMarker = styled.View`
  width: 30px;
  height: 30px;
  border-width: 3px;
  border-color: white;
  border-radius: 25px;
  justify-content: center;
  align-items: center;
  background: ${colors.primary};
  elevation: 4;
  overflow: hidden;
`;
