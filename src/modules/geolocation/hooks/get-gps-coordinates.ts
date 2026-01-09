import BackgroundGeolocation from "react-native-background-geolocation";

const getGpsCoordinates = async () => {
  const { coords } = await BackgroundGeolocation.getCurrentPosition({
    samples: 1,
    timeout: 30,
    maximumAge: 10_000,
    desiredAccuracy: 10,
  });

  return coords;
};

export default getGpsCoordinates;
