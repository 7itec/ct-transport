import { MediumText, RegularText } from "shared/components/text";
import Permission from "../components/permission";
import Column from "shared/components/column";
import Button from "shared/components/button";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  PERMISSIONS,
  request,
  requestNotifications,
} from "react-native-permissions";
import { Platform, View } from "react-native";
import { router } from "expo-router";
import useNotificationsPermission from "../storage/use-notifications-permission";
import useLocationPermission from "../storage/use-location-permission";
import styled from "styled-components/native";
import useCameraPermission from "../storage/use-camera-permission";

const Permissions: React.FC = () => {
  const { top, bottom } = useSafeAreaInsets();
  const { notificationsPermission, setNotificationsPermission } =
    useNotificationsPermission();
  const { locationPermission, setLocationPermission } = useLocationPermission();
  const { cameraPermission, setCameraPermission } = useCameraPermission();

  const requestNotificationPermission = async () => {
    const response = await requestNotifications([
      "alert",
      "sound",
      "provisional",
      "badge",
      "providesAppSettings",
      "criticalAlert",
    ]);

    if (response.status === "granted") {
      setNotificationsPermission(true);
    }
  };

  const requestLocationPermission = async () => {
    const status = await request(
      Platform.OS === "ios"
        ? PERMISSIONS.IOS.LOCATION_ALWAYS
        : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION
    );

    if (status !== "granted") return;

    if (Platform.OS === "ios") return setLocationPermission(true);

    const backgroundLocationStatus = await request(
      PERMISSIONS.ANDROID.ACCESS_BACKGROUND_LOCATION
    );

    if (backgroundLocationStatus === "granted") setLocationPermission(true);
  };

  const requestCameraPermission = async () => {
    const status = await request(
      Platform.OS === "ios"
        ? PERMISSIONS.IOS.CAMERA
        : PERMISSIONS.ANDROID.CAMERA
    );
    setCameraPermission(status === "granted");
  };

  const finishSetup = async () => {
    if (!locationPermission) return requestLocationPermission();
    if (!cameraPermission) return requestCameraPermission();
    if (!notificationsPermission) await requestNotificationPermission();

    router.replace("/");
  };

  const getButtonLabel = () => {
    if (!locationPermission) return "Permitir localização";
    if (!cameraPermission) return "Permitir câmera";
    if (!notificationsPermission) return "Ativar notificações";
    return "Continuar";
  };

  return (
    <Container style={{ paddingTop: top + 15, paddingBottom: bottom + 15 }}>
      <Column style={{ alignSelf: "center", marginTop: 10 }}>
        <MediumText size="extra-large">Permissões do dispositivo</MediumText>
        <RegularText>
          Simcorpi motorista precisa desse acesso para que seja possível fazer o
          controle da operação e receber avisos
        </RegularText>
      </Column>
      <Column gap={15} style={{ marginTop: 20 }}>
        <Permission
          title="Localização em segundo plano"
          description="Compartilhe sua localização em tempo real para que o cliente possa acompanhar as entregas pendentes"
          icon="location"
          onPress={requestLocationPermission}
          checked={!!locationPermission}
        />
        <Permission
          title="Câmera"
          description="A câmera é utilizada para tratar checklists de veículos e alertas"
          icon="camera"
          onPress={requestCameraPermission}
          checked={!!cameraPermission}
        />
        <Permission
          title="Notificações"
          description="Receba notificações sobre os pedidos pendentes e em andamento"
          icon="notifications"
          onPress={requestNotificationPermission}
          checked={!!notificationsPermission}
        />
      </Column>
      <View style={{ flex: 1 }} />
      <Button label={getButtonLabel()} onPress={finishSetup} />
    </Container>
  );
};

export default Permissions;

const Container = styled.View`
  flex: 1;
  padding: 20px;
  gap: 15px;
  background-color: white;
`;

const Logo = styled.Image`
  margin-top: 30px;
  width: 150px;
  height: 80px;
  resize-mode: contain;
  align-self: center;
`;
