import { MaterialCommunityIcons } from "@expo/vector-icons";
import { colors } from "assets/colors";
import { MediumText, RegularText } from "components/text";

import {
  ActivityIndicator,
  Alert,
  Pressable,
  StyleSheet,
  View,
} from "react-native";
import styled from "styled-components/native";
import useOfflineRequests, {
  OfflineRequestProps,
} from "../hooks/use-offline-requests";
import Column from "components/column";
import Row from "components/row";
import dateFnsHelpers from "util/date-fns-helpers";

const OfflineRequest: React.FC<OfflineRequestProps> = (request) => {
  const { url, status, updatedAt, data } = request;
  const { resolveRequest, updateOfflineRequest } = useOfflineRequests();

  const getAttachmentType = () => {
    if (!data?.reason) return "TEXTO";

    const { url } = data?.reason;

    const splittedUrl = url.split(".");
    const extension = splittedUrl[splittedUrl.length - 1];

    if (extension === "jpg") return "IMAGEM";
    if (["mp3", "caf", "m4a"].includes(extension)) return "ÁUDIO";

    if (["mp4", "mov"].includes(extension)) return "VÍDEO";
  };

  const getLabel = () => {
    if (url.includes("add") && data?.checklistItemStatusText === "")
      return <MediumText>REMOVER ANEXO</MediumText>;
    if (url.includes("remove")) return <MediumText>REMOVER ANEXO</MediumText>;
    if (url.includes("add"))
      return <MediumText>NOVO ANEXO - {getAttachmentType()}</MediumText>;
    if (url.includes("alerts")) return <MediumText>VALIDAR ALERTA</MediumText>;
    if (url.includes("accepted")) return <MediumText>ACEITAR ATENDIMENTO</MediumText>;
    if (url.includes("arrival")) return <MediumText>COLOCAR ATENDIMENTO EM CHEGADA</MediumText>;
    if (url.includes("check-in")) return <MediumText>REALIZAR CHECK IN</MediumText>;
    if (url.includes("check-out")) return <MediumText>REALIZAR CHECK OUT</MediumText>;
    if (url.includes("displacement")) return <MediumText>COLOCAR ATENDIMENTO EM DESLOCAMENTO</MediumText>;
    if (url.includes("resumed")) return <MediumText>FINALIZAR PARADA NO ATENDIMENTO</MediumText>;
    if (url.includes("finished")) return <MediumText>FINALIZAR ATENDIMENTO</MediumText>;
    if (url.includes("no-show")) return <MediumText>FINALIZAR NO-SHOW</MediumText>;
    if (url.includes("refused")) return <MediumText>RECUSAR ATENDIMENTO</MediumText>;
    if (url.includes("attendance")) return <MediumText>INICIAR ATENDIMENTO</MediumText>;
    if (url.includes("login")) return <MediumText>LOGIN</MediumText>;
    if (url.includes("check-availability")) return <MediumText>BUSCAR DETALHES DO VEÍCULO</MediumText>;
    if (url.includes("profile-picture")) return <MediumText>ATUALIZAR FOTO DE PERFIL</MediumText>;
    if (url.includes("vehicles-history")) return <MediumText>CONFIRMAR VEÍCULO</MediumText>;
    if (url.includes("rectification")) return <MediumText>CRIAR JUSTIFICATIVA</MediumText>;
    if (url.includes("end")) return <MediumText>FINALIZAR JORNADA DE TRABALHO</MediumText>;
    if (url.includes("seen")) return <MediumText>FINALIZAR CAMPANHA</MediumText>;
    if (url.includes("clear")) return <MediumText>REMOVER VEÍCULO</MediumText>;
    if (url.includes("resumed-stop")) return <MediumText>FINALIZAR PARADA</MediumText>;
    if (url.includes("work-journeys")) return <MediumText>JORNADA DE TRABALHO</MediumText>;
    if (url.includes("stopped")) return <MediumText>FINALIZAR PARADA</MediumText>;

    return <MediumText>FINALIZAÇÃO DE VISTORIA</MediumText>;
  };

  const getStatusLabel = () => {
    if (status === "error") return "Erro";
    if (status === "pending") return "Pendente";
    if (status === "resolving") return "Sincronizando";
    return "Ok";
  };

  const handleResolveRequest = () => {
    updateOfflineRequest({ ...request, status: "resolving" });
    resolveRequest(request);
  };

  const handleSyncAgain = () => {
    if (status !== "resolving") return;

    Alert.alert(
      "Refazer requisição",
      "Deseja realmente refazer a requisição?",
      [
        { text: "Cancelar" },
        {
          text: "Refazer",
          onPress: () =>
            updateOfflineRequest({ ...request, status: "pending" }),
        },
      ]
    );
  };

  return (
    <Container onPress={handleSyncAgain}>
      <Column>
        <Row gap={5}>
          {getLabel()}
          {status === "resolving" && (
            <ActivityIndicator color={colors.primary} />
          )}
          {status === "error" && (
            <Pressable onPress={handleResolveRequest}>
              <MaterialCommunityIcons name="reload" size={22} />
            </Pressable>
          )}
        </Row>
        <Row>
          {data?.plate && <RegularText>{data.plate}</RegularText>}
          {data?.name && <RegularText> - {data.name}</RegularText>}
        </Row>
        <Row justifyContent="space-between" style={{ width: "100%" }}>
          <RegularText>
            Atualizado em:{" "}
            {updatedAt ? dateFnsHelpers.defaultFormat(updatedAt) : "nunca"}
          </RegularText>
          <View
            style={{
              paddingVertical: 3,
              paddingHorizontal: 4,
              borderRadius: 3,
              backgroundColor:
                status === "success"
                  ? colors.success
                  : status === "error"
                  ? colors.error
                  : colors.warn,
            }}
          >
            <RegularText size="small" color="white">
              {getStatusLabel()}
            </RegularText>
          </View>
        </Row>
      </Column>
    </Container>
  );
};

export default OfflineRequest;

const Container = styled.Pressable`
  background-color: white;
  padding: 15px;
  border-radius: 8px;
  border-width: ${StyleSheet.hairlineWidth}px;
  border-color: rgba(128, 128, 128, 0.4);
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;
