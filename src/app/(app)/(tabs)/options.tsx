import React from "react";
import { FontAwesome, FontAwesome5, Ionicons } from "@expo/vector-icons";
import { colors } from "assets/colors";
import Option from "components/option";
import Row from "components/row";
import { nativeApplicationVersion } from "expo-application";
import { router } from "expo-router";
import useSession from "modules/authentication/storage/use-session";
import useHandleEndWorkJourney from "modules/work-journey/hooks/use-handle-end-work-journey";
import useRemoveVehicle from "modules/work-journey/hooks/use-remove-vehicle";
import useGps from "modules/geolocation/hooks/use-gps";
import { Alert } from "react-native";
import useCurrentWorkJourney from "modules/work-journey/hooks/use-current-work-journey";
import { DriverStatus } from "modules/work-journey/types";

const Options: React.FC = () => {
  const location = useGps();
  const { endSession } = useSession();
  const removeVehicleMutation = useRemoveVehicle();
  const profileQuery = useCurrentWorkJourney();

  const { handleEndWorkDay, isLoading } = useHandleEndWorkJourney();

  const handleRemoveVehicle = () => {
    Alert.alert("Remover veículo", "Deseja realmente remover o veículo?", [
      { text: "Não" },
      {
        text: "Sim",
        onPress: () =>
          removeVehicleMutation.mutate({
            latitude: location?.latitude,
            longitude: location?.longitude,
            registrationDate: new Date(),
          }),
      },
    ]);
  };

  return (
    <Row
      gap={15}
      style={{
        alignItems: "flex-start",
        flexWrap: "wrap",
        paddingLeft: 15,
        paddingTop: 15,
      }}
    >
      <Option
        {...{
          name: "Encerrar jornada",
          icon: <FontAwesome name="flag" size={18} color={colors.white} />,
          onPress: () => handleEndWorkDay(),
          isLoading: isLoading,
          description: "Encerrar expediente e finalizar jornada de trabalho",
        }}
      />
      {profileQuery.data?.currentWorkJourney?.conductorVehicle && (
        <Option
          {...{
            name: "Liberar veículo",
            icon: <FontAwesome5 name="car" size={18} color={colors.white} />,
            onPress: handleRemoveVehicle,
            description:
              "Libere o veículo para que outra pessoa possa utilizar",
            isLoading: removeVehicleMutation.isLoading,
          }}
        />
      )}
      {profileQuery.data?.currentWorkJourney?.driverStatus !==
        DriverStatus.STOPPED && (
        <Option
          {...{
            name: "Realizar parada",
            icon: (
              <FontAwesome5 name="stopwatch" size={18} color={colors.white} />
            ),
            onPress: () => router.push("/work-journey/work-stops"),
            description: "Marcar paradana jornada de trabalho",
          }}
        />
      )}
      <Option
        {...{
          name: "Criar deslocamento",
          icon: <Ionicons name="arrow-redo" size={18} color={colors.white} />,
          onPress: () => router.push("/attendances/displacement"),
          description: "Crie um deslocamento de retorno",
        }}
      />
      <Option
        {...{
          name: "Meus dados",
          icon: <Ionicons name="person" size={18} color={colors.white} />,
          onPress: () => router.push("/profile"),
          description: "Visualizar e alterar dados da conta",
        }}
      />
      {profileQuery.data?.activeSecurityCampaign && (
        <Option
          {...{
            name: "Briefing de Segurança",
            icon: <Ionicons name="videocam" size={18} color={colors.white} />,
            onPress: () => router.push("/briefing/security-briefing"),
            description: "Visualizar vídeo de segurança",
          }}
        />
      )}
      <Option
        {...{
          name: "Sincronismo",
          icon: <Ionicons name="sync-outline" size={20} color={colors.white} />,
          onPress: () => router.push("/offline-processor/syncing"),
          description: "Progresso do sincronismo",
        }}
      />
      <Option
        {...{
          name: "Versão do aplicativo",
          icon: <Ionicons name="code-working" size={20} color={colors.white} />,
          description: `${nativeApplicationVersion}`,
        }}
      />
      <Option
        {...{
          name: "Encerrar sessão",
          icon: <Ionicons name="exit" size={20} color={colors.white} />,
          onPress: endSession,
          description: "Será necessário informar a senha novamente",
        }}
      />
    </Row>
  );
};

export default Options;
