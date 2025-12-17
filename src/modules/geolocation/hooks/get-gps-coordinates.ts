import Location from "react-native-background-geolocation";

const getGpsCoordinates = async () => {
  const { coords } = await Location.getCurrentPosition({
    desiredAccuracy: Location.DESIRED_ACCURACY_HIGH,
  });

  return coords;
};

export default getGpsCoordinates;
