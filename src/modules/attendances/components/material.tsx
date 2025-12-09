import Column from "components/column";
import Row from "components/row";
import { MediumText } from "components/text";
import React from "react";
import { StyleSheet } from "react-native";
import styled from "styled-components/native";
import AttendanceAddress from "./attendance-address";
import { AttendanceStatusEnum, MaterialProps } from "../types";

import formatAddress from "util/format-address";

const Material: React.FC<
  MaterialProps & {
    attendanceId: string;
    attendanceStatus: AttendanceStatusEnum;
  }
> = ({ name, originAddress, destinyAddress }) => {
  return (
    <Card style={{ flexDirection: "column", gap: 10 }}>
      <Row justifyContent="space-between">
        <Row gap={10}>
          <Column>
            <MediumText size="small">{name}</MediumText>
          </Column>
        </Row>
      </Row>
      <AttendanceAddress
        origin={formatAddress(originAddress)}
        destination={formatAddress(destinyAddress)}
      />
    </Card>
  );
};

export default Material;

const Card = styled.Pressable`
  flex-direction: row;
  padding: 15px;
  border-radius: 8px;
  border: ${StyleSheet.hairlineWidth}px;
  border-color: rgba(128, 128, 128, 0.4);
  gap: 10px;
  elevation: 1;
  background-color: white;
`;
