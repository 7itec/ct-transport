import React, { useRef, useState } from "react";

import { FlatList, ListRenderItemInfo, StatusBar, View } from "react-native";

import {
  Container,
  Header,
  Content,
  Card,
  Overlay,
  SemilBoldText,
  RegularText,
  SpaceBetweenRow,
  BoldText,
  Column,
} from "./styles";

import ChecklistItem from "./components/checklist-item";
import useAlert from "modules/alerts/hooks/use-alert";
import { Stack, useLocalSearchParams } from "expo-router";
import Button from "components/button";
import {
  AnsweredChecklistItemProps,
  ChecklistItemProps,
} from "modules/checklist/types";
import Toast from "react-native-toast-message";
import { OeaChecklistAlertProps } from "modules/alerts/types";
import isAnsweredItem from "modules/checklist/util/is-answered-item";
import { isAtLeastOneReason } from "modules/checklist/util/is-at-least-one-reason";

export interface AttachmentProps {
  text?: string;
  images?: string[];
  audio?: string;
  video?: string;
}

export type ChecklistProps = "approved" | "disapproved";

const OeaChecklist = () => {
  const [isLoading, setLoading] = useState(false);
  const { alertId } = useLocalSearchParams<{ alertId: string }>();
  const alertQuery = useAlert(alertId);

  const alert = alertQuery.data as OeaChecklistAlertProps | undefined;

  const [opened, setOpened] = useState<number>();
  const flatListRef = useRef<FlatList>(null);

  if (!alert) return null;

  const {
    job,
    vehicle,
    documentNumber,
    checklistData: {
      _id,
      pendingChecklistItems = [],
      approvedChecklistItems = [],
      disapprovedChecklistItems = [],
    },
  } = alert?.payload;

  const sortItems = (
    itemA: ChecklistItemProps | AnsweredChecklistItemProps,
    itemB: ChecklistItemProps | AnsweredChecklistItemProps
  ) => {
    const firstItemName = isAnsweredItem(itemA)
      ? itemA.checklistItem.name
      : itemA.name;

    const secondItemName = isAnsweredItem(itemB)
      ? itemB.checklistItem.name
      : itemB.name;

    return firstItemName.localeCompare(secondItemName);
  };

  const checklistItems = [
    ...pendingChecklistItems,
    ...approvedChecklistItems.map((item) => ({ ...item, type: "APPROVED" })),
    ...disapprovedChecklistItems.map((item) => ({
      ...item,
      type: "DISAPPROVED",
    })),
  ].sort(sortItems);

  const toggleOpened = (index: number) => {
    if (opened === index) return setOpened(undefined);

    setOpened(index);
  };

  const handleFinishChecklist = async () => {
    if (pendingChecklistItems.length > 0)
      return Toast.show({
        type: "error",
        text1: "Erro ao finalizar checklist",
        text2: "Ainda existem itens pendentes",
      });

    const answeredItemWithoutAttachment = [
      ...approvedChecklistItems,
      ...disapprovedChecklistItems,
    ].find(
      ({ checklistItem, reason, type }) =>
        (checklistItem.severity === "ALTA" ||
          checklistItem.alwaysRequireImage ||
          type === "DISAPPROVED") &&
        !isAtLeastOneReason(reason)
    );

    if (answeredItemWithoutAttachment)
      return Toast.show({
        type: "error",
        text1: "Erro ao finalizar checklist",
        text2: `Não foi adicionado nenhum anexo para o item ${answeredItemWithoutAttachment.checklistItem.name}.`,
      });
  };

  const renderItem = ({
    item,
    index,
  }: ListRenderItemInfo<ChecklistItemProps | AnsweredChecklistItemProps>) => {
    return (
      <ChecklistItem
        {...{
          item,
          opened: index === opened,
          setOpened: () => toggleOpened(index),
          checklistId: _id,
          plate: alert?.payload.vehicle.plate,
        }}
      />
    );
  };

  return (
    <Container>
      <Stack.Screen options={{ title: "Checklist OEA" }} />
      <FlatList
        ref={flatListRef}
        contentContainerStyle={{ paddingBottom: 15 }}
        ItemSeparatorComponent={() => <View style={{ height: 15 }} />}
        ListFooterComponent={
          <Button
            label="Finalizar"
            {...{
              isLoading,
              onPress: handleFinishChecklist,
            }}
          />
        }
        ListFooterComponentStyle={{ padding: 15, marginTop: 10 }}
        ListHeaderComponent={
          <>
            {!!vehicle.imageFile?.url && (
              <Header
                resizeMode="center"
                source={{
                  uri: vehicle.imageFile?.url,
                }}
              >
                <Overlay />
              </Header>
            )}
            <Content>
              <SemilBoldText>Veículo</SemilBoldText>
              <Card>
                <Column>
                  <BoldText size={16}>{vehicle.plate}</BoldText>
                  <RegularText size={12}>Modelo: {vehicle.model}</RegularText>
                </Column>
                <SpaceBetweenRow>
                  <Column>
                    <RegularText color="gray" size={12}>
                      Checklist
                    </RegularText>
                    <RegularText>
                      {
                        [
                          ...approvedChecklistItems,
                          ...disapprovedChecklistItems,
                        ].length
                      }
                      /{checklistItems.length}
                    </RegularText>
                  </Column>
                  <Column>
                    <RegularText color="gray" size={12}>
                      Atendimento
                    </RegularText>
                    <RegularText>{job ?? "N/A"}</RegularText>
                  </Column>
                  <Column>
                    <RegularText color="gray" size={12}>
                      CTE
                    </RegularText>
                    <RegularText>{documentNumber ?? "N/A"}</RegularText>
                  </Column>
                </SpaceBetweenRow>
              </Card>
              <SemilBoldText>Itens do checklist</SemilBoldText>
            </Content>
          </>
        }
        {...{
          data: checklistItems,
          renderItem,
        }}
      />
    </Container>
  );
};

export default OeaChecklist;
