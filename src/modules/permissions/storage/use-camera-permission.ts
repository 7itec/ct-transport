import useStorage from "hooks/use-storage";

const useCameraPermission = () => {
  const [cameraPermission, setCameraPermission] = useStorage<boolean>(
    "cameraPermission",
    false
  );
  return { cameraPermission, setCameraPermission };
};

export default useCameraPermission;
