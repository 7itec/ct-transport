import React, { useEffect, useRef, useState } from "react";

import Loading from "components/loading";

import { BoldText, RegularText, SemilBoldText } from "components/text";

import useVehicleChecklistItems, {
  ChecklistItemProps,
} from "modules/checklist/hooks/use-vehicle-checklist-items";
import { FlatList, ListRenderItemInfo, View } from "react-native";

import ChecklistItem from "./components/checklist-item";
import Button from "components/button";
import useAnswerChecklist from "modules/checklist/hooks/use-answer-checklist";
import useConfirmVehicle from "modules/work-journey/hooks/use-confirm-vehicle";
import { router, Stack, useLocalSearchParams } from "expo-router";
import useVehicleDetails from "modules/checklist/hooks/use-vehicle-details";
import dateFnsHelpers from "util/date-fns-helpers";
import Column from "components/column";
import Row from "components/row";
import styled from "styled-components/native";
import Option from "./components/option";
import { VehicleProps } from "modules/checklist/types";
import useAttachedVehiclesStorage from "modules/checklist/storage/use-attached-vehicles-storage";
import AttachedVehicle from "./components/attached-vehice";
import Empty from "components/empty";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import useLogs from "hooks/use-logs";
import getGpsCoordinates from "modules/geolocation/hooks/get-gps-coordinates";

export interface AttachmentProps {
  text?: string;
  image?: string;
  audio?: string;
  video?: string;
}

export type ChecklistItemStatusEnum = "approved" | "disapproved";

export interface ChecklistDraftProps extends AttachmentProps {
  _id: string;
  type: ChecklistItemStatusEnum;
}

const VehicleChecklist: React.FC = () => {
  const { vehicleId } = useLocalSearchParams<{ vehicleId: string }>();
  const { data, isLoading } = useVehicleDetails(vehicleId);
  const vehicleChecklistItemsQuery = useVehicleChecklistItems(vehicleId);
  const [checklist, setChecklist] = useState<ChecklistDraftProps[]>([]);
  const [opened, setOpened] = useState<string[]>([]);
  const flatListRef = useRef<FlatList>(null);
  const answerChecklistMutation = useAnswerChecklist();
  const confirmVehicleMutation = useConfirmVehicle();
  const [showChecklistItems, setShowChecklistItems] = useState(true);
  const { attachedVehicles, setAttachedVehicles } =
    useAttachedVehiclesStorage();
  const { bottom } = useSafeAreaInsets();
  const trackEvent = useLogs();

  const {
    checklistItems,
    disapprovedChecklistItems,
    postMaintenanceChecklistItems,
  } = vehicleChecklistItemsQuery.data;

  useEffect(() => {
    if (opened?.length === 0 && checklistItems?.length > 0) {
      const firstItem = checklistItems[0];

      setOpened([firstItem._id]);
    }
  }, [checklistItems]);

  const reproveChecklistItem = (
    checklistItemId: string,
    attachments: AttachmentProps
  ) => {
    if (!checklistItems) return;

    const answeredItem = checklist.find(
      (checklistItem) => checklistItem._id === checklistItemId
    );

    if (!answeredItem)
      return setChecklist([
        ...checklist,
        { _id: checklistItemId, type: "disapproved", ...attachments },
      ]);

    setChecklist(
      checklist.map((checklistItem) =>
        checklistItem._id === checklistItemId
          ? { ...checklistItem, ...attachments, type: "disapproved" }
          : checklistItem
      )
    );
  };

  const approveChecklistItem = (checklistItemId: string, image?: string) => {
    if (!checklistItems) return;

    openNextItem(checklistItemId);

    const answeredItem = checklist.find(
      (checklistItem) => checklistItem._id === checklistItemId
    );

    const approvedItem = {
      _id: checklistItemId,
      type: "approved",
      image,
    } as ChecklistDraftProps;

    if (!answeredItem)
      return setChecklist((checklist) => [...checklist, approvedItem]);

    setChecklist(
      checklist.map((checklistItem) =>
        checklistItem._id === checklistItemId ? approvedItem : checklistItem
      )
    );
  };

  const openNextItem = (checklistItemId: string) => {
    const answeredIds = checklist.map((checklistItem) => checklistItem._id);
    const answeredIndex = checklistItems?.findIndex(
      (checklistItem) => checklistItem._id === checklistItemId
    );
    const nextIndex = checklistItems?.findIndex(
      (checklistItem) =>
        checklistItem._id !== checklistItemId &&
        !answeredIds.includes(checklistItem._id)
    );
    if (nextIndex < 0) return setOpened([]);

    const isNextItem = checklistItems[nextIndex];
    if (!isNextItem) return setOpened([]);

    setOpened([isNextItem._id]);

    flatListRef.current?.scrollToIndex({
      index: Math.max(0, nextIndex - 1),
      viewOffset:
        nextIndex > answeredIndex && nextIndex !== answeredIndex + 1 ? 100 : 0,
    });
  };

  const toggleOpened = (checklistItemId: string) => {
    if (opened.includes(checklistItemId))
      return setOpened((prev) =>
        prev.filter((someId) => someId !== checklistItemId)
      );

    setOpened((prev) => [...prev, checklistItemId]);
  };

  const renderItem = ({
    item,
  }: ListRenderItemInfo<ChecklistItemProps | VehicleProps>) => {
    if ("plate" in item) return <AttachedVehicle {...item} />;

    const answeredItem = checklist.find(
      (someChecklistItem) => someChecklistItem._id === item._id
    );

    return (
      <ChecklistItem
        {...{
          checklistItem: item,
          reproveChecklistItem,
          approveChecklistItem,
          attachments: answeredItem,
          type: answeredItem?.type,
          opened: opened.includes(item._id),
          setOpened: () => toggleOpened(item._id),
          openNextItem,
        }}
      />
    );
  };

  const handleAnswerChecklist = async () => {
    await answerChecklistMutation.mutate({
      vehicle: data,
      checklist,
      registrationDate: new Date().toISOString(),
    });

    trackEvent("Checklist Answered", { vehicleId, data });

    const isAttachement = data?.type == "ATTACHED";

    if (isAttachement) {
      setAttachedVehicles((prev) => [...prev, data]);
      router.dismiss(2);
      return;
    }

    trackEvent("Vehicle Added", { id: vehicleId, plate: data?.plate });

    const { latitude, longitude } = await getGpsCoordinates();

    await confirmVehicleMutation.mutate({
      latitude,
      longitude,
      conductorVehicle: vehicleId,
      attachedVehicles: attachedVehicles.map((vehicle) => vehicle._id),
      registrationDate: dateFnsHelpers.addSeconds(new Date(), 2),
      vehicle: data,
    });
  };

  return (
    <Container style={{ paddingBottom: 15 + bottom }}>
      <Stack.Screen
        options={{
          title: "Checklist",
          statusBarStyle: "dark",
          headerShown: true,
        }}
      />
      {(isLoading || vehicleChecklistItemsQuery.isLoading) && <Loading />}
      {!isLoading && !vehicleChecklistItemsQuery.isLoading && (
        <FlatList
          ref={flatListRef}
          contentContainerStyle={{
            paddingBottom: 15,
            flexGrow:
              (showChecklistItems ? checklistItems : attachedVehicles)?.length >
              0
                ? undefined
                : 1,
          }}
          ItemSeparatorComponent={() => <View style={{ height: 15 }} />}
          ListEmptyComponent={
            <Empty
              description={
                showChecklistItems
                  ? "Nenhum item encontrado"
                  : "Nenhum veículo informado"
              }
            />
          }
          ListFooterComponent={
            <View style={{ paddingTop: 20, paddingHorizontal: 15 }}>
              <Button
                label={showChecklistItems ? "Finalizar" : "Selecionar veículo"}
                isLoading={
                  answerChecklistMutation.isLoading ||
                  confirmVehicleMutation.isLoading
                }
                onPress={() =>
                  showChecklistItems
                    ? handleAnswerChecklist()
                    : router.push({
                        pathname: "/checklists/select-vehicle",
                        params: { type: "ATTACHED" },
                      })
                }
              />
            </View>
          }
          ListHeaderComponent={
            <>
              {!!data?.imageFile?.url && (
                <Header
                  resizeMode="center"
                  source={{
                    uri: data.imageFile.url,
                  }}
                >
                  <Overlay />
                </Header>
              )}
              <Content>
                <SemilBoldText size="medium">Veículo</SemilBoldText>
                <Card>
                  <Column>
                    <BoldText size="medium">{data?.plate}</BoldText>
                    <RegularText size="small">
                      Modelo: {data?.model}
                    </RegularText>
                  </Column>
                  <Row justifyContent="space-between">
                    <Column>
                      <RegularText color="gray" size="small">
                        Checklist
                      </RegularText>
                      <RegularText>
                        {checklist?.length}/{checklistItems?.length}
                      </RegularText>
                    </Column>
                    <Column>
                      <RegularText color="gray" size="small">
                        Em manutenção
                      </RegularText>
                      <RegularText>
                        {disapprovedChecklistItems?.length}
                      </RegularText>
                    </Column>
                    <Column>
                      <RegularText color="gray" size="small">
                        Devolvido manutenção
                      </RegularText>
                      <RegularText>
                        {postMaintenanceChecklistItems?.length}
                      </RegularText>
                    </Column>
                  </Row>
                </Card>
                {data?.type === "CONDUCTOR" && data?.canBeAttached && (
                  <>
                    <SemilBoldText>Ações</SemilBoldText>
                    <Row
                      style={{
                        backgroundColor: "white",
                        alignSelf: "flex-start",
                        borderRadius: 15,
                        padding: 3,
                      }}
                    >
                      <Option
                        label="Responder checklist"
                        active={showChecklistItems}
                        onPress={() => setShowChecklistItems(true)}
                        icon={"clipboard-list"}
                      />
                      <Option
                        label="Acoplar veículos"
                        active={!showChecklistItems}
                        onPress={() => setShowChecklistItems(false)}
                        icon={"truck-trailer"}
                      />
                    </Row>
                  </>
                )}
                <SemilBoldText size="medium">
                  {showChecklistItems
                    ? "Itens do checklist"
                    : "Veículos acoplados"}
                </SemilBoldText>
              </Content>
            </>
          }
          {...{
            data: showChecklistItems ? checklistItems : attachedVehicles,
            renderItem,
          }}
        />
      )}
    </Container>
  );
};

export default VehicleChecklist;

const Container = styled.View`
  flex: 1;
  background-color: #f1f0f5;
`;

const Header = styled.ImageBackground`
  height: 140px;
  background-color: #959096;
`;

const Content = styled.View`
  padding: 15px;
  gap: 15px;
`;

const Card = styled.View`
  padding: 15px;
  border-radius: 10px;
  background-color: white;
  width: 100%;
  gap: 10px;
`;

const Overlay = styled.View`
  flex: 1;
  background-color: rgba(0, 0, 0, 0.3);
`;

const Line = styled.View`
  height: 1px;
  width: 100%;
  background-color: rgba(128, 128, 128, 0.4);
`;
