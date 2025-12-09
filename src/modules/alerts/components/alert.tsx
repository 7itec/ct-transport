import React from "react";
import styled from "styled-components/native";
import { AlertProps, ProtocolNamesEnum } from "../types";
import { MediumText, RegularText } from "components/text";
import Row from "components/row";
import dateFnsHelpers from "util/date-fns-helpers";
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Alert as RNAlert, AlertButton } from "react-native";
import StatusButton from "components/status-button";
import { colors } from "assets/colors";
import useValidateAlert from "../hooks/use-validate-alert";
import Loading from "components/loading";
import useHandleEndWorkJourney from "modules/work-journey/hooks/use-handle-end-work-journey";
import Toast from "react-native-toast-message";
import useServerConnection from "modules/offline-processor/hooks/use-server-connection";
import { RectificationTypes } from "modules/work-records/types";
import { router } from "expo-router";

const Alert: React.FC<AlertProps> = (alert) => {
  const { _id, protocol, createdAt, payload, validated, occurrences } = alert;
  const description = payload?.content?.text;
  const { finishJourney } = useHandleEndWorkJourney();
  const isServerConnection = useServerConnection();

  const validateAlertMutation = useValidateAlert(_id);

  const handleAlertPress = () => {
    if (!payload && protocol.name !== ProtocolNamesEnum.EXCESSO_VELOCIDADE)
      return;

    const { text, audio } = payload ?? {};

    const alertMessageButtons: AlertButton[] = [
      {
        text: "Validar",
        onPress: () => validateAlertMutation.mutate(),
      },
    ];

    switch (protocol.name) {
      case ProtocolNamesEnum.MENSAGEM_RECEBIDA:
        return RNAlert.alert(
          "Mensagem de áudio",
          text ??
            "Nova mensagem recebida, verifique o áudio e/ou mensagem e valide.",
          alertMessageButtons
        );
      case ProtocolNamesEnum.JUSTIFICAR_REGISTRO_TRABALHO:
        return goToRectification();
      case ProtocolNamesEnum.EXCESSO_VELOCIDADE:
        return RNAlert.alert(
          protocol.title,
          `${occurrences?.length} ocorrência(s) de excesso de velocidade identificada(s) e informada(s) ao operacional.`,
          [
            {
              text: "Validar",
              onPress: () => validateAlertMutation.mutate(),
            },
            { text: "Ok" },
          ]
        );
      case ProtocolNamesEnum.AVISO_PREVIO_ENCERRAMENTO_JORNADA:
        return RNAlert.alert(
          "Encerrar jornada de trabalho",
          "Deseja realmente encerrar a jornada de trabalho?",
          [
            {
              text: "cancelar",
            },
            {
              text: "encerrar",
              onPress: finishJourney,
            },
          ]
        );
      case ProtocolNamesEnum.PRENCHER_CHECKLIST_OEA_PALLET:
      case ProtocolNamesEnum.PRENCHER_CHECKLIST_OEA:
        return "";
      default:
        return RNAlert.alert(
          protocol.title,
          text ?? "Novo alerta recebido, verifique o mesmo e valide.",
          [
            {
              text: "Validar",
              onPress: () => validateAlertMutation.mutate(),
            },
            { text: "Ok" },
          ]
        );
    }
  };

  const goToRectification = () => {
    const { content } = alert.payload ? alert.payload : { content: undefined };
    const { text, audio } = content;

    if (!isServerConnection)
      return Toast.show({
        type: "error",
        text1: "Erro ao justificar registro",
        text2:
          "Não é possível realizar uma justificativa de um registro sem conexão a internet",
      });

    const params = {
      alertId: alert._id,
      workRecordId: alert.workRecord?._id,
      text,
      audio,
      workRecordRectificationId: alert.workRecordRectificationId,
    };

    if (!payload?.type) return;

    if (payload.type === RectificationTypes.DATE)
      return router.push({
        pathname: "/work-records/[workRecordId]/date",
        params,
      });
    if (payload.type === RectificationTypes.MULTIPLE_STOP_INSERTION)
      return router.push({
        pathname: "/work-records/multiple-stop-insertion",
        params,
      });
    if (payload.type === RectificationTypes.WORK_STOP)
      return router.push({
        pathname: "/work-records/[workRecordId]/work-stop",
        params,
      });
    if (payload.type === RectificationTypes.MULTIPLE_DATE)
      return router.push({
        pathname: "/work-records/rectify-multiple-dates",
        params,
      });
  };

  return (
    <Container {...{ validated: !!validated }} onPress={handleAlertPress}>
      <Row justifyContent="space-between">
        <Row gap={5} style={{ flexShrink: 1 }}>
          <MediumText>{protocol.title}</MediumText>
          {validateAlertMutation.isLoading && (
            <Loading size={18} flex={false} />
          )}
        </Row>
        <StatusButton
          {...{
            text: protocol.priority,
            backgroundColor:
              protocol.priority === "ALTA"
                ? "#e34f2f"
                : protocol.priority === "MÉDIA"
                ? "#fdba1d"
                : "#228be6",
          }}
        />
      </Row>
      {description && <RegularText>{description}</RegularText>}
      <Row gap={5}>
        <Ionicons name="calendar-outline" size={22} />
        <RegularText>{dateFnsHelpers.defaultFormat(createdAt)}</RegularText>
      </Row>
    </Container>
  );
};

export default Alert;

interface ContainerProps {
  validated?: boolean;
}

const Container = styled.Pressable<ContainerProps>`
  padding: 15px;
  background-color: white;
  gap: 10px;
  border-radius: 10px;
  border-width: ${StyleSheet.hairlineWidth}px;
  border-color: ${(props) =>
    !props.validated ? colors.warn : "rgba(128, 128, 128, 0.2)"};
`;
