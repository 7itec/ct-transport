import React from "react";

import styled from "styled-components/native";
import { StyleSheet } from "react-native";
import { WorkRecordProps } from "modules/work-records/types";
import { Ionicons } from "@expo/vector-icons";
import dateFnsHelpers from "util/date-fns-helpers";

interface Props {
  workRecord: WorkRecordProps;
}

const WorkRecord: React.FC<Props> = ({ workRecord }) => {
  const getColor = (type: string) => {
    switch (type) {
      case "Atendimento":
        return "#232d63";
      case "Jornada de trabalho":
        return "#00BBF9";
      case "Checklist":
        return "#fca326";
      case "Parada":
        return "#b1294a";
      default:
        return "#0ead69";
    }
  };

  return (
    <Container>
      <CardContent>
        <Row>
          <TitleRow>
            <Name>
              {workRecord.translatedName.toUpperCase()}
              {workRecord.workStopName &&
                ` - ${workRecord.workStopName.toUpperCase()}`}
            </Name>
            <EditRow>
              <Ionicons name="lock-closed" />
              <Registration>Não editável</Registration>
            </EditRow>
          </TitleRow>
          <Type color={getColor(workRecord.typeRef)}>{workRecord.typeRef}</Type>
        </Row>
        {!isNaN(Number(workRecord.stoppedTimeInMinutes)) && (
          <Registration>
            Duração da parada: {workRecord.stoppedTimeInMinutes} minutos
          </Registration>
        )}
        <Registration>
          Data de registro:{" "}
          {dateFnsHelpers.defaultFormat(workRecord.registrationDate)}
        </Registration>
      </CardContent>
    </Container>
  );
};

export default WorkRecord;

const Container = styled.View`
  background-color: white;
  gap: 10px;
  border-radius: 10px;
  border-width: ${StyleSheet.hairlineWidth}px;
`;

const Row = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 15px;
`;

const CardContent = styled.View`
  padding: 15px;
`;

const TitleRow = styled.View`
  flex: 1;
`;

const Name = styled.Text`
  color: black;
  font-weight: bold;
`;

const EditRow = styled.View`
  flex-direction: row;
  align-items: center;
`;

interface TypeColors {
  color: string;
}

const Type = styled.Text<{ color: string }>`
  color: white;
  background-color: ${(props) => props.color};
  padding: 3px 5px;
  font-size: 14px;
  border-radius: 4px;
  margin-left: 5px;
`;

const Registration = styled.Text``;
