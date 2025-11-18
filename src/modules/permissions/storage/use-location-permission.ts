import useStorage from "hooks/use-storage";

const useLocationPermission = () => {
  const [locationPermission, setLocationPermission] = useStorage<boolean>(
    "locationPermission",
    false
  );

  return { locationPermission, setLocationPermission };
};

export default useLocationPermission;
