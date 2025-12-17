import Button from "components/button";
import React, { useEffect } from "react";
import { useState } from "react";
import { Dimensions } from "react-native";
import MapView, { LatLng, Region } from "react-native-maps";
import {
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { blackMarker, redMarker } from "assets/images";
import mapStyle from "./mapStyle";
import { useBackHandler } from "@react-native-community/hooks";

import { Container, Marker, MarkerIcon, Shadow, Confirm } from "./styles";
import getGpsCoordinates from "modules/geolocation/hooks/get-gps-coordinates";
import Loading from "components/loading";
const SCREEN_HEIGHT = Dimensions.get("window").height;
const MARKER_SIZE = 30;

interface Props {
  coordinates?: LatLng;
  confirm: (data: LatLng) => void;
  close: () => void;
}

const Map: React.FC<Props> = ({ coordinates, confirm, close }) => {
  const active = useSharedValue(false);
  const [center, setCenter] = useState(coordinates);

  const initMap = async () => {
    if (coordinates) return;

    const { latitude, longitude } = await getGpsCoordinates();

    setCenter({ latitude, longitude });
  };

  useEffect(() => {
    initMap();
  }, []);

  useBackHandler(() => {
    close();
    return true;
  });

  const animation = useDerivedValue(() =>
    active.value
      ? SCREEN_HEIGHT / 2 - MARKER_SIZE * 3
      : SCREEN_HEIGHT / 2 - MARKER_SIZE
  );

  const styles = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: withTiming(animation.value),
        },
      ],
    };
  });

  const redMarkerStyles = useAnimatedStyle(() => ({
    opacity: active.value ? 0 : 1,
  }));

  const blackMarkerStyles = useAnimatedStyle(() => ({
    opacity: active.value ? 1 : 0,
  }));

  const handleRegionChange = ({ latitude, longitude }: Region) => {
    active.value = false;
    setCenter({ latitude, longitude });
  };

  const handleConfirm = () => {
    if (center) confirm(center);
  };

  if (!center) return <Loading />;

  return (
    <Container>
      <MapView
        style={{ flex: 1 }}
        initialCamera={{
          center,
          pitch: 0,
          heading: 0,
          altitude: 0,
          zoom: 18,
        }}
        onRegionChange={() => (active.value = true)}
        onRegionChangeComplete={handleRegionChange}
        customMapStyle={mapStyle}
      />
      <Marker style={styles}>
        <MarkerIcon style={redMarkerStyles} source={redMarker} />
        <MarkerIcon style={blackMarkerStyles} source={blackMarker} />
      </Marker>
      <Shadow />
      <Confirm>
        <Button textColor="white" label="Confirmar" onPress={handleConfirm} />
      </Confirm>
    </Container>
  );
};

export default Map;
