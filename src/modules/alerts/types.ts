import {
  AnsweredChecklistItemProps,
  ChecklistItemProps,
  VehicleProps,
} from "modules/checklist/types";
import {
  WorkRecordProps,
  WorkRecordRectificationProps,
} from "modules/work-records/types";

export enum ProtocolNamesEnum {
  NOTIFICAÇÃO_APLICATIVO = "NOTIFICAÇÃO_APLICATIVO",
  EXCESSO_VELOCIDADE = "EXCESSO_VELOCIDADE",
  PARADO_SEM_RESPOSTA = "PARADO_SEM_RESPOSTA",
  MOTORISTA_ENVOLVIDO_ACIDENTE = "MOTORISTA_ENVOLVIDO_ACIDENTE",
  PARADA_COM_ATRASO = "PARADA_COM_ATRASO",
  DEVOLUÇÃO = "DEVOLUÇÃO",
  DESLOCAMENTO_DURANTE_PARADA = "DESLOCAMENTO_DURANTE_PARADA",
  SEM_PARADA_REFEIÇÃO_6H = "SEM_PARADA_REFEIÇÃO_6H",
  DESLOCAMENTO_DURANTE_ATENDIMENTO = "DESLOCAMENTO_DURANTE_ATENDIMENTO",
  AVARIA_CARGA = "AVARIA_CARGA",
  TEMPO_ALMOÇO_EXCEDIDO = "TEMPO_ALMOÇO_EXCEDIDO",
  RECUSA_PARADA_ALMOÇO_6H = "RECUSA_PARADA_ALMOÇO_6H",
  MENSAGEM_RECEBIDA = "MENSAGEM_RECEBIDA",
  CONFIRMAR_RECEBIMENTO_ESTOQUE_MOVEL = "CONFIRMAR_RECEBIMENTO_ESTOQUE_MOVEL",
  JUSTIFICAR_REGISTRO_TRABALHO = "JUSTIFICAR_REGISTRO_TRABALHO",
  AVISO_PREVIO_ENCERRAMENTO_JORNADA = "AVISO_PREVIO_ENCERRAMENTO_JORNADA",
  LIMITE_JORNADA = "LIMITE_JORNADA",
  PRENCHER_CHECKLIST_OEA = "PRENCHER_CHECKLIST_OEA",
  PRENCHER_CHECKLIST_OEA_PALLET = "PRENCHER_CHECKLIST_OEA_PALLET",
}

export interface AlertProps {
  _id: string;
  protocol: {
    _id: string;
    title: string;
    name: ProtocolNamesEnum;
    alertCode: string;
    priority: string;
  };
  createdAt: Date;
  payload: WorkRecordRectificationProps | any;
  validated?: {
    date: Date;
  };
  occurrences?: [];
  workRecord: WorkRecordProps;
  workRecordRectificationId?: string;
}

export interface OeaChecklistAlertProps extends AlertProps {
  payload: {
    job: number;
    checklist: string;
    vehicle: VehicleProps;
    documentNumber: string;
    checklistData: {
      _id: string;
      status: string;
      pendingChecklistItems: ChecklistItemProps[];
      approvedChecklistItems: AnsweredChecklistItemProps[];
      disapprovedChecklistItems: AnsweredChecklistItemProps[];
    };
  };
}
